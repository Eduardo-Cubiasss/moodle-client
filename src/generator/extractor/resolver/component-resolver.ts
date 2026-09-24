import { StrategyConfig, ComponentMapRegistry } from '../interfaces/component-resolver.interfaces';
import { resolveVersion } from './version-resolver';
import { isVersionGreaterOrEqual, isValidVersionString } from '../utils/version-utils';
import { resolveJsonComponents } from './component/json-component-resolver';
import { resolveClassComponents } from './component/class-component-resolver';
import { resolveLegacyMoodlelibComponents } from './component/legacy-moodlelib-resolver';
import { resolveJsonSubsystems, resolveClassSubsystems, resolveLegacySubsystems } from './component/subsystem-resolver';
import { resolveAllSubplugins } from './component/subcomponent-resolver';
import { findFiles } from '../scanner/scanner';

const versionComponentCache = new Map<string, ComponentMapRegistry>();
const inFlightComponentMap = new Map<string, Promise<ComponentMapRegistry>>();
const SUBPLUGIN_IGNORED_DIRS = [
    'node_modules', 'vendor', '.git', 'tests', 'fixtures',
    'cache', 'localcache', 'pix', 'theme', 'lang', 'install'
];

/**
 * Clears the cached component maps in memory (optionally for a specific version).
 *
 * @example
 * ```ts
 * clearComponentCache('4.5.0');
 * clearComponentCache();
 * ```
 *
 * @param {string} [version] - Optional version to invalidate. If omitted, clears all versions.
 */
export function clearComponentCache(version?: string): void {
    if (version) {
        versionComponentCache.delete(version);
        return;
    }
    versionComponentCache.clear();
    inFlightComponentMap.clear();
}

/**
 * Retrieves the cached component registry for a specific version if available.
 *
 * @example
 * ```ts
 * const registry = getCachedComponentMap('4.5.0');
 * ```
 *
 * @param {string} version - Semantic version string.
 * @returns {ComponentMapRegistry | null} Cached component registry or null.
 */
export function getCachedComponentMap(version: string): ComponentMapRegistry | null {
    return versionComponentCache.get(version) || null;
}

/**
 * Validates version format.
 *
 * @param {string} version - Moodle version string.
 * @throws {Error} When version format is invalid.
 */
function validateVersion(version: string): void {
    if (!isValidVersionString(version)) {
        throw new Error(`Invalid version format: "${version}"`);
    }
}

/**
 * Determines the target file and parsing requirements based on Moodle version boundaries.
 *
 * @example
 * ```ts
 * determineStrategy('4.5.0');  // { target: 'lib/components.json', requiresTrimming: false, type: 'json' }
 * determineStrategy('3.5.0');  // { target: 'lib/classes/component.php', requiresTrimming: false, type: 'ast' }
 * determineStrategy('2.2.0');  // { target: 'lib/moodlelib.php', requiresTrimming: true, type: 'trimmed-ast' }
 * ```
 *
 * @param {string} version - Semantic version string.
 * @returns {StrategyConfig} Strategy configuration for the specified version.
 * @throws {Error} If version format is invalid or earlier than Moodle 2.0.
 */
export function determineStrategy(version: string): StrategyConfig {
    validateVersion(version);

    if (isVersionGreaterOrEqual(version, '3.8')) {
        return {
            target: 'lib/components.json',
            requiresTrimming: false,
            type: 'json'
        };
    }

    if (isVersionGreaterOrEqual(version, '2.6')) {
        return {
            target: 'lib/classes/component.php',
            requiresTrimming: false,
            type: 'ast'
        };
    }

    return {
        target: 'lib/moodlelib.php',
        requiresTrimming: true,
        type: 'trimmed-ast'
    };
}

/**
 * Dispatches plugintype resolution to the concrete strategy implementation.
 *
 * @param {StrategyConfig} strategy - Configured strategy.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Resolved plugintypes map.
 */
async function dispatchPlugintypesResolution(
    strategy: StrategyConfig,
    moodlePath: string
): Promise<Map<string, string>> {
    if (strategy.type === 'json') {
        return resolveJsonComponents(moodlePath);
    }
    if (strategy.type === 'ast') {
        return resolveClassComponents(moodlePath);
    }
    return resolveLegacyMoodlelibComponents(moodlePath);
}

/**
 * Dispatches subsystem resolution based on configured strategy.
 *
 * @param {StrategyConfig} strategy - Configured strategy.
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<Map<string, string>>} Resolved subsystems map.
 */
async function dispatchSubsystemsResolution(
    strategy: StrategyConfig,
    moodlePath: string
): Promise<Map<string, string>> {
    if (strategy.type === 'json') {
        return resolveJsonSubsystems(moodlePath);
    }
    if (strategy.type === 'ast') {
        return resolveClassSubsystems(moodlePath);
    }
    return resolveLegacySubsystems();
}

/**
 * Merges discovered subplugins into plugintypes map.
 *
 * @param {Map<string, string>} plugintypes - Target map.
 * @param {Map<string, string>} subMap - Subplugin map to copy.
 */
function mergeDiscoveredSubplugins(
    plugintypes: Map<string, string>,
    subMap: Map<string, string>
): void {
    for (const [key, val] of subMap.entries()) {
        plugintypes.set(key, val);
    }
}

/**
 * Enriches plugintypes map with subplugin branches discovered via Scanner.
 *
 * @param {StrategyConfig} strategy - Resolution strategy.
 * @param {Map<string, string>} plugintypes - Target map to enrich.
 * @param {string} moodlePath - Root path of Moodle repository.
 */
async function enrichWithSubplugins(
    strategy: StrategyConfig,
    plugintypes: Map<string, string>,
    moodlePath: string
): Promise<void> {
    if (strategy.type !== 'json') {
        return;
    }
    const subFiles = await findFiles(
        moodlePath,
        ['*/db/subplugins.json', '*/*/db/subplugins.json', '*/*/*/db/subplugins.json', '*/*/*/*/db/subplugins.json'],
        SUBPLUGIN_IGNORED_DIRS
    );
    const subMap = await resolveAllSubplugins(moodlePath, subFiles);
    mergeDiscoveredSubplugins(plugintypes, subMap);
}

/**
 * Resolves component registry internally and caches by version.
 *
 * @param {string} moodlePath - Root path of Moodle repository.
 * @returns {Promise<ComponentMapRegistry>} Populated component registry.
 */
async function buildComponentRegistry(moodlePath: string): Promise<ComponentMapRegistry> {
    const version = await resolveVersion(moodlePath);
    const cached = versionComponentCache.get(version);
    if (cached) {
        return cached;
    }

    const strategy = determineStrategy(version);
    const plugintypes = await dispatchPlugintypesResolution(strategy, moodlePath);
    await enrichWithSubplugins(strategy, plugintypes, moodlePath);
    const subsystems = await dispatchSubsystemsResolution(strategy, moodlePath);

    const registry: ComponentMapRegistry = { plugintypes, subsystems };
    versionComponentCache.set(version, registry);
    return registry;
}

/**
 * Resolves physical base directory paths for Moodle components across any Moodle version (>= 2.0).
 *
 * Automatically detects version, delegates to dedicated strategy handlers,
 * aggregates subsystems and plugintypes into a segregated registry, and persists it at the version level.
 *
 * @example
 * ```ts
 * const registry = await resolverComponent('/var/www/moodle');
 * registry.plugintypes.get('mod');  // 'mod'
 * registry.subsystems.get('group'); // 'group'
 * ```
 *
 * @param {string} moodlePath - Root path of the Moodle repository.
 * @param {string[]} [_pathPatterns] - Optional path patterns.
 * @returns {Promise<ComponentMapRegistry>} Segregated registry containing plugintypes and subsystems.
 */
export async function resolverComponent(
    moodlePath: string,
    _pathPatterns?: string[]
): Promise<ComponentMapRegistry> {
    const inFlight = inFlightComponentMap.get(moodlePath);
    if (inFlight) {
        return inFlight;
    }
    const task = buildComponentRegistry(moodlePath).finally(() => {
        inFlightComponentMap.delete(moodlePath);
    });
    inFlightComponentMap.set(moodlePath, task);
    return task;
}