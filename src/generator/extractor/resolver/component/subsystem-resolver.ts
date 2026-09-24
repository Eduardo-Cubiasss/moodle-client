import fs from 'fs/promises';
import path from 'path';
import { MoodleComponentsJson } from '../../interfaces/component-resolver.interfaces';
import { getAst } from '../../cache/ast-manager';
import { isProgram, extractEntryKey } from '../../parser/ast-utils';
import {
    Class as PhpClass,
    Method,
    Entry,
    Array as PhpArray,
    Node,
    PropertyLookup,
    String as PhpString,
    Bin as PhpBin
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
 * Resolves property lookup identifiers.
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
 * @returns {string | null} Clean relative path or null.
 */
function normalizeRelativePath(node: Node | null | undefined): string | null {
    if (!node || node.kind === 'nullkeyword') {
        return null;
    }
    return cleanPathString(resolvePathFragment(node));
}

/**
 * Registers a single subsystem entry into the subsystems map.
 *
 * @param {Map<string, string>} map - Target subsystems map.
 * @param {string} name - Subsystem name.
 * @param {string | null} dir - Subsystem directory path or null.
 */
function registerSubsystemEntry(
    map: Map<string, string>,
    name: string,
    dir: string | null
): void {
    const targetDir = dir || 'lib';
    map.set(name, targetDir);
    map.set(`core_${name}`, targetDir);
}

/**
 * Registers all subsystems into the subsystems map.
 *
 * @param {Map<string, string>} map - Target subsystems map.
 * @param {Record<string, string | null>} [subsystems] - Key-value map of subsystems.
 */
function populateSubsystemsFromJson(
    map: Map<string, string>,
    subsystems?: Record<string, string | null>
): void {
    if (!subsystems) {
        return;
    }
    for (const [name, dir] of Object.entries(subsystems)) {
        registerSubsystemEntry(map, name, dir);
    }
}

/**
 * Resolves subsystems from modern Moodle lib/components.json (Moodle >= 3.8).
 *
 * @example
 * ```ts
 * const subsystems = await resolveJsonSubsystems('/var/www/moodle');
 * subsystems.get('core_user'); // 'user'
 * subsystems.get('core');      // 'lib'
 * ```
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Subsystems map.
 */
export async function resolveJsonSubsystems(moodlePath: string): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    map.set('core', 'lib');
    const filePath = path.join(moodlePath, 'lib/components.json');
    try {
        const raw = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw) as MoodleComponentsJson;
        populateSubsystemsFromJson(map, parsed.subsystems);
    } catch {
        return map;
    }
    return map;
}

/**
 * Processes a single subsystem AST entry node.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {unknown} item - AST entry item.
 */
function processSubsystemEntry(map: Map<string, string>, item: unknown): void {
    const entry = item as Entry;
    const key = extractEntryKey(entry);
    if (key) {
        const pathVal = normalizeRelativePath(entry.value);
        registerSubsystemEntry(map, key, pathVal);
    }
}

/**
 * Iterates through subsystem entry items.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {unknown[]} items - Items array.
 */
function iterateSubsystemAstItems(map: Map<string, string>, items: unknown[]): void {
    for (const item of items) {
        processSubsystemEntry(map, item);
    }
}

/**
 * Populates subsystems map from AST array entries.
 *
 * @param {Map<string, string>} map - Target map.
 * @param {PhpArray | null} arrayNode - AST array node.
 */
function populateSubsystemsFromAst(map: Map<string, string>, arrayNode: PhpArray | null): void {
    if (arrayNode && Array.isArray(arrayNode.items)) {
        iterateSubsystemAstItems(map, arrayNode.items);
    }
}

/**
 * Checks if a class member is a method matching the target name.
 *
 * @param {Node} member - Class body member.
 * @param {string} methodName - Target method name.
 * @returns {boolean} True if matching method.
 */
function isTargetMethod(member: Node, methodName: string): boolean {
    const method = member as Method;
    return member.kind === 'method' && (method.name as { name?: string }).name === methodName;
}

/**
 * Checks if a node is an AST array.
 *
 * @param {Node | undefined} node - AST node.
 * @returns {boolean} True if array kind.
 */
function isArrayKind(node: Node | undefined): boolean {
    return Boolean(node && node.kind === 'array');
}

/**
 * Extracts right-side array node from a statement expression.
 *
 * @param {Node} stmt - Statement node.
 * @returns {PhpArray | null} Found array node or null.
 */
function getArrayFromStatement(stmt: Node): PhpArray | null {
    const expr = (stmt as { expression?: { right?: Node } }).expression;
    const right = expr?.right;
    return isArrayKind(right) ? (right as PhpArray) : null;
}

/**
 * Extracts array node from method body statement list.
 *
 * @param {Node[]} statements - Array of body statements.
 * @returns {PhpArray | null} Found array node or null.
 */
function extractArrayFromStatements(statements: Node[]): PhpArray | null {
    for (const stmt of statements) {
        const arr = getArrayFromStatement(stmt);
        if (arr) {
            return arr;
        }
    }
    return null;
}

/**
 * Extracts statement children from method node.
 *
 * @param {Method} method - Method node.
 * @returns {Node[]} Array of statements.
 */
function getMethodStatements(method: Method): Node[] {
    return method.body ? method.body.children : [];
}

/**
 * Extracts array if member matches the target method.
 *
 * @param {Node} member - Class body member.
 * @param {string} methodName - Target method name.
 * @returns {PhpArray | null} Found array or null.
 */
function extractArrayIfTargetMethod(member: Node, methodName: string): PhpArray | null {
    if (isTargetMethod(member, methodName)) {
        return extractArrayFromStatements(getMethodStatements(member as Method));
    }
    return null;
}

/**
 * Finds method in class node and extracts its returned array.
 *
 * @param {PhpClass} classNode - Class node.
 * @param {string} methodName - Target method name.
 * @returns {PhpArray | null} Found array or null.
 */
function extractMethodArray(classNode: PhpClass, methodName: string): PhpArray | null {
    for (const member of classNode.body) {
        const arr = extractArrayIfTargetMethod(member, methodName);
        if (arr) {
            return arr;
        }
    }
    return null;
}

/**
 * Checks if an AST child is the core_component class declaration.
 *
 * @param {Node} child - AST node.
 * @returns {boolean} True if core_component class.
 */
function isCoreComponentClass(child: Node): boolean {
    const classNode = child as PhpClass;
    return child.kind === 'class' && (classNode.name as { name?: string }).name === 'core_component';
}

/**
 * Extracts subsystems from candidate core_component class node into map.
 *
 * @param {Map<string, string>} map - Target subsystems map.
 * @param {Node} child - Potential class node.
 */
function extractSubsystemsFromClass(map: Map<string, string>, child: Node): void {
    if (isCoreComponentClass(child)) {
        const arrayNode = extractMethodArray(child as PhpClass, 'fetch_subsystems');
        populateSubsystemsFromAst(map, arrayNode);
    }
}

/**
 * Resolves subsystems by parsing lib/classes/component.php AST (Moodle 2.6 - 3.7).
 *
 * @example
 * ```ts
 * const subsystems = await resolveClassSubsystems('/var/www/moodle');
 * subsystems.get('group'); // 'group'
 * ```
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Subsystems map.
 */
export async function resolveClassSubsystems(moodlePath: string): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    map.set('core', 'lib');
    const ast = await getAst('lib/classes/component.php', moodlePath).catch(() => null);
    if (!isProgram(ast)) {
        return map;
    }
    for (const child of ast.children) {
        extractSubsystemsFromClass(map, child);
    }
    return map;
}

/**
 * Resolves standard core subsystems for legacy Moodle (2.0 - 2.5).
 *
 * @example
 * ```ts
 * const subsystems = resolveLegacySubsystems();
 * subsystems.get('core_user'); // 'user'
 * ```
 *
 * @returns {Map<string, string>} Legacy core subsystems map.
 */
export function resolveLegacySubsystems(): Map<string, string> {
    const map = new Map<string, string>();
    map.set('core', 'lib');
    const standard = ['group', 'user', 'course', 'grade', 'comment', 'completion', 'cohort', 'notes', 'rating', 'tag', 'admin', 'auth', 'enrol', 'message'];
    for (const name of standard) {
        registerSubsystemEntry(map, name, name);
    }
    return map;
}
