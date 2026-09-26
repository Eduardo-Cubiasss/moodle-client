import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import child_process from "child_process";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import * as tar from "tar";
import { MoodleGeneratorError } from "@didactika/moodle-client-schemas";
import { normalizeMoodleVersion } from "../config/config-manager";

function isGitMissing(err: unknown): boolean {
    if (!err) {
        return false;
    }
    const msg = String(err);
    const code = (err as Record<string, unknown>).code;
    return (
        code === "ENOENT" ||
        /git:\s*(command\s*)?not found/i.test(msg) ||
        /spawn git ENOENT/i.test(msg) ||
        /not recognized as an internal or external command/i.test(msg)
    );
}

function isNetworkError(err: unknown): boolean {
    if (!err) {
        return false;
    }
    const msg = String(err);
    const errObj = err as Record<string, unknown>;
    const causeMsg = errObj.cause ? String(errObj.cause) : "";
    const fullMsg = `${msg} ${causeMsg}`;
    return (
        /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ETIMEDOUT/i.test(fullMsg) ||
        /fetch failed/i.test(fullMsg) ||
        /network\s*(error|is unreachable)/i.test(fullMsg) ||
        /Could not resolve host/i.test(fullMsg) ||
        /fatal:\s*unable to access/i.test(fullMsg) ||
        /Failed to connect/i.test(fullMsg)
    );
}

function runCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ stdout, stderr });
        });
    });
}

const MOODLE_GIT_URL = "https://github.com/moodle/moodle.git";
const FALLBACK_LATEST_VERSION = "4.5";

/**
 * Builds the tarball download URL for a given repository and branch/tag.
 */
export function buildTarballUrl(gitUrl: string, branchTag: string): string {
    const cleanUrl = gitUrl.replace(/\.git$/, "").replace(/\/$/, "");
    const githubMatch = cleanUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)/);
    if (githubMatch) {
        const [, owner, repo] = githubMatch;
        return `https://codeload.github.com/${owner}/${repo}/tar.gz/refs/tags/${branchTag}`;
    }
    return `${cleanUrl}/tarball/${branchTag}`;
}

async function ensureDirectoryExists(dir: string): Promise<void> {
    if (!existsSync(dir)) {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function fetchTarballStream(url: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to download tarball from ${url}: ${response.status} ${response.statusText}`
        );
    }
    return response.body as unknown as ReadableStream<Uint8Array>;
}

let nativeTarAvailable: boolean | null = null;

export function resetNativeTarCheck(): void {
    nativeTarAvailable = null;
}

function isWindowsPlatform(): boolean {
    return process.platform === "win32";
}

function testNativeTarBinary(): boolean {
    try {
        const res = child_process.spawnSync("tar", ["--version"], { stdio: "ignore" });
        return res.status === 0;
    } catch {
        return false;
    }
}

export function hasNativeTar(): boolean {
    if (nativeTarAvailable !== null) {
        return nativeTarAvailable;
    }
    if (isWindowsPlatform()) {
        nativeTarAvailable = false;
        return false;
    }
    nativeTarAvailable = testNativeTarBinary();
    return nativeTarAvailable;
}

function handleTarProcessEvents(
    proc: child_process.ChildProcess,
    resolve: () => void,
    reject: (err: Error) => void
): void {
    let stderrOutput = "";
    proc.stderr?.on("data", (chunk) => {
        stderrOutput += chunk.toString();
    });
    proc.on("close", (code) => {
        if (code === 0) {
            resolve();
            return;
        }
        reject(new Error(`Native tar exited with code ${code}: ${stderrOutput.trim()}`));
    });
    proc.on("error", reject);
}

function extractWithNativeTar(body: ReadableStream<Uint8Array>, targetPath: string): Promise<void> {
    const nodeStream = Readable.fromWeb(body as Parameters<typeof Readable.fromWeb>[0]);
    return new Promise<void>((resolve, reject) => {
        const tarProc = child_process.spawn(
            "tar",
            ["-xzf", "-", "-C", targetPath, "--strip-components=1"],
            {
                stdio: ["pipe", "ignore", "pipe"],
            }
        );
        handleTarProcessEvents(tarProc, resolve, reject);
        pipeline(nodeStream, tarProc.stdin as unknown as NodeJS.WritableStream).catch(reject);
    });
}

function extractWithNodeTar(body: ReadableStream<Uint8Array>, targetPath: string): Promise<void> {
    return pipeline(
        Readable.fromWeb(body as Parameters<typeof Readable.fromWeb>[0]),
        tar.x({
            C: targetPath,
            strip: 1,
        })
    );
}

export async function extractTarStream(
    body: ReadableStream<Uint8Array>,
    targetPath: string
): Promise<void> {
    if (hasNativeTar()) {
        await extractWithNativeTar(body, targetPath);
        return;
    }
    await extractWithNodeTar(body, targetPath);
}

async function cleanupOnFailure(targetPath: string): Promise<void> {
    await fs.rm(targetPath, { recursive: true, force: true }).catch(() => {});
}

/**
 * Downloads a specific Moodle version tag as a compressed tarball archive and streams
 * the extraction directly into the target directory in memory without temporary files.
 */
export async function downloadMoodleTarball(
    version: string,
    targetPath: string,
    moodleGitUrl: string = MOODLE_GIT_URL
): Promise<string> {
    const branchTag = `v${normalizeMoodleVersion(version)}.0`;
    const tarballUrl = buildTarballUrl(moodleGitUrl, branchTag);
    await ensureDirectoryExists(targetPath);

    try {
        const stream = await fetchTarballStream(tarballUrl);
        await extractTarStream(stream, targetPath);
        return targetPath;
    } catch (error) {
        await cleanupOnFailure(targetPath);
        throw error;
    }
}

async function shallowGitClone(version: string, targetPath: string): Promise<string> {
    await ensureDirectoryExists(path.dirname(targetPath));
    const branchTag = `v${normalizeMoodleVersion(version)}.0`;
    await runCommand(`git clone --depth 1 --branch ${branchTag} ${MOODLE_GIT_URL} "${targetPath}"`);
    return targetPath;
}

/**
 * Clones or downloads a specific Moodle version into a target directory.
 * Attempts high-speed tarball stream extraction first, and falls back to git clone if needed.
 */
export async function cloneMoodleVersion(version: string, targetPath: string): Promise<string> {
    let tarballError: unknown;
    try {
        return await downloadMoodleTarball(version, targetPath);
    } catch (err) {
        tarballError = err;
    }

    try {
        return await shallowGitClone(version, targetPath);
    } catch (gitErr: unknown) {
        if (isGitMissing(gitErr)) {
            throw new MoodleGeneratorError({
                code: "ERR_GIT_NOT_FOUND",
                title: "Git Executable Not Found",
                details:
                    "Tarball download failed and Git is not available in system PATH to perform fallback clone.",
                action: "Install Git or restore your internet connection to allow direct archive download.",
                cause: gitErr,
            });
        }
        if (isNetworkError(gitErr) || isNetworkError(tarballError)) {
            throw new MoodleGeneratorError({
                code: "ERR_NETWORK_DISCONNECTED",
                title: "Network Disconnected",
                details:
                    "Failed to reach GitHub to download Moodle repository archive (DNS resolution failed or connection refused).",
                action: "Check your internet connection, proxy settings, or configure a local Moodle instance via 'moodlePath' in moodle-client.config.json.",
                cause: gitErr,
            });
        }
        if (tarballError instanceof MoodleGeneratorError) {
            throw tarballError;
        }
        throw new MoodleGeneratorError({
            code: "ERR_ARCHIVE_EXTRACTION_FAILED",
            title: "Archive Extraction Failed",
            details: `Failed to extract downloaded Moodle tarball archive: ${
                (tarballError as Error)?.message ?? String(tarballError)
            }.`,
            action: "Verify your disk space and network integrity, or try re-running the command.",
            cause: tarballError,
        });
    }
}

/**
 * Safely removes a downloaded Moodle repository directory from disk.
 */
export async function cleanupMoodleDirectory(targetPath: string): Promise<void> {
    await fs.rm(targetPath, { recursive: true, force: true });
}

export async function resolveLatestRemoteVersion(): Promise<string> {
    return FALLBACK_LATEST_VERSION;
}
