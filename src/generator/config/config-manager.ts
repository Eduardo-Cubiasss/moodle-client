import fs from "fs/promises";
import path from "path";
import { MoodleGeneratorError, type MoodleGeneratorErrorOptions } from "@didactika/moodle-client-schemas";
import {
    MoodleClientConfig,
    RawMoodleClientConfig,
    MoodleSchemaConfigEntry,
    PackageJsonWithMoodleClient,
    ExtendedGeneratorErrorOptions,
    isOfficialSource,
    isLocalSource,
    isRepositorySource,
} from "../interfaces/config.interfaces";

export {
    MoodleClientConfig,
    RawMoodleClientConfig,
    MoodleSchemaConfigEntry,
    PackageJsonWithMoodleClient,
    isOfficialSource,
    isLocalSource,
    isRepositorySource,
};

export function createGeneratorError(options: ExtendedGeneratorErrorOptions): MoodleGeneratorError {
    return new MoodleGeneratorError(options as unknown as MoodleGeneratorErrorOptions);
}

export const DEFAULT_CONFIG_FILENAME = "moodle-client.config.json";
export const FALLBACK_MOODLE_VERSION = "4.5";

/**
 * Normalizes version string to 'Major.Minor' format, ignoring patch numbers.
 * Example: '4.5.2' -> '4.5', '4.1.0' -> '4.1'
 */
export function normalizeMoodleVersion(version: string): string {
    const clean = version.trim().replace(/^v/i, "");
    const match = clean.match(/^(\d+)(?:\.(\d+))?/);
    if (match && match[1]) {
        return match[2] !== undefined ? `${match[1]}.${match[2]}` : match[1];
    }
    return clean;
}

/**
 * Checks whether a given Moodle version is supported (>= 2.0).
 * Web services infrastructure was introduced in Moodle 2.0; versions < 2 are unsupported.
 */
export function isMoodleVersionSupported(version: string): boolean {
    const clean = version.trim().replace(/^v/i, "");
    const match = clean.match(/^(\d+)(?:\.(\d+))?/);
    if (!match || !match[1]) {
        return false;
    }
    const major = parseInt(match[1], 10);
    return major >= 2;
}

/**
 * Loads existing configuration or creates a default one if absent.
 */
export async function loadOrCreateConfig(
    configPath?: string,
    defaultVersion: string = FALLBACK_MOODLE_VERSION,
    isExplicitConfig?: boolean
): Promise<MoodleClientConfig> {
    const isExplicit =
        isExplicitConfig ??
        (configPath !== undefined && path.basename(configPath) !== DEFAULT_CONFIG_FILENAME);
    const resolvedConfigPath = configPath
        ? path.resolve(configPath)
        : path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);

    const fileExists = await fs
        .access(resolvedConfigPath)
        .then(() => true)
        .catch(() => false);

    if (!fileExists) {
        if (isExplicit) {
            throw new MoodleGeneratorError({
                code: "ERR_CONFIG_FILE_NOT_FOUND",
                title: "Configuration File Not Found",
                details: `Explicit configuration file does not exist on disk: '${resolvedConfigPath}'.`,
                action: "Check the path passed to --config or omit the option to use the default moodle-client.config.json.",
            });
        }

        const defaultConfig: RawMoodleClientConfig = {
            version: normalizeMoodleVersion(defaultVersion),
            webservices: ["*"],
        };

        const parentDir = path.dirname(resolvedConfigPath);
        await fs.mkdir(parentDir, { recursive: true });
        await fs.writeFile(resolvedConfigPath, JSON.stringify(defaultConfig, null, 2), "utf-8");

        return {
            version: defaultConfig.version!,
            webservices: defaultConfig.webservices!,
            isLocal: false,
        };
    }

    const rawContent = await fs.readFile(resolvedConfigPath, "utf-8");
    let parsed: RawMoodleClientConfig;
    try {
        parsed = JSON.parse(rawContent);
    } catch (parseErr: unknown) {
        const errorMsg = parseErr instanceof Error ? parseErr.message : String(parseErr);
        throw new MoodleGeneratorError({
            code: "ERR_CONFIG_INVALID_JSON",
            title: "Invalid Configuration File",
            details: `The configuration file at '${resolvedConfigPath}' contains invalid JSON: ${errorMsg}.`,
            action: `Fix syntax errors in ${path.basename(resolvedConfigPath)} or delete the file to regenerate a valid default configuration.`,
            cause: parseErr,
        });
    }

    const rawVersion = parsed.version || defaultVersion;
    if (!isMoodleVersionSupported(rawVersion)) {
        throw new MoodleGeneratorError({
            code: "ERR_MOODLE_VERSION_UNSUPPORTED",
            title: "Unsupported Moodle Version",
            details: `Moodle version '${rawVersion}' is not supported. Web services schema generation requires Moodle 2.0 or higher.`,
            action: `Set "version" to a supported Moodle version (>= 2.0, e.g. "4.5") in '${path.basename(resolvedConfigPath)}'.`,
        });
    }

    const version = normalizeMoodleVersion(rawVersion);
    const webservices =
        parsed.webservices && parsed.webservices.length > 0 ? parsed.webservices : ["*"];
    const moodlePath = parsed.moodlePath;
    const isLocal = Boolean(moodlePath);
    const concurrency = parsed.concurrency;
    const outDir =
        parsed.outDir && parsed.outDir.trim().length > 0 ? parsed.outDir.trim() : undefined;

    if (moodlePath && !outDir) {
        throw new MoodleGeneratorError({
            code: "ERR_CONFIG_MISSING_OUTDIR_LOCAL",
            title: "Missing outDir in Local Mode",
            details: `'outDir' is required in '${path.basename(resolvedConfigPath)}' when 'moodlePath' is defined.`,
            action: `Add "outDir": "./moodle-schemas" (or your preferred output directory) to ${path.basename(resolvedConfigPath)}.`,
        });
    }

    return {
        version,
        webservices,
        outDir,
        moodlePath,
        concurrency,
        isLocal,
    };
}

/**
 * Loads multi-schema configurations from package.json ("moodle-client" property).
 */
export async function loadPackageConfig(
    pkgPath?: string
): Promise<MoodleSchemaConfigEntry[]> {
    const resolvedPkgPath = pkgPath
        ? path.resolve(pkgPath)
        : path.resolve(process.cwd(), "package.json");

    const fileExists = await fs
        .access(resolvedPkgPath)
        .then(() => true)
        .catch(() => false);

    let parsed: PackageJsonWithMoodleClient;
    if (!fileExists) {
        if (pkgPath) {
            throw new MoodleGeneratorError({
                code: "ERR_CONFIG_FILE_NOT_FOUND",
                title: "package.json Not Found",
                details: `package.json was not found at '${resolvedPkgPath}'.`,
                action: "Ensure you are running the command in a project containing a package.json file.",
            });
        }

        parsed = {
            name: "moodle-app",
            version: "1.0.0",
            "moodle-client": [
                {
                    namespace: "webservice",
                    source: {
                        type: "moodle",
                        version: FALLBACK_MOODLE_VERSION,
                    },
                    webservices: ["*"],
                },
            ],
        };
        await fs.writeFile(resolvedPkgPath, JSON.stringify(parsed, null, 2) + "\n", "utf-8");
    } else {
        const rawContent = await fs.readFile(resolvedPkgPath, "utf-8");
        try {
            parsed = JSON.parse(rawContent);
        } catch (parseErr: unknown) {
            const errorMsg = parseErr instanceof Error ? parseErr.message : String(parseErr);
            throw new MoodleGeneratorError({
                code: "ERR_CONFIG_INVALID_JSON",
                title: "Invalid package.json File",
                details: `The package.json file at '${resolvedPkgPath}' contains invalid JSON: ${errorMsg}.`,
                action: "Fix syntax errors in your package.json.",
                cause: parseErr,
            });
        }
    }

    let moodleClient = parsed["moodle-client"];
    if (!moodleClient || !Array.isArray(moodleClient) || moodleClient.length === 0) {
        const defaultEntry: MoodleSchemaConfigEntry = {
            namespace: "webservice",
            source: {
                type: "moodle",
                version: FALLBACK_MOODLE_VERSION,
            },
            webservices: ["*"],
        };
        moodleClient = [defaultEntry];
        parsed["moodle-client"] = moodleClient;
        await fs.writeFile(resolvedPkgPath, JSON.stringify(parsed, null, 2) + "\n", "utf-8");
    }

    const clientConfigs: MoodleSchemaConfigEntry[] = moodleClient;
    const seenNamespaces = new Set<string>();
    const resolvedConfigs: MoodleSchemaConfigEntry[] = [];

    for (let i = 0; i < clientConfigs.length; i++) {
        const entry = clientConfigs[i];
        if (!entry || typeof entry !== "object") {
            throw createGeneratorError({
                code: "ERR_CONFIG_INVALID_ENTRY",
                title: "Invalid Configuration Entry",
                details: `Configuration entry at index ${i} in 'moodle-client' is not an object.`,
                action: "Ensure all elements in 'moodle-client' are valid configuration objects, or run 'npx moodle-delete-schemas' to remove invalid entries.",
            });
        }

        const namespace = typeof entry.namespace === "string" ? entry.namespace.trim() : "";
        if (!namespace) {
            throw createGeneratorError({
                code: "ERR_CONFIG_MISSING_NAMESPACE",
                title: "Missing Configuration Namespace",
                details: `Configuration entry at index ${i} is missing a 'namespace' property.`,
                action: "Specify a unique 'namespace' string for each configuration in 'moodle-client', or run 'npx moodle-delete-schemas' to clean up.",
            });
        }

        if (seenNamespaces.has(namespace)) {
            throw createGeneratorError({
                code: "ERR_CONFIG_DUPLICATE_NAMESPACE",
                title: "Duplicate Configuration Namespace",
                details: `Duplicate configuration namespace '${namespace}' found in 'moodle-client'. Each entry must have a unique namespace.`,
                action: `Assign a unique namespace to each configuration in 'moodle-client', or run 'npx moodle-delete-schemas' to remove duplicates.`,
            });
        }
        seenNamespaces.add(namespace);

        if (!entry.source || typeof entry.source !== "object") {
            throw createGeneratorError({
                code: "ERR_CONFIG_MISSING_SOURCE",
                title: "Missing Configuration Source",
                details: `Configuration '${namespace}' is missing a valid 'source' property.`,
                action: `Define 'source' with type 'local', 'moodle', or 'repository', or run 'npx moodle-delete-schemas' to select and recreate it with 'npx moodle-create-schemas'.`,
            });
        }

        const sourceRecord = entry.source as unknown as Record<string, unknown>;
        const rawOutDir = entry.outDir;
        const outDir = typeof rawOutDir === "string" && rawOutDir.trim().length > 0 ? rawOutDir.trim() : undefined;
        const webservices = Array.isArray(entry.webservices) && entry.webservices.length > 0 ? entry.webservices : ["*"];
        const concurrency = entry.concurrency;

        if (isLocalSource(entry.source)) {
            const rawPath = sourceRecord.path;
            const localPath = typeof rawPath === "string" ? rawPath.trim() : "";
            if (!localPath) {
                throw createGeneratorError({
                    code: "ERR_CONFIG_MISSING_LOCAL_PATH",
                    title: "Missing Local Path",
                    details: `Configuration '${namespace}' specifies source 'local' but is missing 'path'.`,
                    action: `Specify the filesystem path to the Moodle codebase in 'source.path', or run 'npx moodle-delete-schemas' to select and recreate it with 'npx moodle-create-schemas'.`,
                });
            }


            if (!outDir) {
                throw createGeneratorError({
                    code: "ERR_CONFIG_MISSING_OUTDIR_LOCAL",
                    title: "Missing outDir in Local Mode",
                    details: `Missing outDir in Local Mode for configuration '${namespace}'. 'outDir' is required when source type is 'local'.`,
                    action: `Add "outDir": "./schemas/local" (or your preferred output directory) to configuration '${namespace}', or run 'npx moodle-delete-schemas' to remove it and 'npx moodle-create-schemas' to recreate it.`,
                });
            }

            resolvedConfigs.push({
                namespace,
                source: {
                    type: entry.source.type,
                    path: localPath,
                },
                webservices,
                outDir,
                concurrency,
            });
        } else if (isOfficialSource(entry.source)) {
            const rawVersion = typeof sourceRecord.version === "string" && sourceRecord.version.trim()
                ? sourceRecord.version.trim()
                : FALLBACK_MOODLE_VERSION;

            if (!isMoodleVersionSupported(rawVersion)) {
                throw createGeneratorError({
                    code: "ERR_MOODLE_VERSION_UNSUPPORTED",
                    title: "Unsupported Moodle Version",
                    details: `Moodle version '${rawVersion}' is not supported in configuration '${namespace}'. Web services schema generation requires Moodle 2.0 or higher.`,
                    action: `Set "version" to a supported Moodle version (>= 2.0, e.g. "4.5") in configuration '${namespace}', or run 'npx moodle-delete-schemas' to remove it and 'npx moodle-create-schemas' to recreate it.`,
                });
            }

            const version = normalizeMoodleVersion(rawVersion);

            resolvedConfigs.push({
                namespace,
                source: {
                    type: entry.source.type,
                    version,
                },
                webservices,
                outDir,
                concurrency,
            });
        } else if (isRepositorySource(entry.source)) {
            const rawUrl = sourceRecord.url;
            const repoUrl = typeof rawUrl === "string" ? rawUrl.trim() : "";
            if (!repoUrl) {
                throw createGeneratorError({
                    code: "ERR_CONFIG_MISSING_REPOSITORY_URL",
                    title: "Missing Repository URL",
                    details: `Configuration '${namespace}' specifies source 'repository' but is missing 'url'.`,
                    action: `Specify the repository clone URL in 'source.url' (e.g., 'https://github.com/my-org/moodle.git'), or run 'npx moodle-delete-schemas' to remove it and 'npx moodle-create-schemas' to recreate it.`,
                });
            }

            if (!outDir) {
                throw createGeneratorError({
                    code: "ERR_CONFIG_MISSING_OUTDIR_REPOSITORY",
                    title: "Missing outDir in Repository Mode",
                    details: `Missing outDir in Repository Mode for configuration '${namespace}'. 'outDir' is required when source type is 'repository'.`,
                    action: `Add "outDir": "src/schemas" (or your preferred output directory) to configuration '${namespace}', or run 'npx moodle-delete-schemas' to remove it and 'npx moodle-create-schemas' to recreate it.`,
                });
            }

            const rawBranch = sourceRecord.branch;
            const branch = typeof rawBranch === "string" && rawBranch.trim() ? rawBranch.trim() : "main";

            resolvedConfigs.push({
                namespace,
                source: {
                    type: entry.source.type,
                    url: repoUrl,
                    branch,
                },
                webservices,
                outDir,
                concurrency,
            });
        } else {
            const sourceType = typeof sourceRecord.type === "string" ? sourceRecord.type : String(sourceRecord.type);
            throw createGeneratorError({
                code: "ERR_CONFIG_INVALID_SOURCE_TYPE",
                title: "Invalid Source Type",
                details: `Configuration '${namespace}' has unknown source type '${sourceType}'. Must be 'moodle-official' (or 'moodle'), 'local', or 'repository'.`,
                action: `Set 'source.type' to 'moodle-official', 'local', or 'repository', or run 'npx moodle-delete-schemas' to remove it and 'npx moodle-create-schemas' to recreate it.`,
            });
        }
    }

    return resolvedConfigs;
}

