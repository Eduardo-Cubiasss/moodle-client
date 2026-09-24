import { execFile } from 'child_process';
import fs from 'fs/promises';
import { WebServiceExtractionError } from '../interfaces/schema-extractor.interfaces';

let customPhpBinary: string | null = null;
let cachedSystemPhpBinary: string | null = null;
let temporaryRuntimeDir: string | null = null;

export interface PhpValidationResult {
    valid: boolean;
    error?: WebServiceExtractionError;
    binaryPath?: string;
}

/**
 * Parses major and minor version numbers from php -v stdout.
 *
 * @param {string} stdout - Raw CLI stdout.
 * @returns {{ major: number; minor: number } | null} Version object or null.
 */
function parsePhpVersion(stdout: string): { major: number; minor: number } | null {
    const match = /PHP\s+(\d+)\.(\d+)/i.exec(stdout);
    if (!match || !match[1] || !match[2]) {
        return null;
    }
    return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10)
    };
}

/**
 * Checks if the parsed version satisfies PHP >= 7.4.
 *
 * @param {{ major: number; minor: number }} version - Version object.
 * @returns {boolean} True if supported.
 */
function isCompatiblePhpVersion(version: { major: number; minor: number }): boolean {
    if (version.major > 7) {
        return true;
    }
    return version.major === 7 && version.minor >= 4;
}

/**
 * Executes php -v asynchronously to retrieve version banner.
 *
 * @param {string} binary - Target PHP binary path.
 * @returns {Promise<string | null>} stdout string or null on failure.
 */
function queryPhpVersion(binary: string): Promise<string | null> {
    return new Promise((resolve) => {
        execFile(binary, ['-v'], {}, (error, stdout) => {
            if (error) {
                resolve(null);
            } else {
                resolve(stdout);
            }
        });
    });
}

/**
 * Creates an unsupported version error result.
 *
 * @param {{ major: number; minor: number } | null} version - Detected version or null.
 * @returns {PhpValidationResult} Error validation result.
 */
function createUnsupportedVersionError(version: { major: number; minor: number } | null): PhpValidationResult {
    const detected = version ? `PHP ${version.major}.${version.minor}` : 'Unknown';
    return {
        valid: false,
        error: {
            code: 'PHP_VERSION_UNSUPPORTED',
            message: `Unsupported PHP version detected (${detected}). Moodle schema extraction requires PHP 7.4 or higher. Please upgrade your PHP installation.`
        }
    };
}

/**
 * Evaluates parsed PHP version output for compatibility.
 *
 * @param {string} output - stdout banner.
 * @param {string} binary - Active binary name.
 * @returns {PhpValidationResult} Validation result.
 */
function evaluatePhpBanner(output: string, binary: string): PhpValidationResult {
    const version = parsePhpVersion(output);
    if (!version || !isCompatiblePhpVersion(version)) {
        return createUnsupportedVersionError(version);
    }
    return { valid: true, binaryPath: binary };
}

/**
 * Validates availability and version compatibility of the active PHP CLI runtime.
 *
 * @returns {Promise<PhpValidationResult>} Validation result object with descriptive error if invalid.
 */
export async function validatePhpRuntime(): Promise<PhpValidationResult> {
    const binary = customPhpBinary ?? 'php';
    const output = await queryPhpVersion(binary);
    if (!output) {
        return {
            valid: false,
            error: {
                code: 'PHP_NOT_FOUND',
                message: 'PHP CLI was not found on your system PATH. Please install PHP (>= 7.4) and ensure "php" is executable.'
            }
        };
    }
    return evaluatePhpBanner(output, binary);
}

/**
 * Checks if system PHP CLI is executable.
 *
 * @returns {Promise<boolean>} True if system php is available.
 */
export async function isSystemPhpAvailable(): Promise<boolean> {
    const validation = await validatePhpRuntime();
    return validation.valid;
}

/**
 * Sets a custom PHP binary path manually.
 *
 * @param {string | null} binaryPath - Custom binary path.
 */
export function setPhpBinaryPath(binaryPath: string | null): void {
    customPhpBinary = binaryPath;
}

/**
 * Resolves default or custom failure message when PHP binary cannot be resolved.
 *
 * @param {WebServiceExtractionError} [error] - Validation error.
 * @returns {string} Informative message.
 */
function getBinaryFailureMessage(error?: WebServiceExtractionError): string {
    return error?.message ?? 'PHP binary not found on system. Please install PHP CLI (>= 7.4).';
}

/**
 * Resolves system binary via runtime validation.
 *
 * @returns {Promise<string>} Validated executable path.
 */
async function resolveValidatedBinary(): Promise<string> {
    const validation = await validatePhpRuntime();
    if (validation.valid && validation.binaryPath) {
        return validation.binaryPath;
    }
    throw new Error(getBinaryFailureMessage(validation.error));
}

/**
 * Resolves validated binary and caches it in memory.
 *
 * @returns {Promise<string>} Validated PHP binary path.
 */
async function resolveAndCacheBinary(): Promise<string> {
    const binary = await resolveValidatedBinary();
    cachedSystemPhpBinary = binary;
    return binary;
}

/**
 * Resolves the active PHP binary to use.
 *
 * @returns {Promise<string>} PHP executable path or name.
 */
export async function getPhpBinary(): Promise<string> {
    if (customPhpBinary) {
        return customPhpBinary;
    }
    if (cachedSystemPhpBinary) {
        return cachedSystemPhpBinary;
    }
    return resolveAndCacheBinary();
}

/**
 * Cleans up temporary downloaded PHP runtime if one was provisioned.
 *
 * @returns {Promise<void>}
 */
export async function cleanupPhpRuntime(): Promise<void> {
    cachedSystemPhpBinary = null;
    if (temporaryRuntimeDir) {
        try {
            await fs.rm(temporaryRuntimeDir, { recursive: true, force: true });
        } catch {
            // Ignore cleanup errors
        }
        temporaryRuntimeDir = null;
        customPhpBinary = null;
    }
}
