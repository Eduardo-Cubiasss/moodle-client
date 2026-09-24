import { Entry, Array as PhpArray, Node } from 'php-parser';
import { MoodleService } from '../interfaces/service-extractor.interfaces';
import {
    findVariableAssignment,
    extractArrayEntriesMap,
    extractEntryKey,
    extractFieldValue,
    extractStringLiteral
} from '../parser/ast-utils';
import { sanitizeDescription } from '../utils/description-utils';

/**
 * Assigns optional classpath property to the service if present in the definition map.
 *
 * @example
 * ```php
 * 'classpath' => 'enrol/manual/externallib.php'
 * ```
 * Populates `service.classpath = 'enrol/manual/externallib.php'`.
 *
 * @param {MoodleService} service - Web service instance being constructed.
 * @param {Map<string, Node>} fields - Associative properties map.
 */
function assignClasspath(service: MoodleService, fields: Map<string, Node>): void {
    if (fields.has('classpath')) {
        service.classpath = extractFieldValue(fields.get('classpath'));
    }
}

/**
 * Resolves cleaned description string or null from raw field value.
 *
 * @param {string | null} raw - Raw description string.
 * @returns {string | null} Sanitized description or null.
 */
function resolveServiceDescription(raw: string | null): string | null {
    if (raw === null) {
        return null;
    }
    return sanitizeDescription(raw) ?? null;
}

/**
 * Assigns optional description property to the service if present in the definition map.
 *
 * @example
 * ```php
 * 'description' => 'Manual enrol users'
 * ```
 * Populates `service.description = 'Manual enrol users'`.
 *
 * @param {MoodleService} service - Web service instance being constructed.
 * @param {Map<string, Node>} fields - Associative properties map.
 */
function assignDescription(service: MoodleService, fields: Map<string, Node>): void {
    if (fields.has('description')) {
        const raw = extractFieldValue(fields.get('description'));
        service.description = resolveServiceDescription(raw);
    }
}

/**
 * Assigns optional type property to the service if present in the definition map.
 *
 * @example
 * ```php
 * 'type' => 'write'
 * ```
 * Populates `service.type = 'write'`.
 *
 * @param {MoodleService} service - Web service instance being constructed.
 * @param {Map<string, Node>} fields - Associative properties map.
 */
function assignType(service: MoodleService, fields: Map<string, Node>): void {
    if (fields.has('type')) {
        service.type = extractFieldValue(fields.get('type'));
    }
}

/**
 * Checks if the value of an Entry node is a valid array.
 *
 * @param {Entry} entry - Associative Entry to check.
 * @returns {boolean} True if the value is a valid array node.
 */
function isValidEntryValue(entry: Entry): boolean {
    if (!entry.value) {
        return false;
    }
    return entry.value.kind === 'array';
}

/**
 * Checks if the Entry name and value are valid for a service definition.
 *
 * @param {string | null} name - Extracted entry key name.
 * @param {Entry} entry - Associative Entry to check.
 * @returns {boolean} True if the entry has a valid name and array value.
 */
function isValidServiceEntry(name: string | null, entry: Entry): boolean {
    if (!name) {
        return false;
    }
    return isValidEntryValue(entry);
}

/**
 * Resolves the method name from the fields map or defaults to 'execute'.
 * Returns 'execute' when methodname is absent, null, empty string, or whitespace-only.
 *
 * @example
 * ```ts
 * // 1. When 'methodname' => 'get_users' is present in PHP:
 * getMethodName(fields); // returns 'get_users'
 *
 * // 2. When 'methodname' => null, 'methodname' => '', or omitted:
 * getMethodName(fields); // returns 'execute'
 * ```
 *
 * @param {Map<string, Node>} fields - Associative properties map.
 * @returns {string} The resolved method name, defaulting to 'execute'.
 */
function getMethodName(fields: Map<string, Node>): string {
    const rawName = extractStringLiteral(fields.get('methodname'));
    const trimmed = rawName?.trim();
    if (trimmed) {
        return trimmed;
    }
    return 'execute';
}

/**
 * Parses a single associative array Entry node representing a Moodle Web Service definition.
 *
 * @example
 * Given an associative array entry in PHP:
 * ```php
 * 'mod_forum_get_forums' => array(
 *     'classname'   => 'mod_forum_external',
 *     'methodname'  => 'get_forums',
 *     'classpath'   => 'mod/forum/externallib.php',
 *     'description' => 'Returns list of forums',
 *     'type'        => 'read'
 * )
 * ```
 * Returns:
 * ```ts
 * {
 *     name: 'mod_forum_get_forums',
 *     classname: 'mod_forum_external',
 *     methodname: 'get_forums',
 *     classpath: 'mod/forum/externallib.php',
 *     description: 'Returns list of forums',
 *     type: 'read'
 * }
 * ```
 *
 * @param {Entry} entry - Associative Entry representing a service in $functions.
 * @returns {MoodleService | null} Parsed MoodleService object or null if invalid/incomplete.
 */
function parseServiceEntry(entry: Entry): MoodleService | null {
    const name = extractEntryKey(entry);
    if (!isValidServiceEntry(name, entry)) {
        return null;
    }

    const fields = extractArrayEntriesMap(entry.value as PhpArray);
    const classname = extractStringLiteral(fields.get('classname'));
    if (!classname) {
        return null;
    }

    const methodname = getMethodName(fields);
    const service: MoodleService = { name: name as string, classname, methodname };

    assignClasspath(service, fields);
    assignDescription(service, fields);
    assignType(service, fields);

    return service;
}

/**
 * Checks if an unknown item is a valid AST entry node.
 *
 * @param {unknown} item - Item to inspect.
 * @returns {boolean} True if the item is an Entry node.
 */
function isEntryNode(item: unknown): boolean {
    if (!item) {
        return false;
    }
    return (item as Node).kind === 'entry';
}

/**
 * Processes an AST item and adds it to the services list if valid.
 *
 * @param {unknown} item - AST node to process.
 * @param {MoodleService[]} services - Array to push valid services to.
 */
function processAndPushService(item: unknown, services: MoodleService[]): void {
    if (!isEntryNode(item)) {
        return;
    }
    const parsed = parseServiceEntry(item as Entry);
    if (parsed) {
        services.push(parsed);
    }
}

/**
 * Iterates through AST array items and collects all valid MoodleService objects.
 *
 * @param {unknown[]} items - List of AST nodes from the $functions array.
 * @returns {MoodleService[]} List of successfully extracted Moodle Web Services.
 */
function collectServices(items: unknown[]): MoodleService[] {
    const services: MoodleService[] = [];
    for (const item of items) {
        processAndPushService(item, services);
    }
    return services;
}

/**
 * Validates if the provided AST represents an object structure.
 *
 * @param {unknown} ast - AST to validate.
 * @returns {boolean} True if AST is a valid object.
 */
function isObjectAST(ast: unknown): boolean {
    if (!ast) {
        return false;
    }
    return typeof ast === 'object';
}

/**
 * Checks if the extracted functions array has valid iterable items.
 *
 * @param {PhpArray | null} array - PHP Array node to check.
 * @returns {array is PhpArray} True if the array contains items and is not null.
 */
function isValidFunctionsArray(array: PhpArray | null): array is PhpArray {
    if (!array) {
        return false;
    }
    return Array.isArray(array.items);
}

/**
 * Extracts Web Service definitions declared in the $functions array of a services.php AST.
 *
 * @example
 * Given Moodle db/services.php file content:
 * ```php
 * <?php
 * $functions = array(
 *     // Traditional Moodle 2.x/3.x format
 *     'moodle_enrol_manual_enrol_users' => array(
 *         'classname'   => 'moodle_enrol_manual_external',
 *         'methodname'  => 'manual_enrol_users',
 *         'classpath'   => 'enrol/manual/externallib.php',
 *         'description' => 'Manual enrol users',
 *         'type'        => 'write'
 *     ),
 *     // Modern Moodle 4.x+ PSR-4 format
 *     'aiplacement_editor_generate_image' => [
 *         'classname'   => \aiplacement_editor\external\generate_image::class,
 *         'description' => 'Generate image with AI',
 *         'type'        => 'write'
 *     ]
 * );
 * ```
 * In TypeScript:
 * ```ts
 * const services: MoodleService[] = extractServices(servicesAst);
 *
 * // Result:
 * // [
 * //   {
 * //     name: 'moodle_enrol_manual_enrol_users',
 * //     classname: 'moodle_enrol_manual_external',
 * //     methodname: 'manual_enrol_users',
 * //     classpath: 'enrol/manual/externallib.php',
 * //     description: 'Manual enrol users',
 * //     type: 'write'
 * //   },
 * //   {
 * //     name: 'aiplacement_editor_generate_image',
 * //     classname: '\\aiplacement_editor\\external\\generate_image',
 * //     methodname: 'execute', // Defaults to 'execute' for Moodle 4.x+
 * //     description: 'Generate image with AI',
 * //     type: 'write'
 * //   }
 * // ]
 * ```
 *
 * @param {unknown} ast - Abstract Syntax Tree of a services.php file.
 * @returns {MoodleService[]} Array of extracted service definitions.
 */
export function extractServices(ast: unknown): MoodleService[] {
    if (!isObjectAST(ast)) {
        return [];
    }

    const functionsArray = findVariableAssignment(ast as Node, 'functions');
    if (!isValidFunctionsArray(functionsArray)) {
        return [];
    }

    return collectServices(functionsArray.items);
}