/**
 * Fully resolved configuration used by the Moodle client generator.
 */
export interface MoodleClientConfig {
    /** Target Moodle major.minor version string (e.g. '4.5') */
    version: string;
    /** List of webservice patterns or exact names to include */
    webservices: string[];
    /** Local filesystem path to Moodle codebase (if present, isLocal is true) */
    moodlePath?: string;
    /** Concurrency limit for extraction */
    concurrency?: number;
    /** Whether extraction uses local codebase or downloads official remote git version */
    isLocal: boolean;
}

/**
 * Raw configuration structure read directly from disk (moodle-client.config.json).
 */
export interface RawMoodleClientConfig {
    version?: string;
    webservices?: string[];
    moodlePath?: string;
    concurrency?: number;
    // outDir is accepted for backwards compatibility with existing config files, but ignored
    outDir?: string;
}
