import fs from "fs/promises";
import path from "path";
import { MoodleClientConfig, RawMoodleClientConfig } from "../interfaces/config.interfaces";

export { MoodleClientConfig, RawMoodleClientConfig };

export const DEFAULT_CONFIG_FILENAME = "moodle-client.config.json";
export const DEFAULT_OUT_DIR = "./moodle-schemas";
export const FALLBACK_MOODLE_VERSION = "4.5";

/**
 * Normalizes version string to 'Major.Minor' format, ignoring patch numbers.
 * Example: '4.5.2' -> '4.5', '4.1.0' -> '4.1'
 *
 * @param {string} version - Full or partial version string
 * @returns {string} Normalized 'Major.Minor' version string
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
 * Loads existing configuration or creates a default one if absent.
 * - If `moodlePath` is defined -> `isLocal = true`
 * - If `moodlePath` is omitted -> `isLocal = false`
 *
 * @param {string} [configPath] - Optional explicit path to configuration file
 * @param {string} [defaultVersion=FALLBACK_MOODLE_VERSION] - Fallback version if creating default
 * @returns {Promise<MoodleClientConfig>} Loaded or created configuration
 */
export async function loadOrCreateConfig(
    configPath: string = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME),
    defaultVersion: string = FALLBACK_MOODLE_VERSION
): Promise<MoodleClientConfig> {
    const fileExists = await fs
        .access(configPath)
        .then(() => true)
        .catch(() => false);

    if (!fileExists) {
        const defaultConfig: RawMoodleClientConfig = {
            version: normalizeMoodleVersion(defaultVersion),
            webservices: ["*"],
            outDir: DEFAULT_OUT_DIR,
        };

        const parentDir = path.dirname(configPath);
        await fs.mkdir(parentDir, { recursive: true });
        await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), "utf-8");

        return {
            version: defaultConfig.version!,
            webservices: defaultConfig.webservices!,
            outDir: defaultConfig.outDir!,
            isLocal: false,
        };
    }

    const rawContent = await fs.readFile(configPath, "utf-8");
    const parsed: RawMoodleClientConfig = JSON.parse(rawContent);

    const version = normalizeMoodleVersion(parsed.version || defaultVersion);
    const webservices = parsed.webservices && parsed.webservices.length > 0 ? parsed.webservices : ["*"];
    const moodlePath = parsed.moodlePath;
    const isLocal = Boolean(moodlePath);
    const outDir = parsed.outDir && parsed.outDir.trim().length > 0 ? parsed.outDir.trim() : undefined;

    if (moodlePath && !outDir) {
        throw new Error(
            `[moodle-client] Configuration Error: 'outDir' is required in '${path.basename(configPath)}' when 'moodlePath' is defined.\n\n` +
            `Configuration file: ${configPath}\n` +
            `Missing property: "outDir"\n\n` +
            `Example of required configuration in '${path.basename(configPath)}':\n` +
            JSON.stringify(
                {
                    moodlePath: moodlePath,
                    outDir: "./moodle-schemas",
                    webservices: webservices,
                },
                null,
                2
            )
        );
    }

    return {
        version,
        webservices,
        outDir,
        moodlePath,
        isLocal,
    };
}
