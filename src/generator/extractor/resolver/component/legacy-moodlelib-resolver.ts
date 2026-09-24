import fs from 'fs/promises';
import path from 'path';
import AstParser from '../../parser/ast-parser';
import { trimPhpFunction } from '../../scanner/scanner';
import { isProgram, extractEntryKey } from '../../parser/ast-utils';
import {
    Node,
    Function as PhpFunction,
    Entry,
    Array as PhpArray,
    PropertyLookup,
    String as PhpString,
    Bin as PhpBin,
    Identifier
} from 'php-parser';

/**
 * Extracts property name from a PropertyLookup offset object.
 *
 * @param {PropertyLookup} node - Property lookup node.
 * @returns {string} Property name string.
 */
function extractOffsetName(node: PropertyLookup): string {
    const offset = node.offset as { name?: unknown };
    return offset?.name ? String(offset.name) : '';
}

/**
 * Resolves property lookup identifiers (e.g. $CFG->admin -> 'admin', $CFG->dirroot -> '').
 *
 * @param {PropertyLookup} node - Property lookup node.
 * @returns {string} Resolved identifier string.
 */
function resolvePropertyLookup(node: PropertyLookup): string {
    const name = extractOffsetName(node);
    return name === 'admin' ? 'admin' : '';
}

/**
 * Resolves binary concatenation node into string pieces.
 *
 * @param {PhpBin} bin - Binary expression.
 * @returns {string} Concatenated string.
 */
function resolveBinFragment(bin: PhpBin): string {
    return resolvePathFragment(bin.left) + resolvePathFragment(bin.right);
}

/**
 * Resolves string literal or property lookup node into string value.
 *
 * @param {Node} node - AST node.
 * @returns {string} Resolved string.
 */
function resolveStringOrLookup(node: Node): string {
    if (node.kind === 'string') {
        return (node as PhpString).value;
    }
    if (node.kind === 'propertylookup') {
        return resolvePropertyLookup(node as PropertyLookup);
    }
    return '';
}

/**
 * Resolves recognized AST node kinds into path string values.
 *
 * @param {Node} node - AST node.
 * @returns {string} Resolved string.
 */
function resolveNodeKind(node: Node): string {
    if (node.kind === 'bin') {
        return resolveBinFragment(node as PhpBin);
    }
    return resolveStringOrLookup(node);
}

/**
 * Recursively resolves AST nodes into a normalized relative path string.
 *
 * @param {Node | null | undefined} node - AST node representing path expression.
 * @returns {string} Resolved partial path string.
 */
function resolvePathFragment(node: Node | null | undefined): string {
    if (!node) {
        return '';
    }
    return resolveNodeKind(node);
}

/**
 * Cleans leading, trailing, and duplicate slashes from a path string.
 *
 * @param {string} raw - Raw path string.
 * @returns {string | null} Cleaned path or null.
 */
function cleanPathString(raw: string): string | null {
    const cleaned = raw.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
    return cleaned.length > 0 ? cleaned : null;
}

/**
 * Normalizes an AST path value node into a clean relative directory path.
 *
 * @param {Node | null | undefined} node - AST node value.
 * @returns {string | null} Clean relative path or null for explicit null values.
 */
function normalizeRelativePath(node: Node | null | undefined): string | null {
    if (!node || node.kind === 'nullkeyword') {
        return null;
    }
    return cleanPathString(resolvePathFragment(node));
}

/**
 * Safely resolves identifier name string from string or Identifier node.
 *
 * @param {string | Identifier | null | undefined} name - Target identifier.
 * @returns {string} Extracted name.
 */
function getNodeName(name: string | Identifier | null | undefined): string {
    if (!name) {
        return '';
    }
    return typeof name === 'string' ? name : name.name;
}

/**
 * Checks if a node is an AST function matching target name.
 *
 * @param {Node} child - AST node.
 * @param {string} fnName - Target function name.
 * @returns {boolean} True if matching function.
 */
function isTargetFunction(child: Node, fnName: string): boolean {
    const fn = child as PhpFunction;
    return child.kind === 'function' && getNodeName(fn.name) === fnName;
}

/**
 * Finds a function node by name from program children.
 *
 * @param {Node[]} children - Array of program children.
 * @param {string} fnName - Target function name.
 * @returns {PhpFunction | null} Found function node or null.
 */
function findFunctionNode(children: Node[], fnName: string): PhpFunction | null {
    for (const child of children) {
        if (isTargetFunction(child, fnName)) {
            return child as PhpFunction;
        }
    }
    return null;
}

/**
 * Checks if statement assigns to $info variable.
 *
 * @param {Node} stmt - Candidate statement.
 * @returns {boolean} True if left is $info.
 */
function isInfoAssignment(stmt: Node): boolean {
    const assign = (stmt as { expression?: { left?: { name?: string } } }).expression;
    return assign?.left?.name === 'info';
}

/**
 * Extracts right side expression from statement node.
 *
 * @param {Node} stmt - Statement node.
 * @returns {Node | undefined} Right node.
 */
function extractAssignRight(stmt: Node): Node | undefined {
    const expr = (stmt as { expression?: { right?: Node } }).expression;
    return expr?.right;
}

/**
 * Checks if a node is an AST array kind.
 *
 * @param {Node | undefined} node - Node to check.
 * @returns {boolean} True if array.
 */
function isArrayNode(node: Node | undefined): boolean {
    return Boolean(node && node.kind === 'array');
}

/**
 * Extracts right-side array from statement if it assigns to $info.
 *
 * @param {Node} stmt - Statement node.
 * @returns {PhpArray | null} Found array or null.
 */
function extractRightArrayIfInfo(stmt: Node): PhpArray | null {
    if (!isInfoAssignment(stmt)) {
        return null;
    }
    const right = extractAssignRight(stmt);
    return isArrayNode(right) ? (right as PhpArray) : null;
}

/**
 * Searches statements inside an if block for the $info array.
 *
 * @param {Node[]} ifChildren - Statements inside if block.
 * @returns {PhpArray | null} Found array or null.
 */
function searchIfBodyForArray(ifChildren: Node[]): PhpArray | null {
    for (const stmt of ifChildren) {
        const arr = extractRightArrayIfInfo(stmt);
        if (arr) {
            return arr;
        }
    }
    return null;
}

/**
 * Extracts statement children from an if AST node body.
 *
 * @param {Node} child - Node to evaluate.
 * @returns {Node[]} Children statement array.
 */
function extractIfChildren(child: Node): Node[] {
    const body = (child as { body?: { children?: Node[] } }).body;
    return body && Array.isArray(body.children) ? body.children : [];
}

/**
 * Locates the $info array inside an if block in get_plugin_types.
 *
 * @param {Node} child - Node to evaluate.
 * @returns {PhpArray | null} Array node or null.
 */
function findArrayInIfNode(child: Node): PhpArray | null {
    if (child.kind !== 'if') {
        return null;
    }
    return searchIfBodyForArray(extractIfChildren(child));
}

/**
 * Searches statements inside function body for the $info array definition.
 *
 * @param {Node[]} body - Statements array.
 * @returns {PhpArray | null} Found array or null.
 */
function searchBodyForInfoArray(body: Node[]): PhpArray | null {
    for (const child of body) {
        const found = findArrayInIfNode(child);
        if (found) {
            return found;
        }
    }
    return null;
}

/**
 * Searches statements inside function body for the $info array definition.
 *
 * @param {PhpFunction} fnNode - Function node.
 * @returns {PhpArray | null} Found array or null.
 */
function findInfoArray(fnNode: PhpFunction): PhpArray | null {
    const body = fnNode.body?.children ?? [];
    return searchBodyForInfoArray(body);
}

/**
 * Processes a single entry from $info array and adds to map.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {unknown} item - Entry node.
 */
function addInfoEntry(map: Map<string, string>, item: unknown): void {
    const entry = item as Entry;
    const key = extractEntryKey(entry);
    const pathVal = normalizeRelativePath(entry.value);
    if (key && pathVal) {
        map.set(key, pathVal);
    }
}

/**
 * Iterates through info array items.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {unknown[]} items - Items array.
 */
function iterateInfoItems(map: Map<string, string>, items: unknown[]): void {
    for (const item of items) {
        addInfoEntry(map, item);
    }
}

/**
 * Populates map with plugin types from entries of $info array.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {PhpArray | null} arrayNode - AST array node.
 */
function populateInfoEntries(map: Map<string, string>, arrayNode: PhpArray | null): void {
    if (arrayNode && Array.isArray(arrayNode.items)) {
        iterateInfoItems(map, arrayNode.items);
    }
}

/**
 * Parses trimmed PHP function source code into an AST root Program node.
 *
 * @param {string} trimmedSource - Sliced PHP source.
 * @returns {unknown} Parsed AST.
 */
function parseTrimmedSnippet(trimmedSource: string): unknown {
    const parser = new AstParser();
    return parser.parse(trimmedSource);
}

import { findFirstFile } from '../../scanner/scanner';

/**
 * Reads source code of legacy moodlelib.php file directly or via dynamic pattern search.
 *
 * @param {string} moodlePath - Path to Moodle repository.
 * @returns {Promise<{ raw: string; filePath: string }>} File content and resolved path.
 */
async function readMoodlelibSource(moodlePath: string): Promise<{ raw: string; filePath: string }> {
    const directPath = path.join(moodlePath, 'lib/moodlelib.php');
    try {
        const raw = await fs.readFile(directPath, 'utf-8');
        return { raw, filePath: directPath };
    } catch {
        const found = await findFirstFile(moodlePath, 'lib/moodlelib.php');
        if (found) {
            const raw = await fs.readFile(found, 'utf-8');
            return { raw, filePath: found };
        }
        throw new Error(`Unable to load legacy moodlelib from ${directPath}`);
    }
}

/**
 * Extracts get_plugin_types function node from parsed program AST.
 *
 * @param {unknown} ast - Program AST.
 * @param {string} filePath - File path context.
 * @returns {PhpFunction} Function node.
 */
function getFunctionNodeFromAst(ast: unknown, filePath: string): PhpFunction {
    if (!isProgram(ast)) {
        throw new Error(`Failed to parse get_plugin_types AST in ${filePath}`);
    }
    const fn = findFunctionNode(ast.children, 'get_plugin_types');
    if (!fn) {
        throw new Error(`Unable to locate get_plugin_types function in moodlelib.php at ${filePath}`);
    }
    return fn;
}

/**
 * Resolves component map from legacy Moodle 2.0 - 2.5 lib/moodlelib.php using textual trimming.
 *
 * Slices the `get_plugin_types()` function block to prevent Node.js memory exhaustion
 * on the 10,000+ line monolith file.
 *
 * @example
 * ```ts
 * const map = await resolveLegacyMoodlelibComponents('/var/www/moodle');
 * map.get('mod');    // 'mod'
 * map.get('report'); // 'admin/report'
 * ```
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Component to directory mapping.
 */
export async function resolveLegacyMoodlelibComponents(moodlePath: string): Promise<Map<string, string>> {
    const { raw, filePath } = await readMoodlelibSource(moodlePath);

    const trimmed = trimPhpFunction(raw, 'get_plugin_types');
    if (!trimmed) {
        throw new Error(`Unable to locate get_plugin_types function in moodlelib.php at ${filePath}`);
    }

    const ast = parseTrimmedSnippet(trimmed);
    const fnNode = getFunctionNodeFromAst(ast, filePath);

    const map = new Map<string, string>();
    map.set('local', 'local');
    populateInfoEntries(map, findInfoArray(fnNode));

    return map;
}
