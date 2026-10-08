import type { MoodleGeneratorErrorCode } from "@didactika/moodle-client-schemas";

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
    url: string;
    branch?: string;
}

export type MoodleSourceConfig =
    | MoodleLocalSource
    | MoodleOfficialSource
    | MoodleRepositorySource;

/**
 * Type guard for official Moodle release sources.
 */
export function isOfficialSource(source: unknown): source is MoodleOfficialSource {
    if (!source || typeof source !== "object") return false;
    const type = (source as { type?: unknown }).type;
    return type === "moodle" || type === "moodle-official" || type === "official";
}

/**
 * Type guard for local directory sources.
 */
export function isLocalSource(source: unknown): source is MoodleLocalSource {
    if (!source || typeof source !== "object") return false;
    const type = (source as { type?: unknown }).type;
    return type === "local" || type === "moodle-local";
}

/**
 * Type guard for remote Git repository sources.
 */
export function isRepositorySource(source: unknown): source is MoodleRepositorySource {
    if (!source || typeof source !== "object") return false;
    const type = (source as { type?: unknown }).type;
    return (
        type === "repository" ||
        type === "moodle-repository" ||
        type === "remote" ||
        type === "git"
    );
}

/**
 * Extended error code union covering both schema library codes and custom configuration codes.
 */
export type ExtendedGeneratorErrorCode =
    | MoodleGeneratorErrorCode
    | "ERR_CONFIG_INVALID_ENTRY"
    | "ERR_CONFIG_MISSING_NAMESPACE"
    | "ERR_CONFIG_DUPLICATE_NAMESPACE"
    | "ERR_CONFIG_MISSING_SOURCE"
    | "ERR_CONFIG_MISSING_LOCAL_PATH"
    | "ERR_CONFIG_MISSING_REPOSITORY_URL"
    | "ERR_CONFIG_MISSING_OUTDIR_REPOSITORY"
    | "ERR_CONFIG_INVALID_SOURCE_TYPE";

export interface ExtendedGeneratorErrorOptions {
    code: ExtendedGeneratorErrorCode;
    title: string;
    details: string;
    action: string;
    cause?: unknown;
}

/**
 * Configuration entry for a single Moodle schema namespace.
 */
export interface MoodleSchemaConfigEntry {
    /** Unique namespace identifier (e.g. 'legacy', 'default') */
    namespace: string;
    /** Source of the Moodle codebase (local directory, official git version, or remote git repo) */
    source: MoodleSourceConfig;
    /** List of webservice patterns or exact names to include */
    webservices: string[];
    /** Output directory path. Required for local and repository sources, optional for official */
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
