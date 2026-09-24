import fs from 'fs/promises';
import { MoodleSubpluginsJson } from '../../interfaces/component-resolver.interfaces';
import { getAst } from '../../cache/ast-manager';
import { findVariableAssignment, extractArrayEntriesMap, extractFieldValue, isProgram } from '../../parser/ast-utils';
import { Array as PhpArray, Node } from 'php-parser';

/**
 * Safely parses raw JSON content from a subplugins.json file.
 *
 * @example
 * ```ts
 * parseSubpluginsJson('{"plugintypes": {"tiny": "lib/editor/tiny/plugins"}}');
 * ```
 *
 * @param {string} raw - JSON file content string.
 * @returns {MoodleSubpluginsJson | null} Parsed object or null if invalid.
 */
function parseSubpluginsJson(raw: string): MoodleSubpluginsJson | null {
    try {
        return JSON.parse(raw) as MoodleSubpluginsJson;
    } catch {
        return null;
    }
}

/**
 * Reads and parses a subplugins.json file from disk.
 *
 * @example
 * ```ts
 * await readSubpluginsFile('/path/to/mod/quiz/db/subplugins.json');
 * ```
 *
 * @param {string} filePath - Absolute path to subplugins.json.
 * @returns {Promise<MoodleSubpluginsJson | null>} Parsed contents or null.
 */
async function readSubpluginsFile(filePath: string): Promise<MoodleSubpluginsJson | null> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return parseSubpluginsJson(content);
    } catch {
        return null;
    }
}

/**
 * Populates key-value entries into plugintypes map.
 *
 * @param {Map<string, string>} plugintypes - Target map.
 * @param {Record<string, string>} entries - Key-value pair entries.
 */
function populateSubpluginEntries(
    plugintypes: Map<string, string>,
    entries: Record<string, string>
): void {
    for (const [type, dir] of Object.entries(entries)) {
        plugintypes.set(type, String(dir));
    }
}

/**
 * Registers plugintypes entries from a single subplugins JSON definition into the map.
 *
 * @example
 * ```ts
 * const map = new Map<string, string>();
 * registerSubpluginTypes(map, { plugintypes: { tiny: 'lib/editor/tiny/plugins' } });
 * ```
 *
 * @param {Map<string, string>} plugintypes - Target map.
 * @param {MoodleSubpluginsJson | null} data - Parsed subplugins data.
 */
function registerSubpluginTypes(
    plugintypes: Map<string, string>,
    data: MoodleSubpluginsJson | null
): void {
    if (data && data.plugintypes) {
        populateSubpluginEntries(plugintypes, data.plugintypes);
    }
}

/**
 * Sets a single subplugin entry if its value is valid.
 *
 * @example
 * ```ts
 * setSubpluginEntry(map, 'quizaccess', node);
 * ```
 *
 * @param {Map<string, string>} map - Target map.
 * @param {string} key - Subplugin key.
 * @param {Node} valueNode - AST value node.
 */
function setSubpluginEntry(map: Map<string, string>, key: string, valueNode: Node): void {
    const val = extractFieldValue(valueNode);
    if (val) {
        map.set(key, val);
    }
}

/**
 * Extracts subplugins definitions from AST Array node into the target map.
 *
 * @example
 * ```ts
 * const map = new Map<string, string>();
 * extractSubpluginsFromArray(map, arrayNode);
 * ```
 *
 * @param {Map<string, string>} map - Target plugintypes map.
 * @param {PhpArray | null} arrayNode - PHP array AST node.
 */
function extractSubpluginsFromArray(map: Map<string, string>, arrayNode: PhpArray | null): void {
    if (!arrayNode) {
        return;
    }
    const entries = extractArrayEntriesMap(arrayNode);
    for (const [key, valueNode] of entries.entries()) {
        setSubpluginEntry(map, key, valueNode);
    }
}

/**
 * Parses modern subplugins.json file and returns its declared plugintypes.
 *
 * @example
 * ```ts
 * const map = await resolveJsonSubplugins('/path/to/lib/editor/tiny/db/subplugins.json');
 * map.get('tiny'); // 'lib/editor/tiny/plugins'
 * ```
 *
 * @param {string} filePath - Absolute path to subplugins.json.
 * @returns {Promise<Map<string, string>>} Extracted plugintypes map.
 */
export async function resolveJsonSubplugins(filePath: string): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    const data = await readSubpluginsFile(filePath);
    registerSubpluginTypes(map, data);
    return map;
}

/**
 * Parses legacy subplugins.php file using cached AST and returns its declared plugintypes.
 *
 * @example
 * ```ts
 * const map = await resolveAstSubplugins('mod/quiz/db/subplugins.php', '/var/www/moodle');
 * map.get('quizaccess'); // 'mod/quiz/accessrule'
 * ```
 *
 * @param {string} relativePath - Relative path to subplugins.php.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Extracted plugintypes map.
 */
export async function resolveAstSubplugins(
    relativePath: string,
    moodlePath: string
): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    const ast = await getAst(relativePath, moodlePath).catch(() => null);
    if (!isProgram(ast)) {
        return map;
    }
    const subpluginsArray = findVariableAssignment(ast, 'subplugins');
    extractSubpluginsFromArray(map, subpluginsArray);
    return map;
}

/**
 * Merges source map entries into target map.
 *
 * @example
 * ```ts
 * mergeSubpluginMaps(target, source);
 * ```
 *
 * @param {Map<string, string>} target - Destination map.
 * @param {Map<string, string>} source - Source map to copy from.
 */
function mergeSubpluginMaps(target: Map<string, string>, source: Map<string, string>): void {
    for (const [key, val] of source.entries()) {
        target.set(key, val);
    }
}

/**
 * Aggregates all provided subplugin file definitions into a combined plugintypes map.
 *
 * @example
 * ```ts
 * const map = await resolveAllSubplugins('/var/www/moodle', [
 *     '/var/www/moodle/lib/editor/tiny/db/subplugins.json',
 *     '/var/www/moodle/mod/quiz/db/subplugins.json'
 * ]);
 * ```
 *
 * @param {string} _moodlePath - Root path of Moodle repository.
 * @param {string[]} subpluginFiles - Array of discovered subplugin file paths.
 * @returns {Promise<Map<string, string>>} Combined plugintypes map.
 */
export async function resolveAllSubplugins(
    _moodlePath: string,
    subpluginFiles: string[] = []
): Promise<Map<string, string>> {
    const combined = new Map<string, string>();
    for (const file of subpluginFiles) {
        const subMap = await resolveJsonSubplugins(file);
        mergeSubpluginMaps(combined, subMap);
    }
    return combined;
}
