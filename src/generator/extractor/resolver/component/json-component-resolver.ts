import fs from 'fs/promises';
import path from 'path';
import { MoodleComponentsJson } from '../../interfaces/component-resolver.interfaces';

/**
 * Registers all plugin types into the target plugintypes map.
 *
 * @example
 * ```ts
 * const map = new Map<string, string>();
 * registerPlugintypes(map, { mod: 'mod', customfield: 'customfield/field' });
 * ```
 *
 * @param {Map<string, string>} map - Target plugintypes map.
 * @param {Record<string, string>} [plugintypes] - Key-value pair of plugintypes.
 */
function registerPlugintypes(
    map: Map<string, string>,
    plugintypes?: Record<string, string>
): void {
    if (!plugintypes) {
        return;
    }
    for (const [type, dir] of Object.entries(plugintypes)) {
        map.set(type, dir);
    }
}

/**
 * Safely parses raw JSON content from lib/components.json.
 *
 * @example
 * ```ts
 * parseComponentsJson('{"plugintypes": {}}', '/path/to/file');
 * ```
 *
 * @param {string} raw - File content string.
 * @param {string} filePath - Absolute file path for error context.
 * @returns {MoodleComponentsJson} Parsed JSON structure.
 */
function parseComponentsJson(raw: string, filePath: string): MoodleComponentsJson {
    try {
        return JSON.parse(raw) as MoodleComponentsJson;
    } catch {
        throw new Error(`Invalid JSON in ${filePath}`);
    }
}

import { findFirstFile } from '../../scanner/scanner';

/**
 * Loads raw content of lib/components.json directly or via dynamic pattern search.
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<{ raw: string; filePath: string }>} Raw content and resolved file path.
 */
async function loadComponentsJsonContent(moodlePath: string): Promise<{ raw: string; filePath: string }> {
    const directPath = path.join(moodlePath, 'lib/components.json');
    try {
        const raw = await fs.readFile(directPath, 'utf-8');
        return { raw, filePath: directPath };
    } catch {
        const found = await findFirstFile(moodlePath, 'lib/components.json');
        if (found) {
            const raw = await fs.readFile(found, 'utf-8');
            return { raw, filePath: found };
        }
        throw new Error(`Unable to load components from ${directPath}`);
    }
}

/**
 * Resolves plugintypes map from modern Moodle lib/components.json (Moodle >= 3.8).
 *
 * @example
 * ```ts
 * const map = await resolveJsonComponents('/var/www/moodle');
 * map.get('mod');         // 'mod'
 * map.get('customfield'); // 'customfield/field'
 * ```
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Plugin types to directory mapping.
 */
export async function resolveJsonComponents(moodlePath: string): Promise<Map<string, string>> {
    const { raw, filePath } = await loadComponentsJsonContent(moodlePath);
    const parsed = parseComponentsJson(raw, filePath);
    const plugintypes = new Map<string, string>();

    registerPlugintypes(plugintypes, parsed.plugintypes);

    return plugintypes;
}
