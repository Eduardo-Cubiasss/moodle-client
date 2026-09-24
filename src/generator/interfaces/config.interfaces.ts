/**
 * Fully resolved configuration used by the webservice generator pipeline.
 */
export interface MoodleClientConfig {
    /** Target Moodle major.minor version string (e.g. '4.5') */
    version: string;
    /** List of webservice patterns or exact names to include */
    webservices: string[];
    /** Output directory path for generated webservice client files */
    outDir: string;
    /** Local filesystem path to Moodle codebase (if present, isLocal is true) */
    moodlePath?: string;
    /** Whether extraction uses local codebase or downloads official remote git version */
    isLocal: boolean;
}

/**
 * Raw configuration structure read directly from disk (moodle-client.config.json).
 */
export interface RawMoodleClientConfig {
    version?: string;
    webservices?: string[];
    outDir?: string;
    moodlePath?: string;
}
