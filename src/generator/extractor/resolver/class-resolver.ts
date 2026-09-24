import fs from 'fs';
import path from 'path';
import { MoodleService } from '../interfaces/service-extractor.interfaces';
import { resolverComponent } from './component-resolver';
import { ComponentMapRegistry } from '../interfaces/component-resolver.interfaces';

/**
 * Trims a raw string or returns empty string if null or undefined.
 *
 * @example
 * ```ts
 * sanitizeString('  user/externallib.php  '); // returns 'user/externallib.php'
 * sanitizeString(null);                      // returns ''
 * ```
 *
 * @param {string | null | undefined} raw - Raw string to sanitize.
 * @returns {string} Trimmed string.
 */
function sanitizeString(raw?: string | null): string {
    return raw ? raw.trim() : '';
}

/**
 * Sanitizes and extracts an explicit legacy classpath string.
 *
 * @example
 * ```ts
 * resolveClasspath(' enrol/manual/externallib.php '); // returns 'enrol/manual/externallib.php'
 * resolveClasspath(null);                             // returns null
 * ```
 *
 * @param {string | null | undefined} classpath - Explicit classpath from service metadata.
 * @returns {string | null} Trimmed classpath string or null if empty.
 */
function resolveClasspath(classpath?: string | null): string | null {
    const clean = sanitizeString(classpath);
    return clean.length > 0 ? clean : null;
}

/**
 * Normalizes a namespaced or legacy class name by stripping leading backslashes.
 *
 * @example
 * ```ts
 * cleanClassname('\\core_user\\external\\get_users'); // returns 'core_user\\external\\get_users'
 * cleanClassname('mod_forum_external');              // returns 'mod_forum_external'
 * ```
 *
 * @param {string} classname - Raw class name string.
 * @returns {string | null} Normalized class name or null if empty.
 */
function cleanClassname(classname: string): string | null {
    const trimmed = classname.trim();
    return trimmed.length === 0 ? null : trimmed.replace(/^\\+/, '');
}

/**
 * Matches a compound Frankenstyle component against registered plugintype prefixes.
 *
 * @example
 * ```ts
 * matchPluginPrefix('tool_dataprivacy', plugintypes); // returns 'admin/tool/dataprivacy'
 * matchPluginPrefix('customfield_number', plugintypes); // returns 'customfield/field/number'
 * ```
 *
 * @param {string} component - Component name (e.g. 'tool_dataprivacy', 'customfield_number').
 * @param {Map<string, string>} plugintypes - Plugintypes map.
 * @returns {string | null} Relative base directory or null.
 */
function matchPluginPrefix(component: string, plugintypes: Map<string, string>): string | null {
    for (const [type, dir] of plugintypes.entries()) {
        const prefix = `${type}_`;
        if (component.startsWith(prefix)) {
            const pluginName = component.slice(prefix.length);
            return `${dir}/${pluginName}`;
        }
    }
    return null;
}

/**
 * Resolves direct match for component in subsystems or plugintypes.
 *
 * @example
 * ```ts
 * resolveDirectMatch('core_user', registry); // returns 'user'
 * ```
 *
 * @param {string} component - Component identifier.
 * @param {ComponentMapRegistry} registry - Segregated registry.
 * @returns {string | null} Matched base directory or null.
 */
function resolveDirectMatch(component: string, registry: ComponentMapRegistry): string | null {
    const subsystem = registry.subsystems.get(component);
    if (subsystem) {
        return subsystem;
    }
    return registry.plugintypes.get(component) || null;
}

/**
 * Resolves base directory for a component name using direct map lookup or plugin prefix matching.
 *
 * @example
 * ```ts
 * resolveComponentDir('customfield_number', registry); // returns 'customfield/field/number'
 * ```
 *
 * @param {string} component - Component identifier.
 * @param {ComponentMapRegistry} registry - Loaded component registry.
 * @returns {string} Relative base directory.
 */
function resolveComponentDir(component: string, registry: ComponentMapRegistry): string {
    const direct = resolveDirectMatch(component, registry);
    if (direct) {
        return direct;
    }
    const pluginDir = matchPluginPrefix(component, registry.plugintypes);
    return pluginDir || component;
}

/**
 * Resolves a PSR-4 namespaced class into its standard Moodle file path.
 *
 * @example
 * ```ts
 * await resolvePSR4('core_group\\external\\get_groups', '/var/www/moodle');
 * // returns 'group/classes/external/get_groups.php'
 * ```
 *
 * @param {string} cleanClass - Cleaned namespaced class name.
 * @param {string} moodlePath - Root path of the Moodle repository.
 * @returns {Promise<string | null>} Relative file path to the PHP class file or null.
 */
async function resolvePSR4(cleanClass: string, moodlePath: string): Promise<string | null> {
    const registry = await resolverComponent(moodlePath);
    const parts = cleanClass.split('\\');
    const component = parts.shift() as string;
    const relativePath = parts.join('/');
    const baseDir = resolveComponentDir(component, registry);
    return `${baseDir}/classes/${relativePath}.php`;
}

/**
 * Extracts component identifier from a legacy Frankenstyle class name.
 *
 * @example
 * ```ts
 * extractFrankenstyleComponent('mod_wiki_external'); // returns 'mod_wiki'
 * extractFrankenstyleComponent('custom_handler');     // returns 'custom_handler'
 * ```
 *
 * @param {string} cleanClass - Cleaned class name (e.g. 'mod_wiki_external').
 * @returns {string} Extracted component identifier (e.g. 'mod_wiki').
 */
function extractFrankenstyleComponent(cleanClass: string): string {
    if (cleanClass.endsWith('_external')) {
        return cleanClass.slice(0, -9);
    }
    return cleanClass;
}

const moodleBaseCache = new Map<string, string>();

/**
 * Checks if a directory entry contains a version.php file.
 *
 * @param {string} moodlePath - Root path.
 * @param {fs.Dirent} entry - Directory entry.
 * @returns {string | null} Full directory path or null.
 */
function checkEntryDirectory(moodlePath: string, entry: fs.Dirent): string | null {
    if (entry.isDirectory() && fs.existsSync(path.join(moodlePath, entry.name, 'version.php'))) {
        return path.join(moodlePath, entry.name);
    }
    return null;
}

/**
 * Searches list of directory entries for one containing version.php.
 *
 * @param {string} moodlePath - Root path.
 * @param {fs.Dirent[]} entries - Directory entries.
 * @returns {string | null} Found directory or null.
 */
function findVersionInEntries(moodlePath: string, entries: fs.Dirent[]): string | null {
    for (const entry of entries) {
        const match = checkEntryDirectory(moodlePath, entry);
        if (match) {
            return match;
        }
    }
    return null;
}

/**
 * Scans immediate subdirectories to find where version.php resides.
 *
 * @param {string} moodlePath - Provided root path.
 * @returns {string} Discovered base directory or original path.
 */
function scanSubdirectoryBase(moodlePath: string): string {
    try {
        const entries = fs.readdirSync(moodlePath, { withFileTypes: true });
        const found = findVersionInEntries(moodlePath, entries);
        return found ? found : moodlePath;
    } catch {
        return moodlePath;
    }
}

/**
 * Resolves and caches the effective root directory containing Moodle source files.
 *
 * @param {string} moodlePath - Provided root path.
 * @returns {string} Effective directory.
 */
function getEffectiveMoodlePath(moodlePath: string): string {
    const cached = moodleBaseCache.get(moodlePath);
    if (cached) {
        return cached;
    }
    const resolved = fs.existsSync(path.join(moodlePath, 'version.php'))
        ? moodlePath
        : scanSubdirectoryBase(moodlePath);
    moodleBaseCache.set(moodlePath, resolved);
    return resolved;
}

/**
 * Checks if a candidate relative file exists within the Moodle repository.
 *
 * @example
 * ```ts
 * fileExists('/var/www/moodle', 'user/externallib.php'); // returns true or false
 * ```
 *
 * @param {string} moodlePath - Root path of the Moodle repository.
 * @param {string} relativePath - Candidate relative file path.
 * @returns {boolean} True if the file exists on disk.
 */
function fileExists(moodlePath: string, relativePath: string): boolean {
    if (fs.existsSync(path.join(moodlePath, relativePath))) {
        return true;
    }
    const base = getEffectiveMoodlePath(moodlePath);
    return fs.existsSync(path.join(base, relativePath));
}

/**
 * Locates core_external class file across modern (5.0+) and legacy layouts.
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {string | null} Relative file path or null.
 */
function findCoreExternalClass(moodlePath: string): string | null {
    if (fileExists(moodlePath, 'lib/external/externallib.php')) {
        return 'lib/external/externallib.php';
    }
    if (fileExists(moodlePath, 'lib/externallib.php')) {
        return 'lib/externallib.php';
    }
    return null;
}

/**
 * Looks for core subsystem class files in lib/classes/.
 *
 * @param {string} component - Component identifier.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {string | null} Monolithic class path or null.
 */
function findCoreSubsystemClass(component: string, moodlePath: string): string | null {
    const rawSubsystem = component.replace(/^core_/, '');
    const candidateA = `lib/classes/${rawSubsystem}_external.php`;
    if (fileExists(moodlePath, candidateA)) {
        return candidateA;
    }
    const candidateB = `lib/classes/${component}_external.php`;
    if (fileExists(moodlePath, candidateB)) {
        return candidateB;
    }
    return null;
}

/**
 * Looks for monolithic legacy class files located in lib/classes/ for Core subsystems.
 *
 * @example
 * ```ts
 * findMonolithicCoreClass('core_grades', '/var/www/moodle'); // 'lib/classes/grades_external.php'
 * ```
 *
 * @param {string} component - Component identifier (e.g. 'core_grades', 'core_grading').
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {string | null} Monolithic class path or null.
 */
function findMonolithicCoreClass(component: string, moodlePath: string): string | null {
    if (component === 'core' || component === 'core_external') {
        return findCoreExternalClass(moodlePath);
    }
    return findCoreSubsystemClass(component, moodlePath);
}

/**
 * Selects candidate file between monolithic Core, classes/external.php and externallib.php based on disk existence.
 *
 * @example
 * ```ts
 * findLegacyClassFile('mod/wiki', 'mod_wiki', '/var/www/moodle'); // returns 'mod/wiki/classes/external.php'
 * ```
 *
 * @param {string} baseDir - Component base directory.
 * @param {string} component - Component identifier.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {string} Selected class file path.
 */
function findLegacyClassFile(baseDir: string, component: string, moodlePath: string): string {
    const monolithic = findMonolithicCoreClass(component, moodlePath);
    if (monolithic) {
        return monolithic;
    }
    const externallibPath = `${baseDir}/externallib.php`;
    return fileExists(moodlePath, externallibPath)
        ? externallibPath
        : `${baseDir}/classes/external.php`;
}

/**
 * Resolves legacy non-namespaced Frankenstyle class into its file path.
 *
 * @example
 * ```ts
 * await resolveFrankenstyle('mod_forum_external', '/var/www/moodle');
 * // returns 'mod/forum/classes/external.php' or 'mod/forum/externallib.php'
 * ```
 *
 * @param {string} cleanClass - Cleaned class name.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<string | null>} Relative file path.
 */
async function resolveFrankenstyle(cleanClass: string, moodlePath: string): Promise<string | null> {
    const registry = await resolverComponent(moodlePath);
    const component = extractFrankenstyleComponent(cleanClass);
    const baseDir = resolveComponentDir(component, registry);
    return findLegacyClassFile(baseDir, component, moodlePath);
}

/**
 * Validates if an explicit classpath is non-empty and actually exists on disk.
 *
 * @example
 * ```ts
 * isValidExplicitClasspath('enrol/manual/externallib.php', '/var/www/moodle'); // true
 * isValidExplicitClasspath('block/starredcourses/classes/external.php', '/var/www/moodle'); // false
 * ```
 *
 * @param {string | null} explicitClasspath - Classpath defined in service metadata.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {boolean} True if classpath is valid and file exists on disk.
 */
function isValidExplicitClasspath(explicitClasspath: string | null, moodlePath: string): boolean {
    if (!explicitClasspath) {
        return false;
    }
    return fileExists(moodlePath, explicitClasspath);
}

/**
 * Dispatches class path resolution according to namespaced (PSR-4) or legacy convention.
 *
 * @example
 * ```ts
 * await dispatchClassPathResolution('tool_dataprivacy\\external', '/var/www/moodle');
 * ```
 *
 * @param {string} cleanClass - Normalized class name.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<string | null>} Resolved relative class path.
 */
function dispatchClassPathResolution(
    cleanClass: string,
    moodlePath: string
): Promise<string | null> {
    if (cleanClass.includes('\\')) {
        return resolvePSR4(cleanClass, moodlePath);
    }
    return resolveFrankenstyle(cleanClass, moodlePath);
}

/**
 * Resolves the physical relative file path of a Moodle Web Service class.
 *
 * @example
 * ```ts
 * const service = {
 *     name: 'core_user_get_users',
 *     classname: 'core_user_external',
 *     methodname: 'get_users'
 * };
 * const relativePath = await resolveClass(service, '/var/www/moodle');
 * // returns 'user/classes/external.php'
 * ```
 *
 * @param {MoodleService} service - Extracted Moodle Web Service object.
 * @param {string} moodlePath - Root path of the Moodle repository.
 * @returns {Promise<string | null>} Relative file path to the PHP class or null if invalid.
 */
export async function resolveClass(service: MoodleService, moodlePath: string): Promise<string | null> {
    const cleanClass = cleanClassname(service.classname);
    if (!cleanClass) {
        return null;
    }

    const explicitClasspath = resolveClasspath(service.classpath);
    if (isValidExplicitClasspath(explicitClasspath, moodlePath)) {
        return explicitClasspath;
    }

    return dispatchClassPathResolution(cleanClass, moodlePath);
}