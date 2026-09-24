import { getAst } from '../../cache/ast-manager';
import { isProgram, extractEntryKey } from '../../parser/ast-utils';
import {
    Node,
    Class as PhpClass,
    Method,
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
 * Checks whether an AST node matches the target class declaration.
 *
 * @param {Node} child - Candidate node.
 * @param {string} className - Class name.
 * @returns {boolean} True if matching class.
 */
function isTargetClass(child: Node, className: string): boolean {
    const classNode = child as PhpClass;
    return child.kind === 'class' && getNodeName(classNode.name) === className;
}

/**
 * Finds a class definition node by class name from a Program AST.
 *
 * @param {Node[]} children - AST program children.
 * @param {string} className - Target class name.
 * @returns {PhpClass | null} Found class node or null.
 */
function findClassNode(children: Node[], className: string): PhpClass | null {
    for (const child of children) {
        if (isTargetClass(child, className)) {
            return child as PhpClass;
        }
    }
    return null;
}

/**
 * Checks whether a class member matches the target method name.
 *
 * @param {Node} member - Class body element.
 * @param {string} methodName - Target method name.
 * @returns {boolean} True if matching method.
 */
function isTargetMethod(member: Node, methodName: string): boolean {
    const method = member as Method;
    return member.kind === 'method' && getNodeName(method.name) === methodName;
}

/**
 * Finds a method node by method name from a Class AST body.
 *
 * @param {Node[]} bodyElements - Class body elements.
 * @param {string} methodName - Target method name.
 * @returns {Method | null} Found method node or null.
 */
function findMethodNode(bodyElements: Node[], methodName: string): Method | null {
    for (const member of bodyElements) {
        if (isTargetMethod(member, methodName)) {
            return member as Method;
        }
    }
    return null;
}

/**
 * Safely extracts assign expression from statement node.
 *
 * @param {Node} stmt - Statement node.
 * @returns {{ right?: Node } | null} Expression or null.
 */
function extractAssignExpression(stmt: Node): { right?: Node } | null {
    const expr = (stmt as { expression?: { right?: Node } }).expression;
    return expr || null;
}

/**
 * Checks if a node is an AST array kind.
 *
 * @param {Node | undefined} node - Node to check.
 * @returns {boolean} True if array.
 */
function isArrayKind(node: Node | undefined): boolean {
    return Boolean(node && node.kind === 'array');
}

/**
 * Extracts right-side Array node from an assignment statement if present.
 *
 * @param {Node} stmt - Statement node.
 * @returns {PhpArray | null} Found array node or null.
 */
function extractRightArray(stmt: Node): PhpArray | null {
    const expr = extractAssignExpression(stmt);
    const right = expr?.right;
    return isArrayKind(right) ? (right as PhpArray) : null;
}

/**
 * Iterates through statement list looking for an array node.
 *
 * @param {Node[]} statements - Array of statements.
 * @returns {PhpArray | null} Found array node or null.
 */
function searchStatementsForArray(statements: Node[]): PhpArray | null {
    for (const stmt of statements) {
        const arr = extractRightArray(stmt);
        if (arr) {
            return arr;
        }
    }
    return null;
}

/**
 * Extracts the first array node found in a method's body statements.
 *
 * @param {Method} method - Method AST node.
 * @returns {PhpArray | null} Found array node or null.
 */
function findArrayInMethod(method: Method): PhpArray | null {
    const statements = method.body?.children ?? [];
    return searchStatementsForArray(statements);
}

/**
 * Processes a single plugin type array entry and adds it to the map.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {Entry} entry - Associative entry node.
 */
function addPluginEntry(map: Map<string, string>, entry: Entry): void {
    const key = extractEntryKey(entry);
    const pathVal = normalizeRelativePath(entry.value);
    if (key && pathVal) {
        map.set(key, pathVal);
    }
}

/**
 * Iterates through plugin entry items.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {unknown[]} items - Items array.
 */
function iteratePluginItems(map: Map<string, string>, items: unknown[]): void {
    for (const item of items) {
        addPluginEntry(map, item as Entry);
    }
}

/**
 * Populates map with plugin types extracted from array entries.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {PhpArray | null} arrayNode - AST array node.
 */
function populatePlugintypes(map: Map<string, string>, arrayNode: PhpArray | null): void {
    if (arrayNode && Array.isArray(arrayNode.items)) {
        iteratePluginItems(map, arrayNode.items);
    }
}

/**
 * Extracts array node from a specified method in a class.
 *
 * @param {PhpClass} classNode - Class node.
 * @param {string} methodName - Method name.
 * @returns {PhpArray | null} Array node or null.
 */
function extractMethodArray(classNode: PhpClass, methodName: string): PhpArray | null {
    const method = findMethodNode(classNode.body, methodName);
    return method ? findArrayInMethod(method) : null;
}

import { findFirstFile } from '../../scanner/scanner';
import path from 'path';

/**
 * Loads AST of lib/classes/component.php directly or via dynamic pattern search.
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<unknown>} Parsed AST.
 */
async function loadClassComponentAst(moodlePath: string): Promise<unknown> {
    try {
        return await getAst('lib/classes/component.php', moodlePath);
    } catch {
        const found = await findFirstFile(moodlePath, 'lib/classes/component.php');
        if (found) {
            const relPath = path.relative(moodlePath, found);
            return await getAst(relPath, moodlePath);
        }
        throw new Error(`Unable to resolve component class from lib/classes/component.php in ${moodlePath}`);
    }
}

/**
 * Resolves plugintypes map by parsing lib/classes/component.php AST (Moodle 2.6 - 3.7).
 *
 * @example
 * ```ts
 * const map = await resolveClassComponents('/var/www/moodle');
 * map.get('mod');  // 'mod'
 * map.get('tool'); // 'admin/tool'
 * ```
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Plugintypes to directory mapping.
 */
export async function resolveClassComponents(moodlePath: string): Promise<Map<string, string>> {
    const ast = await loadClassComponentAst(moodlePath);

    if (!isProgram(ast)) {
        throw new Error(`Unable to resolve component class from lib/classes/component.php in ${moodlePath}`);
    }

    const classNode = findClassNode(ast.children, 'core_component');
    if (!classNode) {
        throw new Error(`core_component class not found in lib/classes/component.php`);
    }

    const map = new Map<string, string>();
    populatePlugintypes(map, extractMethodArray(classNode, 'fetch_plugintypes'));
    return map;
}
