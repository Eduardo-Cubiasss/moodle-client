import fs from 'fs/promises';
import path from 'path';

const IGNORED_DIRS = [
    'node_modules', 'vendor', '.git', 'tests', 'fixtures',
    'cache', 'localcache', 'pix', 'theme', 'lang', 'install'
];

/**
 * Converts a glob-like path pattern to a cross-platform regular expression.
 *
 * @param {string} pattern - Path pattern (e.g. 'star/db/services.php').
 * @returns {RegExp} Compiled regular expression.
 */
function patternToRegex(pattern: string): RegExp {
    const normalized = pattern.replace(/\\/g, '/');
    const escaped = normalized
        .replace(/[.+^${}()|[\]]/g, '\\$&')
        .replace(/\*/g, '.*');
    return new RegExp(`(?:^|/)${escaped}$`);
}

/**
 * Checks if a relative or absolute path matches any of the compiled regex patterns.
 *
 * @param {string} targetPath - Path to test.
 * @param {RegExp[]} regexes - Array of compiled patterns.
 * @returns {boolean} True if any pattern matches.
 */
function matchesAnyPattern(targetPath: string, regexes: RegExp[]): boolean {
    const normalized = targetPath.replace(/\\/g, '/');
    return regexes.some(rx => rx.test(normalized));
}

/**
 * Reads directory entries safely, returning an empty array on error.
 *
 * @param {string} dir - Directory path to read.
 * @returns {Promise<import('fs').Dirent[]>} Array of directory entries.
 */
async function readDirectoryEntries(dir: string): Promise<import('fs').Dirent[]> {
    try {
        return await fs.readdir(dir, { withFileTypes: true });
    } catch {
        return [];
    }
}

/**
 * Checks if a candidate file matches the relative or absolute path patterns.
 *
 * @param {string} fullPath - Absolute path to file.
 * @param {string} basePath - Base directory path.
 * @param {RegExp[]} regexes - Compiled matching regular expressions.
 * @returns {boolean} True if matching.
 */
function isCandidateMatch(fullPath: string, basePath: string, regexes: RegExp[]): boolean {
    const relPath = path.relative(basePath, fullPath);
    return matchesAnyPattern(relPath, regexes) || matchesAnyPattern(fullPath, regexes);
}

/**
 * Checks if file exists and has size greater than zero.
 *
 * @param {string} fullPath - File path to inspect.
 * @returns {Promise<boolean>} True if non-empty.
 */
async function isNonEmptyFile(fullPath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(fullPath);
        return stat.size > 0;
    } catch {
        return false;
    }
}

/**
 * Verifies file match and size, collecting non-empty matching files.
 *
 * @param {string} fullPath - Full file path.
 * @param {string} basePath - Base directory path.
 * @param {RegExp[]} regexes - Match regexes.
 * @param {string[]} collected - Target array.
 */
async function verifyAndCollectFile(
    fullPath: string,
    basePath: string,
    regexes: RegExp[],
    collected: string[]
): Promise<void> {
    if (!isCandidateMatch(fullPath, basePath, regexes)) {
        return;
    }
    if (await isNonEmptyFile(fullPath)) {
        collected.push(fullPath);
    }
}

/**
 * Processes a directory entry recursively if not ignored.
 *
 * @param {string} fullPath - Directory path.
 * @param {string} entryName - Directory name.
 * @param {string} basePath - Base scan path.
 * @param {RegExp[]} regexes - Patterns.
 * @param {Set<string>} ignoredSet - Ignored directories.
 * @param {string[]} collected - Results.
 */
async function processDirEntry(
    fullPath: string,
    entryName: string,
    basePath: string,
    regexes: RegExp[],
    ignoredSet: Set<string>,
    collected: string[]
): Promise<void> {
    if (!ignoredSet.has(entryName)) {
        await scanDirectory(fullPath, basePath, regexes, ignoredSet, collected);
    }
}

/**
 * Dispatches file or directory processing for a single Dirent.
 *
 * @param {import('fs').Dirent} entry - Dirent entry.
 * @param {string} currentDir - Current directory.
 * @param {string} basePath - Base scan path.
 * @param {RegExp[]} regexes - Patterns.
 * @param {Set<string>} ignoredSet - Ignored directory names.
 * @param {string[]} collected - Collected paths.
 */
async function processEntry(
    entry: import('fs').Dirent,
    currentDir: string,
    basePath: string,
    regexes: RegExp[],
    ignoredSet: Set<string>,
    collected: string[]
): Promise<void> {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
        await processDirEntry(fullPath, entry.name, basePath, regexes, ignoredSet, collected);
    } else if (entry.isFile()) {
        await verifyAndCollectFile(fullPath, basePath, regexes, collected);
    }
}

/**
 * Recursively scans directory and collects matching non-empty file paths.
 *
 * @param {string} currentDir - Current directory path.
 * @param {string} basePath - Base root scan path.
 * @param {RegExp[]} regexes - Compiled matching patterns.
 * @param {Set<string>} ignoredSet - Set of directory names to prune.
 * @param {string[]} collected - Output list.
 */
async function scanDirectory(
    currentDir: string,
    basePath: string,
    regexes: RegExp[],
    ignoredSet: Set<string>,
    collected: string[]
): Promise<void> {
    const entries = await readDirectoryEntries(currentDir);
    for (const entry of entries) {
        await processEntry(entry, currentDir, basePath, regexes, ignoredSet, collected);
    }
}

/**
 * Scans for non-empty files in filesystem matching path pattern while ignoring specified directories.
 * Pure cross-platform Node.js implementation compatible with Windows, macOS, Linux, and WSL2.
 *
 * @param {string} basePath - Base directory path to scan.
 * @param {string[]} pathPatterns - Array of path patterns.
 * @param {string[]} [ignoredDirs=IGNORED_DIRS] - Directories to prune from search.
 * @returns {Promise<string[]>} List of discovered file paths.
 */
export async function findFiles(
    basePath: string,
    pathPatterns: string[],
    ignoredDirs: string[] = IGNORED_DIRS
): Promise<string[]> {
    const regexes = pathPatterns.map(patternToRegex);
    const ignoredSet = new Set(ignoredDirs);
    const collected: string[] = [];
    await scanDirectory(basePath, basePath, regexes, ignoredSet, collected);
    return collected;
}

/**
 * Discovers the first matching file for a relative target pattern across the base directory.
 *
 * @example
 * ```ts
 * await findFirstFile('/var/www/moodle', 'version.php');
 * ```
 *
 * @param {string} basePath - Directory to start search from.
 * @param {string} relativeTarget - Relative target file or path.
 * @returns {Promise<string | null>} First matched file path or null.
 */
export async function findFirstFile(
    basePath: string,
    relativeTarget: string
): Promise<string | null> {
    const patterns = [`*${relativeTarget}`, `*/${relativeTarget}`, `*/*/${relativeTarget}`];
    const results = await findFiles(basePath, patterns);
    if (results.length > 0) {
        return results[0] ?? null;
    }
    return null;
}

/**
 * Finds the start character index of a function definition by name.
 *
 * @param {string} source - PHP source code.
 * @param {string} functionName - Target function name.
 * @returns {number} Start index or -1 if not found.
 */
function findFunctionStartIndex(source: string, functionName: string): number {
    const regex = new RegExp(`\\bfunction\\s+${functionName}\\s*\\(`, 'i');
    const match = regex.exec(source);
    return match ? match.index : -1;
}

/**
 * Computes the updated nesting brace depth for a single character.
 *
 * @param {string} char - Character to evaluate.
 * @param {number} depth - Current nesting depth.
 * @returns {number} Updated nesting depth.
 */
function updateBraceDepth(char: string, depth: number): number {
    if (char === '{') {
        return depth + 1;
    }
    if (char === '}') {
        return depth - 1;
    }
    return depth;
}

/**
 * Scans characters sequentially to identify matching closing brace index.
 *
 * @param {string} source - Source text.
 * @param {number} startIndex - Starting open brace index.
 * @returns {number} Closing brace index or -1 if unclosed.
 */
function findClosingIndex(source: string, startIndex: number): number {
    let depth = 0;
    for (let i = startIndex; i < source.length; i++) {
        const char = source[i];
        if (char) {
            depth = updateBraceDepth(char, depth);
        }
        if (depth === 0) {
            return i;
        }
    }
    return -1;
}

/**
 * Extracts the function block string between its definition and terminating closing brace.
 *
 * @param {string} source - PHP source text.
 * @param {number} startIndex - Function keyword start index.
 * @returns {string | null} Function block or null if incomplete.
 */
function extractFunctionBlock(source: string, startIndex: number): string | null {
    const openIndex = source.indexOf('{', startIndex);
    if (openIndex === -1) {
        return null;
    }
    const closeIndex = findClosingIndex(source, openIndex);
    return closeIndex !== -1 ? source.slice(startIndex, closeIndex + 1) : null;
}

/**
 * Textually slices a PHP function from a large file and wraps it in standalone PHP tags.
 *
 * Prevents memory exhaustion when parsing massive legacy files (e.g. `lib/moodlelib.php`).
 *
 * @example
 * ```ts
 * const rawSnippet = await fs.readFile('lib/moodlelib.php', 'utf-8');
 * const trimmed = trimPhpFunction(rawSnippet, 'get_plugin_types');
 * // returns '<?php\nfunction get_plugin_types(...) { ... }\n'
 * ```
 *
 * @param {string} sourceCode - Raw PHP source code.
 * @param {string} functionName - Name of the PHP function to extract.
 * @returns {string | null} Sliced and wrapped PHP function code, or null if not found.
 */
export function trimPhpFunction(sourceCode: string, functionName: string): string | null {
    const startIndex = findFunctionStartIndex(sourceCode, functionName);
    if (startIndex === -1) {
        return null;
    }
    const block = extractFunctionBlock(sourceCode, startIndex);
    return block ? `<?php\n${block}\n` : null;
}
