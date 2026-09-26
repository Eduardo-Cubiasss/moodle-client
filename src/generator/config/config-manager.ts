import fs from "fs/promises";
import path from "path";
import { MoodleGeneratorError } from "@didactika/moodle-client-schemas";
import { MoodleClientConfig, RawMoodleClientConfig } from "../interfaces/config.interfaces";

export { MoodleClientConfig, RawMoodleClientConfig };

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

    return {
        version,
        webservices,
        moodlePath,
        concurrency,
        isLocal,
    };
}
