import { getAst } from '../cache/ast-manager';
import { isProgram } from '../parser/ast-utils';
import { ExpressionStatement, Assign, Variable, String as PhpString, Node } from 'php-parser';

/**
 * Checks whether an AST node is a variable node.
 *
 * @param {Node | undefined} node - Node to check.
 * @returns {boolean} True if node is a variable.
 */
function isVariableNode(node: Node | undefined): boolean {
    return Boolean(node && node.kind === 'variable');
}

/**
 * Checks whether an AST node is a variable matching the specified name.
 *
 * @param {Node | undefined} node - Variable node to check.
 * @param {string} targetVar - Target variable name.
 * @returns {boolean} True if matching variable.
 */
function isMatchingVariable(node: Node | undefined, targetVar: string): boolean {
    return isVariableNode(node) && (node as Variable).name === targetVar;
}

/**
 * Extracts the string value from a PHP string node.
 *
 * @param {Node | undefined} node - AST node.
 * @returns {string | null} String value or null.
 */
function getStringValue(node: Node | undefined): string | null {
    if (node?.kind === 'string') {
        return (node as PhpString).value;
    }
    return null;
}

/**
 * Extracts string value from an assignment expression if the variable matches.
 *
 * @param {Assign} expr - Assignment expression node.
 * @param {string} targetVar - Target variable name.
 * @returns {string | null} Assigned string value or null.
 */
function extractFromAssign(expr: Assign, targetVar: string): string | null {
    if (!isMatchingVariable(expr.left, targetVar)) {
        return null;
    }
    return getStringValue(expr.right);
}

/**
 * Obtains the Assign expression from an ExpressionStatement.
 *
 * @param {ExpressionStatement} stmt - Statement node.
 * @returns {Assign | null} Assign node or null.
 */
function getAssignExpression(stmt: ExpressionStatement): Assign | null {
    const expr = stmt.expression as Assign;
    return expr?.kind === 'assign' ? expr : null;
}

/**
 * Extracts string value from a candidate statement if it matches variable assignment.
 *
 * @param {Node} child - AST statement node.
 * @param {string} targetVar - Variable identifier.
 * @returns {string | null} Assigned string value or null.
 */
function extractFromStatement(child: Node, targetVar: string): string | null {
    if (child.kind !== 'expressionstatement') {
        return null;
    }
    const assign = getAssignExpression(child as ExpressionStatement);
    return assign ? extractFromAssign(assign, targetVar) : null;
}

/**
 * Iterates through AST children to locate the release variable assignment.
 *
 * @param {Node[]} children - Array of program children nodes.
 * @returns {string | null} Found release string or null.
 */
function searchChildrenForRelease(children: Node[]): string | null {
    for (const child of children) {
        const found = extractFromStatement(child, 'release');
        if (found) {
            return found;
        }
    }
    return null;
}

/**
 * Searches the program AST children for the $release variable assignment.
 *
 * @param {unknown} ast - Parsed AST of version.php.
 * @returns {string | null} Raw release string or null if not found.
 */
function extractReleaseString(ast: unknown): string | null {
    if (!isProgram(ast)) {
        return null;
    }
    return searchChildrenForRelease(ast.children);
}

/**
 * Sanitizes and extracts the semantic version numbers from a raw Moodle release string.
 *
 * @example
 * ```ts
 * cleanReleaseVersion('2.0.10 (Build: 20120706)'); // returns '2.0.10'
 * cleanReleaseVersion('3.11.2+ (Build: 20210618)'); // returns '3.11.2'
 * ```
 *
 * @param {string} rawRelease - Raw release string from version.php.
 * @returns {string | null} Clean semantic version or null if invalid.
 */
function cleanReleaseVersion(rawRelease: string): string | null {
    const match = rawRelease.trim().match(/^(\d+\.\d+(?:\.\d+)?)/);
    return match && match[1] ? match[1] : null;
}

import { findFiles } from '../scanner/scanner';
import path from 'path';

/**
 * Attempts to parse AST and extract release string from a candidate relative path.
 *
 * @param {string} relPath - Candidate relative path.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<string | null>} Extracted release string or null.
 */
async function tryExtractRelease(relPath: string, moodlePath: string): Promise<string | null> {
    try {
        const ast = await getAst(relPath, moodlePath);
        return extractReleaseString(ast);
    } catch {
        return null;
    }
}

/**
 * Iterates through candidate version.php paths to find the first containing a valid release.
 *
 * @param {string[]} candidates - List of candidate file paths.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<string | null>} First valid release string or null.
 */
async function findReleaseInCandidates(candidates: string[], moodlePath: string): Promise<string | null> {
    const sorted = candidates.sort((a, b) => a.length - b.length);
    for (const candidate of sorted) {
        const relPath = path.relative(moodlePath, candidate);
        const release = await tryExtractRelease(relPath, moodlePath);
        if (release) {
            return release;
        }
    }
    return null;
}

interface DirectResult {
    found: boolean;
    release: string | null;
}

const versionCache = new Map<string, string>();

/**
 * Clears the in-memory version cache.
 *
 * @param {string} [moodlePath] - Optional path to invalidate.
 */
export function clearVersionCache(moodlePath?: string): void {
    if (moodlePath) {
        versionCache.delete(moodlePath);
        return;
    }
    versionCache.clear();
}

/**
 * Attempts to load version.php directly from candidate relative path.
 *
 * @param {string} relPath - Relative file path.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<DirectResult>} Result object.
 */
async function tryFileDirect(relPath: string, moodlePath: string): Promise<DirectResult> {
    try {
        const ast = await getAst(relPath, moodlePath);
        return { found: true, release: extractReleaseString(ast) };
    } catch {
        return { found: false, release: null };
    }
}

/**
 * Attempts to load version.php directly from root (Moodle < 5) or public directory (Moodle >= 5).
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<DirectResult>} Result object.
 */
async function tryDirectVersion(moodlePath: string): Promise<DirectResult> {
    const rootResult = await tryFileDirect('version.php', moodlePath);
    if (rootResult.found) {
        return rootResult;
    }
    return tryFileDirect('public/version.php', moodlePath);
}

/**
 * Searches candidates across file tree for release variable.
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<string | null>} Found release string or null.
 */
async function searchCandidatesRelease(moodlePath: string): Promise<string | null> {
    const candidates = await findFiles(moodlePath, ['*version.php', '*/version.php', '*/*/version.php']);
    return findReleaseInCandidates(candidates, moodlePath);
}

/**
 * Throws descriptive error depending on whether version.php was found without release.
 *
 * @param {boolean} directFound - True if file was found at root.
 * @param {string} moodlePath - Root path of Moodle repository.
 */
function handleMissingRelease(directFound: boolean, moodlePath: string): never {
    if (directFound) {
        throw new Error('Unable to resolve Moodle version from version.php: release variable is missing');
    }
    throw new Error(`Unable to resolve Moodle version: version.php not found in ${moodlePath}`);
}

/**
 * Discovers the release string from root version.php or scans tree candidates.
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<string>} Found release string.
 */
async function discoverReleaseString(moodlePath: string): Promise<string> {
    const direct = await tryDirectVersion(moodlePath);
    if (direct.release) {
        return direct.release;
    }
    const candidateRelease = await searchCandidatesRelease(moodlePath);
    if (candidateRelease) {
        return candidateRelease;
    }
    return handleMissingRelease(direct.found, moodlePath);
}

/**
 * Validates and normalizes raw release into clean semantic version.
 *
 * @param {string} rawRelease - Raw release string from version.php.
 * @returns {string} Clean semantic version.
 */
function validateCleanVersion(rawRelease: string): string {
    const cleanVersion = cleanReleaseVersion(rawRelease);
    if (!cleanVersion) {
        throw new Error(`Unable to resolve Moodle version from version.php: invalid release format "${rawRelease}"`);
    }
    return cleanVersion;
}

/**
 * Resolves and returns the semantic Moodle version from a repository root path.
 *
 * Reads and parses `version.php` quickly into an AST and extracts the `$release` variable.
 *
 * @example
 * ```ts
 * const version = await resolveVersion('/path/to/moodle');
 * // returns '4.5.0'
 * ```
 *
 * @param {string} moodlePath - Root path of the Moodle repository.
 * @returns {Promise<string>} Clean semantic version string (e.g. '2.0.10', '3.11.2', '5.2.2').
 * @throws {Error} When version.php is unreadable or does not contain a valid release variable.
 */
export async function resolveVersion(moodlePath: string): Promise<string> {
    const cached = versionCache.get(moodlePath);
    if (cached) {
        return cached;
    }
    const rawRelease = await discoverReleaseString(moodlePath);
    const clean = validateCleanVersion(rawRelease);
    versionCache.set(moodlePath, clean);
    return clean;
}
