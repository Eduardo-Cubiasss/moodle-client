import fs from 'fs/promises';
import path from 'path';
import { MoodleService } from './interfaces/service-extractor.interfaces';
import {
    WebServiceSchema,
    WebServiceExtractionError,
    ExtractWebserviceResult,
    WebServiceErrorCode,
    ExtractWebserviceOptions,
    ProgressOption,
    WebServiceProgress
} from './interfaces/schema-extractor.interfaces';
import { WebserviceSignature } from './interfaces/signature.interfaces';
import {
    ResolvedServiceEntry,
    BatchServiceItem,
    BatchExecutionResult,
    BatchProgressHandler
} from './interfaces/batch.interfaces';

import { findFiles } from './scanner/scanner';
import { getAst, clearAstCache } from './cache/ast-manager';
import { extractServices } from './extractor/service-extractor';
import { resolveClass } from './resolver/class-resolver';
import { clearVersionCache } from './resolver/version-resolver';
import { clearComponentCache } from './resolver/component-resolver';
import { sanitizeDescription } from './utils/description-utils';
import { cleanupPhpRuntime, validatePhpRuntime } from './adapter/php-runtime';
import { extractBatchSignatures } from './adapter/batch-signature-extractor';
import { ConsoleProgressRenderer, calculateEta } from './utils/console-progress';

export { ExtractWebserviceOptions, ProgressOption, WebServiceProgress };

/**
 * Checks if a service name matches a wildcard prefix filter.
 *
 * @param {string} name - Service name.
 * @param {string} filter - Filter pattern.
 * @returns {boolean} True if matching prefix.
 */
function isPrefixMatch(name: string, filter: string): boolean {
    return filter.endsWith('*') && name.startsWith(filter.slice(0, -1));
}

/**
 * Checks if a service name matches a single filter string pattern.
 *
 * @param {string} name - Service name.
 * @param {string} filter - Filter pattern.
 * @returns {boolean} True if matching.
 */
function isMatch(name: string, filter: string): boolean {
    if (filter === '*' || filter === name) {
        return true;
    }
    return isPrefixMatch(name, filter);
}

/**
 * Checks if a service name matches any of the supplied filter patterns.
 *
 * @param {string} serviceName - Name of the service to check.
 * @param {string[]} [filters] - Optional filter array.
 * @returns {boolean} True if service should be included.
 */
function matchesAnyFilter(serviceName: string, filters?: string[]): boolean {
    if (!filters || filters.length === 0) {
        return true;
    }
    return filters.some(filter => isMatch(serviceName, filter));
}

/**
 * Assembles a WebServiceSchema object from service metadata and extracted signature.
 *
 * @param {MoodleService} service - Service metadata.
 * @param {WebserviceSignature} signature - Extracted parameters and returns.
 * @returns {WebServiceSchema} Assembled schema.
 */
function assembleServiceSchema(
    service: MoodleService,
    signature: WebserviceSignature
): WebServiceSchema {
    const cleanDesc = sanitizeDescription(service.description);
    const schema: WebServiceSchema = {
        name: service.name,
        parameters: signature.parameters,
        returns: signature.returns
    };
    if (cleanDesc) {
        schema.description = cleanDesc;
    }
    return schema;
}

/**
 * Classifies a stat error into a structured WebServiceExtractionError.
 *
 * @param {unknown} err - Caught error.
 * @param {string} moodlePath - Target directory path.
 * @returns {WebServiceExtractionError} Classified error.
 */
function classifyStatError(err: unknown, moodlePath: string): WebServiceExtractionError {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr.code === 'EACCES' || nodeErr.code === 'EPERM') {
        return {
            code: 'PERMISSION_DENIED',
            message: `Permission denied: Cannot access Moodle directory at '${moodlePath}'. Please check filesystem permissions.`
        };
    }
    return {
        code: 'INVALID_MOODLE_PATH',
        message: `The provided Moodle path does not exist on disk: '${moodlePath}'`
    };
}

/**
 * Validates directory existence and type via fs.stat.
 *
 * @param {string} moodlePath - Target path.
 * @returns {Promise<WebServiceExtractionError | null>} Error or null.
 */
async function checkDirectoryStat(moodlePath: string): Promise<WebServiceExtractionError | null> {
    try {
        const stat = await fs.stat(moodlePath);
        if (!stat.isDirectory()) {
            return {
                code: 'INVALID_MOODLE_PATH',
                message: `The provided Moodle path is a file, not a directory: '${moodlePath}'`
            };
        }
        return null;
    } catch (err) {
        return classifyStatError(err, moodlePath);
    }
}

/**
 * Classifies a read/readdir error into a structured WebServiceExtractionError.
 *
 * @param {unknown} err - Caught error.
 * @param {string} moodlePath - Target directory path.
 * @returns {WebServiceExtractionError} Classified error.
 */
function classifyReadError(err: unknown, moodlePath: string): WebServiceExtractionError {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr.code === 'EACCES' || nodeErr.code === 'EPERM') {
        return {
            code: 'PERMISSION_DENIED',
            message: `Permission denied: Cannot read contents of Moodle directory at '${moodlePath}'.`
        };
    }
    return {
        code: 'INVALID_MOODLE_PATH',
        message: `Cannot read directory at '${moodlePath}': ${nodeErr.message}`
    };
}

/**
 * Validates that the Moodle directory has read and list permissions.
 *
 * @param {string} moodlePath - Target path.
 * @returns {Promise<WebServiceExtractionError | null>} Error or null.
 */
async function checkDirectoryReadability(moodlePath: string): Promise<WebServiceExtractionError | null> {
    try {
        await fs.access(moodlePath, fs.constants.R_OK);
        await fs.readdir(moodlePath);
        return null;
    } catch (err) {
        return classifyReadError(err, moodlePath);
    }
}

/**
 * Checks if a specific file exists and is a file.
 *
 * @param {string} filePath - Absolute path to test.
 * @returns {Promise<boolean>} True if file exists.
 */
async function hasVersionFile(filePath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(filePath);
        return stat.isFile();
    } catch {
        return false;
    }
}

/**
 * Checks whether version.php exists directly at the root or under public/.
 *
 * @param {string} moodlePath - Target directory.
 * @returns {Promise<boolean>} True if valid direct root.
 */
async function checkDirectMoodleRoot(moodlePath: string): Promise<boolean> {
    if (await hasVersionFile(path.join(moodlePath, 'version.php'))) {
        return true;
    }
    return hasVersionFile(path.join(moodlePath, 'public', 'version.php'));
}

/**
 * Checks subfolder for direct Moodle root and appends to list if found.
 *
 * @param {string} basePath - Parent path.
 * @param {string} subDirName - Subfolder name.
 * @param {string[]} list - Accumulated list.
 */
async function inspectSubEntry(basePath: string, subDirName: string, list: string[]): Promise<void> {
    if (await checkDirectMoodleRoot(path.join(basePath, subDirName))) {
        list.push(subDirName);
    }
}

/**
 * Evaluates a single directory entry and records it if it contains a Moodle root.
 *
 * @param {string} basePath - Parent path.
 * @param {import('fs').Dirent} entry - Directory entry.
 * @param {string[]} list - Accumulated list.
 */
async function processSubMoodleEntry(
    basePath: string,
    entry: import('fs').Dirent,
    list: string[]
): Promise<void> {
    if (entry.isDirectory()) {
        await inspectSubEntry(basePath, entry.name, list);
    }
}

/**
 * Discovers any child directories containing a direct Moodle root.
 *
 * @param {string} moodlePath - Parent directory path.
 * @returns {Promise<string[]>} List of sub-moodle directory names.
 */
async function findSubMoodles(moodlePath: string): Promise<string[]> {
    try {
        const entries = await fs.readdir(moodlePath, { withFileTypes: true });
        const subMoodles: string[] = [];
        for (const entry of entries) {
            await processSubMoodleEntry(moodlePath, entry, subMoodles);
        }
        return subMoodles;
    } catch {
        return [];
    }
}

/**
 * Formats an informative error when a parent directory with sub-moodles was provided instead of a root.
 *
 * @param {string} moodlePath - Provided directory path.
 * @param {string[]} subMoodles - Discovered subdirectories.
 * @returns {WebServiceExtractionError} Descriptive error.
 */
function formatMultipleMoodlesError(moodlePath: string, subMoodles: string[]): WebServiceExtractionError {
    if (subMoodles.length > 1) {
        return {
            code: 'INVALID_MOODLE_PATH',
            message: `The provided path '${moodlePath}' contains multiple Moodle installations (found: ${subMoodles.join(', ')}). Please specify the exact root directory of the desired Moodle instance.`
        };
    }
    return {
        code: 'INVALID_MOODLE_PATH',
        message: `The provided path '${moodlePath}' is not a direct Moodle root. A Moodle codebase was detected in '${path.join(moodlePath, subMoodles[0] ?? '')}'. Please specify the direct Moodle root directory.`
    };
}

/**
 * Validates that the directory has a version.php at its root rather than being a parent container.
 *
 * @param {string} moodlePath - Moodle directory path.
 * @returns {Promise<WebServiceExtractionError | null>} Error or null if valid.
 */
async function validateMoodleRootStructure(moodlePath: string): Promise<WebServiceExtractionError | null> {
    if (await checkDirectMoodleRoot(moodlePath)) {
        return null;
    }
    const subMoodles = await findSubMoodles(moodlePath);
    if (subMoodles.length > 0) {
        return formatMultipleMoodlesError(moodlePath, subMoodles);
    }
    return {
        code: 'INVALID_MOODLE_PATH',
        message: `The provided directory is not a valid Moodle codebase (no version.php found at root): '${moodlePath}'`
    };
}

/**
 * Validates that the provided Moodle path exists, is readable, and is a direct Moodle root.
 *
 * @param {string} moodlePath - Resolved Moodle codebase path.
 * @returns {Promise<WebServiceExtractionError | null>} Error object or null if valid.
 */
async function validateMoodleLocation(moodlePath: string): Promise<WebServiceExtractionError | null> {
    const statError = await checkDirectoryStat(moodlePath);
    if (statError) {
        return statError;
    }
    const readError = await checkDirectoryReadability(moodlePath);
    if (readError) {
        return readError;
    }
    return validateMoodleRootStructure(moodlePath);
}

/**
 * Validates that PHP CLI is installed and compatible (PHP >= 7.4).
 *
 * @returns {Promise<WebServiceExtractionError | null>} Error object or null if valid.
 */
async function validatePhpCliEnvironment(): Promise<WebServiceExtractionError | null> {
    const phpCheck = await validatePhpRuntime();
    if (!phpCheck.valid) {
        return phpCheck.error ?? {
            code: 'PHP_NOT_FOUND',
            message: 'PHP CLI is not installed or not accessible in your system PATH.'
        };
    }
    return null;
}

/**
 * Classifies an execution error into a standardized error code.
 *
 * @param {unknown} err - Error object.
 * @returns {WebServiceErrorCode} Error classification code.
 */
function classifyExecutionError(err: unknown): WebServiceErrorCode {
    const msg = String(err);
    if (/(EACCES|EPERM|Permission denied)/i.test(msg)) {
        return 'PERMISSION_DENIED';
    }
    return 'INTROSPECTION_FAILED';
}

/**
 * Resolves class path for a single Moodle service.
 *
 * @param {MoodleService} service - Service instance.
 * @param {string} moodlePath - Moodle codebase root.
 * @returns {Promise<ResolvedServiceEntry>} Resolved service entry.
 */
async function resolveServiceEntry(
    service: MoodleService,
    moodlePath: string
): Promise<ResolvedServiceEntry> {
    const classFilePath = await resolveClass(service, moodlePath);
    return { service, classFilePath };
}

/**
 * Maps a resolved service entry to a batch item.
 *
 * @param {ResolvedServiceEntry} entry - Resolved service entry.
 * @returns {BatchServiceItem} Batch service item.
 */
function toBatchItem(entry: ResolvedServiceEntry): BatchServiceItem {
    return {
        serviceName: entry.service.name,
        classFile: entry.classFilePath ?? '',
        classname: entry.service.classname,
        methodname: entry.service.methodname ?? 'execute'
    };
}

/**
 * Handles a missing class file entry by appending a CLASS_NOT_FOUND error.
 *
 * @param {MoodleService} service - Target service.
 * @param {WebServiceExtractionError[]} serviceErrors - Errors accumulator.
 */
function handleMissingClassEntry(
    service: MoodleService,
    serviceErrors: WebServiceExtractionError[]
): void {
    serviceErrors.push({
        serviceName: service.name,
        classname: service.classname,
        code: 'CLASS_NOT_FOUND',
        message: `Could not resolve class file on disk for class '${service.classname}'`
    });
}

/**
 * Handles a successfully resolved class entry by queuing it into the batch queue.
 *
 * @param {ResolvedServiceEntry} entry - Resolved entry.
 * @param {BatchServiceItem[]} batchItems - Target batch items list.
 * @param {Map<string, MoodleService>} serviceMap - Services dictionary.
 */
function handleValidEntry(
    entry: ResolvedServiceEntry,
    batchItems: BatchServiceItem[],
    serviceMap: Map<string, MoodleService>
): void {
    batchItems.push(toBatchItem(entry));
    serviceMap.set(entry.service.name, entry.service);
}

/**
 * Dispatches a resolved service entry to missing handler or valid batch queue.
 *
 * @param {ResolvedServiceEntry} entry - Candidate entry.
 * @param {BatchServiceItem[]} batchItems - Target batch items list.
 * @param {WebServiceExtractionError[]} serviceErrors - Errors list.
 * @param {Map<string, MoodleService>} serviceMap - Services dictionary.
 */
function dispatchResolvedEntry(
    entry: ResolvedServiceEntry,
    batchItems: BatchServiceItem[],
    serviceErrors: WebServiceExtractionError[],
    serviceMap: Map<string, MoodleService>
): void {
    if (!entry.classFilePath) {
        handleMissingClassEntry(entry.service, serviceErrors);
        return;
    }
    handleValidEntry(entry, batchItems, serviceMap);
}

/**
 * Collects all declared services from a single db/services.php file.
 *
 * @param {string} filePath - Path to services.php file.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<MoodleService[]>} List of declared services.
 */
async function collectServicesFromFile(filePath: string, moodlePath: string): Promise<MoodleService[]> {
    const servicesAst = await getAst(filePath, moodlePath);
    return extractServices(servicesAst);
}

/**
 * Collects all service definitions from discovered db/services.php files.
 *
 * @param {string[]} serviceFiles - Discovered services.php file paths.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<MoodleService[]>} Flat array of all services.
 */
async function collectAllServices(serviceFiles: string[], moodlePath: string): Promise<MoodleService[]> {
    const tasks = serviceFiles.map(file => collectServicesFromFile(file, moodlePath));
    const results = await Promise.all(tasks);
    return results.flat();
}

/**
 * Normalizes input Moodle directory path to an absolute path supporting home directory expansion.
 *
 * @param {string} rawPath - Input path from options.
 * @returns {string} Normalized absolute path.
 */
function resolveMoodlePath(rawPath: string): string {
    const expanded = rawPath.startsWith('~')
        ? path.join(process.env.HOME ?? '', rawPath.slice(1))
        : rawPath;
    return path.resolve(expanded);
}

/**
 * Maps a successful batch extraction signature to WebServiceSchema list.
 *
 * @param {MoodleService} service - Target service.
 * @param {WebserviceSignature} signature - Extracted signature.
 * @param {WebServiceSchema[]} schemas - Target schema list.
 */
function applyBatchSignature(
    service: MoodleService,
    signature: WebserviceSignature,
    schemas: WebServiceSchema[]
): void {
    schemas.push(assembleServiceSchema(service, signature));
}

/**
 * Maps a failed batch extraction item to WebServiceExtractionError list.
 *
 * @param {MoodleService} service - Target service.
 * @param {string} errorMsg - Raw error string.
 * @param {WebServiceExtractionError[]} serviceErrors - Errors list.
 */
function applyBatchError(
    service: MoodleService,
    errorMsg: string,
    serviceErrors: WebServiceExtractionError[]
): void {
    serviceErrors.push({
        serviceName: service.name,
        classname: service.classname,
        code: classifyExecutionError(errorMsg),
        message: errorMsg,
        cause: errorMsg
    });
}

/**
 * Maps batch extraction outcome for a single service.
 *
 * @param {MoodleService} service - Target service.
 * @param {BatchExecutionResult} batchResult - Completed batch result.
 * @param {WebServiceSchema[]} schemas - Output schemas.
 * @param {WebServiceExtractionError[]} serviceErrors - Output errors.
 */
function mapServiceBatchOutcome(
    service: MoodleService,
    batchResult: BatchExecutionResult,
    schemas: WebServiceSchema[],
    serviceErrors: WebServiceExtractionError[]
): void {
    const sig = batchResult.signatures.get(service.name);
    if (sig) {
        applyBatchSignature(service, sig, schemas);
        return;
    }
    const err = batchResult.errors.get(service.name);
    if (err) {
        applyBatchError(service, err, serviceErrors);
    }
}

/**
 * Collects outcomes across all dispatched batch items.
 *
 * @param {BatchServiceItem[]} batchItems - Processed batch items.
 * @param {Map<string, MoodleService>} serviceMap - Service dictionary.
 * @param {BatchExecutionResult} batchResult - Completed batch result.
 * @param {WebServiceSchema[]} schemas - Target schemas.
 * @param {WebServiceExtractionError[]} serviceErrors - Target errors.
 */
function collectBatchOutcomes(
    batchItems: BatchServiceItem[],
    serviceMap: Map<string, MoodleService>,
    batchResult: BatchExecutionResult,
    schemas: WebServiceSchema[],
    serviceErrors: WebServiceExtractionError[]
): void {
    for (const item of batchItems) {
        const service = serviceMap.get(item.serviceName);
        if (service) {
            mapServiceBatchOutcome(service, batchResult, schemas, serviceErrors);
        }
    }
}

/**
 * Performs environment and path preconditions check.
 *
 * @param {string} moodlePath - Target codebase path.
 * @returns {Promise<WebServiceExtractionError | null>} Error or null if ready.
 */
async function checkPreconditions(moodlePath: string): Promise<WebServiceExtractionError | null> {
    const pathError = await validateMoodleLocation(moodlePath);
    if (pathError) {
        return pathError;
    }
    return validatePhpCliEnvironment();
}

/**
 * Checks if a single filter matched at least one service.
 *
 * @param {string} filter - Filter pattern or name.
 * @param {MoodleService[]} allServices - Available services.
 * @returns {boolean} True if matched.
 */
function isFilterMatched(filter: string, allServices: MoodleService[]): boolean {
    if (filter === '*') {
        return true;
    }
    return allServices.some(service => isMatch(service.name, filter));
}

/**
 * Validates a single filter and collects a SERVICE_NOT_FOUND error if unmatched.
 *
 * @param {string} filter - Filter pattern.
 * @param {MoodleService[]} allServices - All services.
 * @param {WebServiceExtractionError[]} errors - Target error list.
 */
function collectFilterError(
    filter: string,
    allServices: MoodleService[],
    errors: WebServiceExtractionError[]
): void {
    if (!isFilterMatched(filter, allServices)) {
        errors.push({
            serviceName: filter,
            code: 'SERVICE_NOT_FOUND',
            message: `Web service or filter pattern '${filter}' was not found in any declared db/services.php.`
        });
    }
}

/**
 * Discovers any requested service filters that did not match any declared services.
 *
 * @param {string[]} [filters] - User supplied filters.
 * @param {MoodleService[]} allServices - All declared services.
 * @returns {WebServiceExtractionError[]} List of missing service errors.
 */
function findUnmatchedFilterErrors(
    filters: string[] | undefined,
    allServices: MoodleService[]
): WebServiceExtractionError[] {
    const list = filters ?? [];
    const errors: WebServiceExtractionError[] = [];
    for (const filter of list) {
        collectFilterError(filter, allServices, errors);
    }
    return errors;
}

/**
 * Resolves class paths for all services in parallel.
 *
 * @param {MoodleService[]} services - Filtered services.
 * @param {string} moodlePath - Moodle codebase path.
 * @returns {Promise<ResolvedServiceEntry[]>} Array of resolved entries.
 */
async function resolveAllEntries(
    services: MoodleService[],
    moodlePath: string
): Promise<ResolvedServiceEntry[]> {
    return Promise.all(services.map(s => resolveServiceEntry(s, moodlePath)));
}

/**
 * Populates batch items and service errors from resolved entries.
 *
 * @param {ResolvedServiceEntry[]} entries - Resolved entries list.
 * @param {BatchServiceItem[]} batchItems - Target items array.
 * @param {WebServiceExtractionError[]} serviceErrors - Target errors array.
 * @param {Map<string, MoodleService>} serviceMap - Target map.
 */
function populateBatchQueue(
    entries: ResolvedServiceEntry[],
    batchItems: BatchServiceItem[],
    serviceErrors: WebServiceExtractionError[],
    serviceMap: Map<string, MoodleService>
): void {
    for (const entry of entries) {
        dispatchResolvedEntry(entry, batchItems, serviceErrors, serviceMap);
    }
}

/**
 * Calculates integer completion percentage between 0 and 100.
 *
 * @param {number} completed - Completed count.
 * @param {number} total - Total count.
 * @returns {number} Integer percentage.
 */
function calculatePercent(completed: number, total: number): number {
    if (total <= 0) {
        return 0;
    }
    return Math.min(100, Math.round((completed / total) * 100));
}

/**
 * Notifies progress callback with formatted ETA and progress details.
 *
 * @param {((progress: WebServiceProgress) => void)} fn - Target callback.
 * @param {number} completed - Completed items.
 * @param {number} total - Total items.
 * @param {number} startTime - Start timestamp.
 * @param {string} [serviceName] - Active service name.
 */
function notifyCallback(
    fn: (progress: WebServiceProgress) => void,
    completed: number,
    total: number,
    startTime: number,
    serviceName?: string
): void {
    const percent = calculatePercent(completed, total);
    const eta = calculateEta(completed, total, startTime);
    fn({ total, completed, currentService: serviceName, percent, eta });
}

/**
 * Creates a batch progress handler delegating to a custom progress callback.
 *
 * @param {((progress: WebServiceProgress) => void)} fn - Progress callback.
 * @param {number} total - Total count.
 * @returns {BatchProgressHandler} Initialized handler.
 */
function createCallbackProgress(
    fn: (progress: WebServiceProgress) => void,
    total: number
): BatchProgressHandler {
    const startTime = performance.now();
    return {
        onProgress: (completed, tot, serviceName) => notifyCallback(fn, completed, tot, startTime, serviceName),
        finish: () => notifyCallback(fn, total, total, startTime, 'Completed')
    };
}

/**
 * Creates a batch progress handler rendering the interactive terminal card.
 *
 * @param {number} total - Total count.
 * @returns {BatchProgressHandler} Initialized handler.
 */
function createConsoleProgress(total: number): BatchProgressHandler {
    const renderer = new ConsoleProgressRenderer(total);
    return {
        onProgress: (completed, _tot, serviceName) => renderer.update(completed, serviceName),
        finish: () => renderer.finish()
    };
}

/**
 * Creates a no-op progress handler when progress reporting is disabled.
 *
 * @returns {BatchProgressHandler} No-op handler.
 */
function createNoopProgress(): BatchProgressHandler {
    return {
        finish: () => {}
    };
}

/**
 * Determines whether progress reporting should be enabled.
 *
 * @param {number} total - Total items count.
 * @param {ProgressOption} [progressOption] - Configured option.
 * @returns {boolean} True if progress is enabled.
 */
function shouldEnableProgress(total: number, progressOption?: ProgressOption): boolean {
    return total > 0 && Boolean(progressOption);
}

/**
 * Resolves active progress handler based on progress option type.
 *
 * @param {number} total - Total count.
 * @param {ProgressOption} progressOption - Configured option.
 * @returns {BatchProgressHandler} Initialized handler.
 */
function resolveActiveProgress(
    total: number,
    progressOption: ProgressOption
): BatchProgressHandler {
    if (typeof progressOption === 'function') {
        return createCallbackProgress(progressOption, total);
    }
    return createConsoleProgress(total);
}

/**
 * Creates the appropriate progress handler for the batch execution.
 *
 * @param {number} total - Total count.
 * @param {ProgressOption} [progressOption] - Configured option.
 * @returns {BatchProgressHandler} Initialized handler.
 */
function createProgressHandler(
    total: number,
    progressOption?: ProgressOption
): BatchProgressHandler {
    if (!shouldEnableProgress(total, progressOption)) {
        return createNoopProgress();
    }
    return resolveActiveProgress(total, progressOption as ProgressOption);
}

/**
 * Extracts and filters services from discovered services.php files.
 *
 * @param {string[]} serviceFiles - Discovered services.php paths.
 * @param {string} moodlePath - Moodle root path.
 * @param {ExtractWebserviceOptions} options - User options.
 * @returns {Promise<ExtractWebserviceResult>} Extracted schemas and errors.
 */
async function extractDiscoveredServices(
    serviceFiles: string[],
    moodlePath: string,
    options: ExtractWebserviceOptions
): Promise<ExtractWebserviceResult> {
    const allServices = await collectAllServices(serviceFiles, moodlePath);
    const filterErrors = findUnmatchedFilterErrors(options.services, allServices);
    const filtered = allServices.filter(s => matchesAnyFilter(s.name, options.services));

    const entries = await resolveAllEntries(filtered, moodlePath);
    const batchItems: BatchServiceItem[] = [];
    const serviceErrors: WebServiceExtractionError[] = [];
    const serviceMap = new Map<string, MoodleService>();

    populateBatchQueue(entries, batchItems, serviceErrors, serviceMap);

    const progressHandler = createProgressHandler(batchItems.length, options.progress);
    try {
        const batchResult = await extractBatchSignatures(
            batchItems,
            moodlePath,
            15000,
            progressHandler.onProgress
        );
        const schemas: WebServiceSchema[] = [];

        collectBatchOutcomes(batchItems, serviceMap, batchResult, schemas, serviceErrors);

        return { schemas, errors: [...filterErrors, ...serviceErrors] };
    } finally {
        progressHandler.finish();
    }
}

/**
 * Creates an empty result when no services.php files are discovered.
 *
 * @param {string} moodlePath - Moodle directory path.
 * @returns {ExtractWebserviceResult} Empty result with INVALID_MOODLE_PATH error.
 */
function createNoServicesResult(moodlePath: string): ExtractWebserviceResult {
    return {
        schemas: [],
        errors: [
            {
                code: 'INVALID_MOODLE_PATH',
                message: `The provided directory is not a valid Moodle codebase (no services.php files discovered): ${moodlePath}`
            }
        ]
    };
}

/**
 * Extracts Web Service schemas from a local Moodle repository with optional service filtering and error tracking.
 *
 * @example
 * 1. Extract all available Web Services and handle results/errors:
 * ```ts
 * import { extractWebservice } from '@didactika/moodle-client-schemas';
 *
 * const { schemas, errors } = await extractWebservice({
 *     moodlePath: '/var/www/moodle'
 * });
 * console.log('Extracted: ' + schemas.length + ', Errors: ' + errors.length);
 * ```
 *
 * @example
 * 2. Filter by component prefix using wildcard patterns:
 * ```ts
 * const { schemas, errors } = await extractWebservice({
 *     moodlePath: '~/moodle',
 *     services: ['core_user_*', 'mod_forum_*', 'enrol_manual_*']
 * });
 * ```
 *
 * @param {ExtractWebserviceOptions} options - Extraction configuration options.
 * @returns {Promise<ExtractWebserviceResult>} Combined result with schemas and error details.
 */
export async function extractWebservice(
    options: ExtractWebserviceOptions
): Promise<ExtractWebserviceResult> {
    try {
        const moodlePath = resolveMoodlePath(options.moodlePath);

        const envError = await checkPreconditions(moodlePath);
        if (envError) {
            return { schemas: [], errors: [envError] };
        }

        const serviceFiles = await findFiles(moodlePath, ['*/db/services.php']);
        if (serviceFiles.length === 0) {
            return createNoServicesResult(moodlePath);
        }

        return await extractDiscoveredServices(serviceFiles, moodlePath, options);
    } finally {
        clearAstCache();
        clearVersionCache();
        clearComponentCache();
        await cleanupPhpRuntime();
    }
}
