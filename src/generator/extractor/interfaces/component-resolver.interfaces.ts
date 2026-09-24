import { ComponentStrategyType } from '../types/component-resolver.types';

/**
 * Configuration options and metadata for a specific component resolution strategy.
 */
export interface StrategyConfig {
    target: string;
    requiresTrimming: boolean;
    type: ComponentStrategyType;
}

/**
 * Raw data structure parsed from Moodle lib/components.json.
 */
export interface MoodleComponentsJson {
    plugintypes?: Record<string, string>;
    subsystems?: Record<string, string | null>;
}

/**
 * Raw data structure parsed from Moodle db/subplugins.json files.
 */
export interface MoodleSubpluginsJson {
    plugintypes?: Record<string, string>;
    subplugintypes?: Record<string, string>;
}

/**
 * Segregated registry storing Moodle plugin types and core subsystems independently.
 */
export interface ComponentMapRegistry {
    plugintypes: Map<string, string>;
    subsystems: Map<string, string>;
}

/**
 * Alias for ComponentMapRegistry.
 */
export type ComponentRegistry = ComponentMapRegistry;
