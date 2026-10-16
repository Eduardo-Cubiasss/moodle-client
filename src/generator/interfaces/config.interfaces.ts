import type { MoodleGeneratorErrorCode } from "@didactika/moodle-client-schemas";

/**
 * Namespace of the Moodle 4.5 web services bundled with the package. It is part of the library,
 * not of the user's configuration: it cannot be declared, updated, regenerated or deleted.
 */
export const BUNDLED_NAMESPACE = "webservice";

/**
 * Moodle version of the bundled namespace. To update it, change this value and run
 * `npm run schemas:bundle` in this repository (a development-only script, not published).
 */
export const BUNDLED_MOODLE_VERSION = "4.5";

/** The only accepted values of `source.type`. */
export const SOURCE_TYPES = ["moodle-official", "moodle-repository", "moodle-local"] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

/**
 * Short source type names used by pre-release builds, mapped to their replacement.
 * They are no longer accepted; the map only feeds the error message that names the fix.
 */
export const LEGACY_SOURCE_TYPES: Readonly<Record<string, SourceType>> = {
    moodle: "moodle-official",
    official: "moodle-official",
    repository: "moodle-repository",
    remote: "moodle-repository",
    git: "moodle-repository",
    local: "moodle-local",
};

export interface MoodleLocalSource {
    type: "moodle-local";
    path: string;
}

export interface MoodleOfficialSource {
    type: "moodle-official";
    version: string;
}

export interface MoodleRepositorySource {
    type: "moodle-repository";
    url: string;
    branch?: string;
}

export type MoodleSourceConfig =
    | MoodleLocalSource
    | MoodleOfficialSource
    | MoodleRepositorySource;

function sourceTypeOf(source: unknown): unknown {
    if (!source || typeof source !== "object") return undefined;
    return (source as { type?: unknown }).type;
}

/**
 * Type guard for official Moodle release sources.
 */
export function isOfficialSource(source: unknown): source is MoodleOfficialSource {
    return sourceTypeOf(source) === "moodle-official";
}

/**
 * Type guard for local directory sources.
 */
export function isLocalSource(source: unknown): source is MoodleLocalSource {
    return sourceTypeOf(source) === "moodle-local";
}

/**
 * Type guard for remote Git repository sources.
 */
export function isRepositorySource(source: unknown): source is MoodleRepositorySource {
    return sourceTypeOf(source) === "moodle-repository";
}

/**
 * Checks whether a value is one of the accepted source types.
 */
export function isSourceType(value: unknown): value is SourceType {
    return typeof value === "string" && (SOURCE_TYPES as readonly string[]).includes(value);
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
    | "ERR_CONFIG_INVALID_SOURCE_TYPE"
    | "ERR_SCHEMA_MALFORMED"
    | "ERR_OUTPUT_DIRECTORY_NOT_WRITABLE"
    | "ERR_OUTPUT_DIRECTORY_EMPTY"
    | "ERR_CONFIG_INACCESSIBLE_PATH"
    | "ERR_REPOSITORY_NOT_FOUND"
    | "ERR_REPOSITORY_AUTH_FAILED"
    | "ERR_CONFIG_INVALID_NAMESPACE"
    | "ERR_CONFIG_RESERVED_NAMESPACE"
    | "ERR_NAMESPACE_NOT_FOUND"
    | "ERR_CLI_UNKNOWN_OPTION"
    | "ERR_CLI_MISSING_OPTION"
    | "ERR_CLI_INVALID_OPTION"
    | "ERR_SYNC_FAILED";

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
