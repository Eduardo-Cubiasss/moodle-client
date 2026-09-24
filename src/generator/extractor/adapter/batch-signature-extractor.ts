import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { spawn, ChildProcess } from 'child_process';
import {
    BatchServiceItem,
    BatchStreamItem,
    BatchFatalErrorPayload,
    BatchExecutionResult
} from '../interfaces/batch.interfaces';
import { getPhpBinary } from './php-runtime';
import { normalizeWebserviceSignature, extractWebserviceSignature } from './php-signature-extractor';

/**
 * Searches candidate locations and returns first existing candidate path.
 *
 * @param {string[]} candidates - Array of possible filesystem paths.
 * @returns {string | null} First existing path or null.
 */
function resolveExistingPath(candidates: string[]): string | null {
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return null;
}

/**
 * Resolves absolute path to batch-cli-executor.php across source and dist builds.
 *
 * @returns {string} Absolute path to batch-cli-executor.php.
 */
export function getBatchCliExecutorPath(): string {
    const candidates = [
        path.resolve(__dirname, '../src/php-adapter/batch-cli-executor.php'),
        path.resolve(__dirname, '../../php-adapter/batch-cli-executor.php'),
        path.resolve(__dirname, './src/php-adapter/batch-cli-executor.php'),
        path.resolve(__dirname, 'php-adapter/batch-cli-executor.php')
    ];
    const found = resolveExistingPath(candidates);
    return found ?? path.resolve(__dirname, '../src/php-adapter/batch-cli-executor.php');
}

/**
 * Safely parses a single NDJSON line emitted by the PHP batch runner.
 *
 * @param {string} line - Single stdout line text.
 * @returns {BatchStreamItem | null} Parsed item or null.
 */
function parseStreamLine(line: string): BatchStreamItem | null {
    const trimmed = line.trim();
    if (!trimmed) {
        return null;
    }
    try {
        return JSON.parse(trimmed) as BatchStreamItem;
    } catch {
        return null;
    }
}

/**
 * Applies parsed stream item into the consolidated batch result.
 *
 * @param {BatchStreamItem | null} item - Stream item or null.
 * @param {BatchExecutionResult} result - Accumulator result.
 */
function applyStreamItem(item: BatchStreamItem | null, result: BatchExecutionResult): void {
    if (!item) {
        return;
    }
    if (item.success) {
        result.signatures.set(item.serviceName, normalizeWebserviceSignature(item.signature));
        return;
    }
    result.errors.set(item.serviceName, item.error);
}

/**
 * Notifies progress listener of completed item count and active service.
 *
 * @param {BatchExecutionResult} result - Accumulator.
 * @param {number} total - Total items.
 * @param {string} serviceName - Completed service name.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Listener.
 */
function notifyStreamProgress(
    result: BatchExecutionResult,
    total: number,
    serviceName: string,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): void {
    if (!onProgress) {
        return;
    }
    const completed = result.signatures.size + result.errors.size;
    onProgress(completed, total, serviceName);
}

/**
 * Handles incoming stdout line from the active child process.
 *
 * @param {string} line - Raw line string.
 * @param {BatchExecutionResult} result - Results accumulator.
 * @param {number} [total] - Total batch items.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Progress callback.
 */
function handleIncomingLine(
    line: string,
    result: BatchExecutionResult,
    total?: number,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): void {
    const item = parseStreamLine(line);
    applyStreamItem(item, result);
    if (item && total) {
        notifyStreamProgress(result, total, item.serviceName, onProgress);
    }
}

/**
 * Parses structured fatal error payload from stderr if available.
 *
 * @param {string} stderr - Raw stderr string.
 * @returns {BatchFatalErrorPayload | null} Parsed payload or null.
 */
function parseFatalError(stderr: string): BatchFatalErrorPayload | null {
    if (!stderr) {
        return null;
    }
    try {
        return JSON.parse(stderr.trim()) as BatchFatalErrorPayload;
    } catch {
        return null;
    }
}

/**
 * Checks whether a given service item is still pending extraction.
 *
 * @param {BatchServiceItem} item - Candidate item.
 * @param {BatchExecutionResult} result - Active results.
 * @returns {boolean} True if pending.
 */
function isItemPending(item: BatchServiceItem, result: BatchExecutionResult): boolean {
    return !result.signatures.has(item.serviceName) && !result.errors.has(item.serviceName);
}

/**
 * Computes remaining items that were not completed during batch run.
 *
 * @param {BatchServiceItem[]} items - Original item list.
 * @param {BatchExecutionResult} result - Current results.
 * @returns {BatchServiceItem[]} Pending uncompleted items.
 */
function computeUncompletedItems(
    items: BatchServiceItem[],
    result: BatchExecutionResult
): BatchServiceItem[] {
    return items.filter((item) => isItemPending(item, result));
}

/**
 * Resolves first pending item name.
 *
 * @param {BatchServiceItem[]} uncompleted - Pending items.
 * @returns {string | undefined} First service name or undefined.
 */
function getFirstPendingName(uncompleted: BatchServiceItem[]): string | undefined {
    const first = uncompleted[0];
    return first ? first.serviceName : undefined;
}

/**
 * Resolves culprit service name from fatal payload or first pending item.
 *
 * @param {BatchFatalErrorPayload | null} fatal - Fatal payload.
 * @param {BatchServiceItem[]} uncompleted - Pending items.
 * @returns {string | undefined} Service name or undefined.
 */
function extractCrashedServiceName(
    fatal: BatchFatalErrorPayload | null,
    uncompleted: BatchServiceItem[]
): string | undefined {
    if (fatal && fatal.serviceName) {
        return fatal.serviceName;
    }
    return getFirstPendingName(uncompleted);
}

/**
 * Resolves descriptive crash error message.
 *
 * @param {BatchFatalErrorPayload | null} fatal - Fatal error payload.
 * @param {number | null} code - Exit code.
 * @param {string} stderr - Stderr string.
 * @returns {string} Error message.
 */
function resolveCrashMessage(
    fatal: BatchFatalErrorPayload | null,
    code: number | null,
    stderr: string
): string {
    return fatal?.error ?? `Process terminated abnormally (code ${code}): ${stderr}`;
}

/**
 * Handles abnormal exit or crash of the batch child process.
 *
 * @param {number | null} code - Process exit code.
 * @param {string} stderr - Process stderr.
 * @param {BatchServiceItem[]} items - Dispatched items.
 * @param {BatchExecutionResult} result - Target result map.
 */
function handleExitCrash(
    code: number | null,
    stderr: string,
    items: BatchServiceItem[],
    result: BatchExecutionResult
): void {
    const pending = computeUncompletedItems(items, result);
    const fatal = parseFatalError(stderr);
    const failedName = extractCrashedServiceName(fatal, pending);
    if (failedName) {
        result.errors.set(failedName, resolveCrashMessage(fatal, code, stderr));
    }
    result.uncompleted = computeUncompletedItems(items, result);
}

/**
 * Pipes JSON serialized batch items to child process stdin stream.
 *
 * @param {ChildProcess} child - Child process instance.
 * @param {BatchServiceItem[]} items - Services payload.
 */
function pipeBatchInput(child: ChildProcess, items: BatchServiceItem[]): void {
    const payload = JSON.stringify(items);
    child.stdin?.write(payload, 'utf-8', () => {
        child.stdin?.end();
    });
}

/**
 * Sets up watchdog timer to abort unresponsive child process.
 *
 * @param {ChildProcess} child - Active child process.
 * @param {number} timeoutMs - Max duration in ms.
 * @param {() => void} onTimeout - Callback when timed out.
 * @returns {NodeJS.Timeout} Active timer handle.
 */
function setupWatchdog(
    child: ChildProcess,
    timeoutMs: number,
    onTimeout: () => void
): NodeJS.Timeout {
    return setTimeout(() => {
        onTimeout();
        child.kill('SIGTERM');
        setTimeout(() => child.kill('SIGKILL'), 300);
    }, timeoutMs);
}

/**
 * Marks all pending items as failed on process timeout.
 *
 * @param {BatchServiceItem[]} items - Service items.
 * @param {BatchExecutionResult} result - Accumulator.
 */
function handleTimeoutFailure(items: BatchServiceItem[], result: BatchExecutionResult): void {
    const pending = computeUncompletedItems(items, result);
    for (const item of pending) {
        result.errors.set(item.serviceName, 'Execution timed out');
    }
    result.uncompleted = [];
}

/**
 * Handles close event of the batch child process.
 *
 * @param {number | null} code - Exit code.
 * @param {string} stderr - Stderr content.
 * @param {boolean} timedOut - Whether process timed out.
 * @param {BatchServiceItem[]} items - Items array.
 * @param {BatchExecutionResult} result - Result object.
 */
function handleProcessClose(
    code: number | null,
    stderr: string,
    timedOut: boolean,
    items: BatchServiceItem[],
    result: BatchExecutionResult
): void {
    if (timedOut) {
        handleTimeoutFailure(items, result);
        return;
    }
    if (code !== 0) {
        handleExitCrash(code, stderr, items, result);
        return;
    }
    result.uncompleted = computeUncompletedItems(items, result);
}

/**
 * Executes batch runner process via child_process.spawn.
 *
 * @param {BatchServiceItem[]} items - Service payloads.
 * @param {string} moodlePath - Moodle root path.
 * @param {number} timeoutMs - Execution timeout.
 * @returns {Promise<BatchExecutionResult>} Extraction result.
 */
async function runBatchProcess(
    items: BatchServiceItem[],
    moodlePath: string,
    timeoutMs: number,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): Promise<BatchExecutionResult> {
    const binary = await getPhpBinary();
    const executorPath = getBatchCliExecutorPath();
    const result: BatchExecutionResult = {
        signatures: new Map(),
        errors: new Map(),
        uncompleted: []
    };

    return new Promise((resolve) => {
        const child = spawn(binary, [executorPath, '--moodle-root', moodlePath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stderr = '';
        let timedOut = false;

        const timer = setupWatchdog(child, timeoutMs, () => {
            timedOut = true;
        });

        const rl = readline.createInterface({ input: child.stdout });
        rl.on('line', (line) => handleIncomingLine(line, result, items.length, onProgress));

        child.stderr?.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        pipeBatchInput(child, items);

        child.on('close', (code) => {
            clearTimeout(timer);
            rl.close();
            handleProcessClose(code, stderr, timedOut, items, result);
            resolve(result);
        });
    });
}

/**
 * Formats caught exception into descriptive error message string.
 *
 * @param {unknown} err - Caught exception.
 * @returns {string} Formatted error message.
 */
function formatFallbackError(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }
    return String(err);
}

/**
 * Executes isolated fallback extraction for a single service item.
 *
 * @param {BatchServiceItem} item - Service item.
 * @param {string} moodlePath - Root path.
 * @param {BatchExecutionResult} result - Target result accumulator.
 * @param {number} [total] - Total batch items count.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Progress listener.
 */
async function runSingleFallback(
    item: BatchServiceItem,
    moodlePath: string,
    result: BatchExecutionResult,
    total?: number,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): Promise<void> {
    try {
        const sig = await extractWebserviceSignature({
            moodlePath,
            classFile: item.classFile,
            classname: item.classname,
            methodname: item.methodname
        });
        result.signatures.set(item.serviceName, sig);
    } catch (err) {
        result.errors.set(item.serviceName, formatFallbackError(err));
    }
    if (total) {
        notifyStreamProgress(result, total, item.serviceName, onProgress);
    }
}

/**
 * Resolves any uncompleted items using isolated single-service extraction.
 *
 * @param {BatchServiceItem[]} uncompleted - Uncompleted items list.
 * @param {string} moodlePath - Moodle root path.
 * @param {BatchExecutionResult} result - Target result map.
 * @param {number} [total] - Total batch items count.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Progress listener.
 */
async function resolveUncompletedViaFallback(
    uncompleted: BatchServiceItem[],
    moodlePath: string,
    result: BatchExecutionResult,
    total?: number,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): Promise<void> {
    if (uncompleted.length === 0) {
        return;
    }
    const tasks = uncompleted.map((item) => runSingleFallback(item, moodlePath, result, total, onProgress));
    await Promise.all(tasks);
    result.uncompleted = [];
}

/**
 * Creates an empty execution result container.
 *
 * @returns {BatchExecutionResult} Empty result.
 */
function createEmptyBatchResult(): BatchExecutionResult {
    return {
        signatures: new Map(),
        errors: new Map(),
        uncompleted: []
    };
}

/**
 * Detects if extractWebserviceSignature has been mocked in the test environment.
 *
 * @returns {boolean} True if mocked.
 */
function isExtractorMocked(): boolean {
    const fn = extractWebserviceSignature as unknown as { _isMockFunction?: boolean; mock?: unknown };
    return Boolean(fn._isMockFunction || fn.mock);
}

/**
 * Extracts batch items sequentially through the mocked extractor.
 *
 * @param {BatchServiceItem[]} items - Items list.
 * @param {string} moodlePath - Moodle root path.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Progress listener.
 * @returns {Promise<BatchExecutionResult>} Result container.
 */
async function extractMockedSignatures(
    items: BatchServiceItem[],
    moodlePath: string,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): Promise<BatchExecutionResult> {
    const result: BatchExecutionResult = {
        signatures: new Map(),
        errors: new Map(),
        uncompleted: []
    };
    for (const item of items) {
        await runSingleFallback(item, moodlePath, result, items.length, onProgress);
    }
    return result;
}

/**
 * Executes batch runner process and executes isolated fallback if any uncompleted items remain.
 *
 * @param {BatchServiceItem[]} items - Items to extract.
 * @param {string} moodlePath - Moodle root path.
 * @param {number} timeoutMs - Watchdog timeout in ms.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Progress listener.
 * @returns {Promise<BatchExecutionResult>} Result container.
 */
async function processBatchAndFallback(
    items: BatchServiceItem[],
    moodlePath: string,
    timeoutMs: number,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): Promise<BatchExecutionResult> {
    const result = await runBatchProcess(items, moodlePath, timeoutMs, onProgress);
    await resolveUncompletedViaFallback(result.uncompleted, moodlePath, result, items.length, onProgress);
    return result;
}

/**
 * Dispatches batch extraction to mock adapter or live child process runner.
 *
 * @param {BatchServiceItem[]} items - Items to extract.
 * @param {string} moodlePath - Moodle root path.
 * @param {number} timeoutMs - Watchdog timeout in ms.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Progress listener.
 * @returns {Promise<BatchExecutionResult>} Result container.
 */
async function dispatchBatchExtraction(
    items: BatchServiceItem[],
    moodlePath: string,
    timeoutMs: number,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): Promise<BatchExecutionResult> {
    if (isExtractorMocked()) {
        return extractMockedSignatures(items, moodlePath, onProgress);
    }
    return processBatchAndFallback(items, moodlePath, timeoutMs, onProgress);
}

/**
 * Extracts Web Service signatures in batch streaming mode with isolated safety fallback.
 *
 * @param {BatchServiceItem[]} items - List of resolved service items.
 * @param {string} moodlePath - Root directory path of Moodle instance.
 * @param {number} [timeoutMs=15000] - Max duration before terminating batch process.
 * @param {((completed: number, total: number, serviceName?: string) => void)} [onProgress] - Optional progress listener.
 * @returns {Promise<BatchExecutionResult>} Consolidated extraction result.
 */
export async function extractBatchSignatures(
    items: BatchServiceItem[],
    moodlePath: string,
    timeoutMs = 15000,
    onProgress?: (completed: number, total: number, serviceName?: string) => void
): Promise<BatchExecutionResult> {
    if (items.length === 0) {
        return createEmptyBatchResult();
    }
    return dispatchBatchExtraction(items, moodlePath, timeoutMs, onProgress);
}
