import fs from "fs/promises";
import path from "path";
import child_process from "child_process";
import { normalizeMoodleVersion } from "../config/config-manager";

function runCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

const MOODLE_GIT_URL = "https://github.com/moodle/moodle.git";
const FALLBACK_LATEST_VERSION = "4.5";

/**
 * Clones a specific Moodle version tag shallowly (--depth 1) into a target directory.
 *
 * @param {string} version - Major.Minor version string (e.g. '4.5')
 * @param {string} targetPath - Directory where the repository should be cloned
 * @returns {Promise<string>} The path to the cloned repository
 */
export async function cloneMoodleVersion(version: string, targetPath: string): Promise<string> {
    const parentDir = path.dirname(targetPath);
    await fs.mkdir(parentDir, { recursive: true });

    const normalized = normalizeMoodleVersion(version);
    const branchTag = `v${normalized}.0`;

    await runCommand(
        `git clone --depth 1 --branch ${branchTag} ${MOODLE_GIT_URL} "${targetPath}"`
    );

    return targetPath;
}

/**
 * Safely removes a downloaded Moodle repository directory from disk.
 *
 * @param {string} targetPath - Path to the directory to clean up
 * @returns {Promise<void>}
 */
export async function cleanupMoodleDirectory(targetPath: string): Promise<void> {
    await fs.rm(targetPath, { recursive: true, force: true });
}

/**
 * Fetches remote tags from Moodle git repository and resolves the highest supported Major.Minor version.
 *
 * @returns {Promise<string>} The latest remote version string (e.g. '4.5')
 */
export async function resolveLatestRemoteVersion(): Promise<string> {
    try {
        const { stdout } = await runCommand(`git ls-remote --tags --refs ${MOODLE_GIT_URL} "refs/tags/v*"`);

        const rawTags = stdout
            .trim()
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .map((line) => line.split("\t")[1])
            .filter((ref): ref is string => Boolean(ref))
            .map((ref) => ref.replace("refs/tags/v", ""));

        const uniqueVersions = new Set<string>();

        for (const tag of rawTags) {
            if (tag.includes("-")) continue;
            const match = tag.match(/^(\d+\.\d+)/);
            if (match && match[1]) {
                const firstPart = match[1].split(".")[0];
                const major = parseInt(firstPart ?? "0", 10);
                if (major >= 2) {
                    uniqueVersions.add(match[1]);
                }
            }
        }

        const sorted = Array.from(uniqueVersions).sort((a, b) => {
            const aParts = a.split(".").map(Number);
            const bParts = b.split(".").map(Number);
            const aMaj = aParts[0] ?? 0;
            const aMin = aParts[1] ?? 0;
            const bMaj = bParts[0] ?? 0;
            const bMin = bParts[1] ?? 0;
            return aMaj !== bMaj ? aMaj - bMaj : aMin - bMin;
        });

        const last = sorted[sorted.length - 1];
        return last ?? FALLBACK_LATEST_VERSION;
    } catch {
        return FALLBACK_LATEST_VERSION;
    }
}
