import {
    Program,
    ExpressionStatement,
    Assign,
    Array as PhpArray,
    Entry,
    String as PhpString,
    StaticLookup,
    Variable,
    Node
} from 'php-parser';

/**
 * Helper to check if an unknown value is a non-null object.
 */
function isNonNullObject(ast: unknown): boolean {
    if (typeof ast !== 'object') {
        return false;
    }
    return ast !== null;
}

/**
 * Helper to check the core structure of a Program AST.
 */
function isProgramStructure(ast: Partial<Program>): boolean {
    if (ast.kind !== 'program') {
        return false;
    }
    return Array.isArray(ast.children);
}

/**
 * Validates whether an unknown AST node is a valid php-parser Program root node.
 *
 * @example
 * ```ts
 * const ast = phpParserEngine.parseCode('<?php $functions = [];', 'services.php');
 * if (isProgram(ast)) {
 *     console.log(ast.children); // TypeScript now safely knows ast is a Program node
 * }
 * ```
 *
 * @param {unknown} ast - Unknown node or structure to check.
 * @returns {ast is Program} True if the node is a Program with a valid children array.
 */
export function isProgram(ast: unknown): ast is Program {
    if (!isNonNullObject(ast)) {
        return false;
    }
    return isProgramStructure(ast as Partial<Program>);
}

/**
 * Helper to validate if a node is the target variable assignment.
 */
function isTargetVariable(node: Node | undefined, variableName: string): boolean {
    if (!node) {
        return false;
    }
    if (node.kind !== 'variable') {
        return false;
    }
    return (node as Variable).name === variableName;
}

/**
 * Helper to extract the right-side Array from an Assign node.
 */
function getRightArrayNode(assign: Assign): PhpArray | null {
    if (!assign.right) {
        return null;
    }
    if (assign.right.kind !== 'array') {
        return null;
    }
    return assign.right as PhpArray;
}

/**
 * Helper to coordinate the assignment check.
 */
function checkAssignNodes(assign: Assign, variableName: string): PhpArray | null {
    if (!isTargetVariable(assign.left, variableName)) {
        return null;
    }
    return getRightArrayNode(assign);
}

/**
 * Extracts a PhpArray node from an ExpressionStatement containing a variable assignment.
 *
 * @param {ExpressionStatement} stmt - Statement node to inspect.
 * @param {string} variableName - Target variable name (e.g. 'functions').
 * @returns {PhpArray | null} Array node if the assignment matches, otherwise null.
 */
function extractArrayFromAssign(stmt: ExpressionStatement, variableName: string): PhpArray | null {
    const assign = stmt.expression as Assign;
    if (!assign) {
        return null;
    }
    if (assign.kind !== 'assign') {
        return null;
    }
    return checkAssignNodes(assign, variableName);
}

/**
 * Helper to process a single child node during search.
 */
function processChildNode(child: Node, variableName: string): PhpArray | null {
    if (child.kind !== 'expressionstatement') {
        return null;
    }
    return extractArrayFromAssign(child as ExpressionStatement, variableName);
}

/**
 * Helper to iterate over program children.
 */
function searchChildrenForArray(children: Node[], variableName: string): PhpArray | null {
    for (const child of children) {
        const found = processChildNode(child, variableName);
        if (found) {
            return found;
        }
    }
    return null;
}

/**
 * Locates an assignment to a specific variable name within a Program AST and returns its array node.
 *
 * @example
 * Given PHP source:
 * ```php
 * <?php
 * $functions = array(
 *     'core_user_get_users' => array('classname' => 'core_user_external')
 * );
 * ```
 * In TypeScript:
 * ```ts
 * const functionsArray = findVariableAssignment(ast, 'functions');
 * // Returns the PhpArray AST node representing array('core_user_get_users' => ...)
 * ```
 *
 * @param {Program | Node} program - Root Program AST node.
 * @param {string} variableName - Variable name to search for (e.g., 'functions').
 * @returns {PhpArray | null} The assigned Array node, or null if not found.
 */
export function findVariableAssignment(program: Program | Node, variableName: string): PhpArray | null {
    if (!isProgram(program)) {
        return null;
    }
    return searchChildrenForArray(program.children, variableName);
}

/**
 * Safely verifies if an unknown value is an object containing a 'name' key.
 */
function hasNameProperty(obj: unknown): boolean {
    if (!obj) {
        return false;
    }
    if (typeof obj !== 'object') {
        return false;
    }
    return 'name' in obj;
}

/**
 * Safely extracts the 'name' property from an unknown object.
 */
function extractNameProperty(obj: unknown): string | null {
    if (!hasNameProperty(obj)) {
        return null;
    }
    const nameValue = (obj as { name: unknown }).name;
    if (typeof nameValue !== 'string') {
        return null;
    }
    return nameValue;
}

/**
 * Extracts the class name identifier from the target of a StaticLookup node (::class syntax).
 *
 * @param {Node | string | null | undefined} what - Target lookup expression.
 * @returns {string | null} Extracted class name, or null if unresolvable.
 */
function extractLookupName(what: Node | string | null | undefined): string | null {
    if (!isNonNullObject(what)) {
        return null;
    }
    return extractNameProperty(what);
}

/**
 * Helper to handle specific StaticLookup processing.
 */
function handleStaticLookup(node: Node): string | null {
    if (node.kind === 'staticlookup') {
        return extractLookupName((node as StaticLookup).what);
    }
    return null;
}

/**
 * Extracts a string literal value from a String node or resolves a StaticLookup (::class) expression.
 *
 * @example
 * Example 1 - Plain String literal in PHP:
 * ```php
 * 'classname' => 'core_user_external'
 * ```
 * ```ts
 * extractStringLiteral(node) // returns 'core_user_external'
 * ```
 *
 * Example 2 - Modern PHP Class reference (StaticLookup):
 * ```php
 * 'classname' => \mod_forum\external\get_forums::class
 * ```
 * ```ts
 * extractStringLiteral(node) // returns '\mod_forum\external\get_forums'
 * ```
 *
 * @param {Node | null | undefined} node - Node to extract string from.
 * @returns {string | null} String value or null if node is not a recognized string representation.
 */
export function extractStringLiteral(node: Node | null | undefined): string | null {
    if (!node) {
        return null;
    }
    if (node.kind === 'string') {
        return (node as PhpString).value;
    }
    return handleStaticLookup(node);
}

/**
 * Extracts the string key from an associative array Entry node.
 *
 * @example
 * Given PHP entry:
 * ```php
 * 'moodle_enrol_manual_enrol_users' => array(...)
 * ```
 * In TypeScript:
 * ```ts
 * const keyName = extractEntryKey(entryNode);
 * // returns 'moodle_enrol_manual_enrol_users'
 * ```
 *
 * @param {Entry} entry - Associative Entry node.
 * @returns {string | null} String key or null if missing/invalid.
 */
export function extractEntryKey(entry: Entry): string | null {
    if (!entry.key) {
        return null;
    }
    if (entry.key.kind !== 'string') {
        return null;
    }
    return (entry.key as PhpString).value;
}

/**
 * Helper to validate an Entry node.
 */
function isEntryNode(item: Node | unknown): boolean {
    if (!item) {
        return false;
    }
    return (item as Node).kind === 'entry';
}

/**
 * Helper to process and insert an entry into the map.
 */
function insertValidEntry(map: Map<string, Node>, entry: Entry): void {
    const key = extractEntryKey(entry);
    if (!key) {
        return;
    }
    if (entry.value) {
        map.set(key, entry.value);
    }
}

/**
 * Adds a single associative Entry node to the target Map.
 *
 * @param {Map<string, Node>} map - Target key-node map.
 * @param {Node | unknown} item - Potential Entry node.
 */
function addEntryToMap(map: Map<string, Node>, item: Node | unknown): void {
    if (!isEntryNode(item)) {
        return;
    }
    insertValidEntry(map, item as Entry);
}

/**
 * Helper to iterate and populate the map.
 */
function populateMapWithItems(map: Map<string, Node>, items: unknown[]): void {
    for (const item of items) {
        addEntryToMap(map, item);
    }
}

/**
 * Transforms an AST Array node into a Map of key strings to their corresponding AST value Nodes.
 *
 * @example
 * Given PHP associative array AST:
 * ```php
 * array(
 *     'classname' => 'core_course_external',
 *     'type' => 'read',
 *     'description' => 'Get course contents'
 * )
 * ```
 * In TypeScript:
 * ```ts
 * const fieldsMap = extractArrayEntriesMap(arrayNode);
 * fieldsMap.get('classname');   // String AST Node with value 'core_course_external'
 * fieldsMap.get('type');        // String AST Node with value 'read'
 * fieldsMap.get('description'); // String AST Node with value 'Get course contents'
 * ```
 *
 * @param {PhpArray} arrayNode - AST Array node to convert.
 * @returns {Map<string, Node>} Map of key-value associations.
 */
export function extractArrayEntriesMap(arrayNode: PhpArray): Map<string, Node> {
    const map = new Map<string, Node>();
    if (!arrayNode) {
        return map;
    }
    if (Array.isArray(arrayNode.items)) {
        populateMapWithItems(map, arrayNode.items);
    }
    return map;
}

/**
 * Resolves a field value from an AST node, returning null for nullkeywords or the string content.
 *
 * @example
 * ```ts
 * // 1. Literal string node:
 * extractFieldValue(stringNode); // returns 'read'
 *
 * // 2. Explicit PHP null keyword ('description' => null):
 * extractFieldValue(nullKeywordNode); // returns null
 *
 * // 3. Undefined or absent node:
 * extractFieldValue(undefined); // returns null
 * ```
 *
 * @param {Node | null | undefined} node - AST node to extract value from.
 * @returns {string | null} String value, null for explicit null values, or null if missing.
 */
export function extractFieldValue(node: Node | null | undefined): string | null {
    if (!node) {
        return null;
    }
    if (node.kind === 'nullkeyword') {
        return null;
    }
    return extractStringLiteral(node);
}