export interface MoodleLocalSource {
    type: "local" | "moodle-local";
    path: string;
}

export interface MoodleOfficialSource {
    type: "moodle" | "moodle-official" | "official";
    version: string;
}

export interface MoodleRepositorySource {
    type: "moodle-repository" | "repository" | "remote" | "git";
    url?: string;
    branch?: string;
}

export type MoodleSourceConfig =
    | MoodleLocalSource
    | MoodleOfficialSource
    | MoodleRepositorySource;

/**
 * Configuration entry for a single Moodle schema namespace.
 */
export interface MoodleSchemaConfigEntry {
    /** Unique namespace identifier (e.g. 'legacy', 'default') */
    namespace: string;
    /** Source of the Moodle codebase (local directory or official git version) */
    source: MoodleSourceConfig;
    /** List of webservice patterns or exact names to include */
    webservices: string[];
    /** Output directory path. Required for local source, optional for official */
    outDir?: string;
    /** Concurrency limit for schema extraction */
    concurrency?: number;
}

/**
 * Structure of package.json containing moodle-client configuration.
 */
export interface PackageJsonWithMoodleClient {
    name?: string;
    version?: string;
    "moodle-client"?: MoodleSchemaConfigEntry[];
    [key: string]: unknown;
}

/**
 * Backward compatibility interface for single configuration.
 */
export interface MoodleClientConfig {
    version: string;
    webservices: string[];
    outDir?: string;
    moodlePath?: string;
    concurrency?: number;
    isLocal: boolean;
}

export interface RawMoodleClientConfig {
    version?: string;
    webservices?: string[];
    moodlePath?: string;
    concurrency?: number;
    outDir?: string;
}

