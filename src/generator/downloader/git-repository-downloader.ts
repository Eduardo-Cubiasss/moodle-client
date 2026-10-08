import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import pLimit from "p-limit";
import { simpleGit, SimpleGit } from "simple-git";
import {
    GitRepositoryCloneOptions,
    SubmoduleSyncResult,
} from "../interfaces/repository.interfaces";
import { sanitizeGitError } from "./credential-manager";
import { checkGitEnvironment, createGeneratorError } from "../utils/environment-validator";

/**
 * Synchronizes submodules with resilient fallback if batch initialization fails.
 */
export async function syncSubmodulesResilient(
    git: SimpleGit,
    targetPath: string,
    silent?: boolean
): Promise<SubmoduleSyncResult> {
    const gitmodulesPath = path.join(targetPath, ".gitmodules");
    if (!existsSync(gitmodulesPath)) {
        return { total: 0, successful: 0, failed: [] };
    }

    const batchStart = Date.now();
    try {
        await git.submoduleUpdate([
            "--init",
            "--recursive",
            "--depth",
            "1",
            "--shallow-submodules",
            "--single-branch",
            "--jobs",
            "8",
        ]);
        const elapsed = ((Date.now() - batchStart) / 1000).toFixed(1);
        if (!silent) {
            console.log(`[moodle-client] Submodules synchronized in batch (${elapsed}s).`);
        }
        return { total: 1, successful: 1, failed: [] };
    } catch (_batchErr) {
        if (!silent) {
            console.warn(
                "[moodle-client] Warning: Batch submodule sync failed. Recovering accessible submodules in parallel..."
            );
        }

        const fallbackStart = Date.now();
        const failedList: string[] = [];
        let successCount = 0;

        let statusOutput = "";
        try {
            statusOutput = await git.raw(["submodule", "status"]);
        } catch {
            return { total: 0, successful: 0, failed: ["submodule-status-failed"] };
        }

        const lines = statusOutput
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        const subPaths = lines
            .map((line) => line.split(/\s+/)[1])
            .filter((p): p is string => Boolean(p));

        const createLimit = typeof pLimit === "function" ? pLimit : (pLimit as unknown as { default: typeof pLimit }).default;
        const limit = createLimit(8);

        await Promise.all(
            subPaths.map((subPath) =>
                limit(async () => {
                    const subStart = Date.now();
                    try {
                        await git.submoduleUpdate([
                            "--init",
                            "--depth",
                            "1",
                            "--single-branch",
                            subPath,
                        ]);
                        successCount++;
                        if (!silent) {
                            const subElapsed = ((Date.now() - subStart) / 1000).toFixed(1);
                            console.log(`[moodle-client] Submodule '${subPath}' synchronized (${subElapsed}s).`);
                        }
                    } catch (subErr: unknown) {
                        const errMsg = subErr instanceof Error ? subErr.message : String(subErr);
                        const isShallowErr =
                            errMsg.toLowerCase().includes("unadvertised object") ||
                            errMsg.toLowerCase().includes("shallow") ||
                            errMsg.toLowerCase().includes("reference is not a tree");

                        if (isShallowErr) {
                            try {
                                await git.submoduleUpdate([
                                    "--init",
                                    "--single-branch",
                                    subPath,
                                ]);
                                successCount++;
                                if (!silent) {
                                    const subElapsed = ((Date.now() - subStart) / 1000).toFixed(1);
                                    console.log(
                                        `[moodle-client] Submodule '${subPath}' synchronized without shallow (${subElapsed}s).`
                                    );
                                }
                                return;
                            } catch {
                                // Fall through to recording failure
                            }
                        }

                        failedList.push(subPath);
                        if (!silent) {
                            console.warn(
                                `[moodle-client] Warning: Submodule '${subPath}' could not be initialized (${errMsg}). Skipping.`
                            );
                        }
                    }
                })
            )
        );

        const fallbackElapsed = ((Date.now() - fallbackStart) / 1000).toFixed(1);
        if (!silent) {
            console.log(
                `[moodle-client] Submodule synchronization finished in ${fallbackElapsed}s (${successCount}/${subPaths.length} ready).`
            );
        }

        return {
            total: subPaths.length,
            successful: successCount,
            failed: failedList,
        };
    }
}

/**
 * Shallow clones a remote repository and resiliently initializes its submodules.
 */
export async function cloneRepository(
    options: GitRepositoryCloneOptions
): Promise<string> {
    if (!options.gitInstance) {
        await checkGitEnvironment();
    }

    const branch = options.branch || "main";
    const git = options.gitInstance ?? simpleGit();

    const cloneOptions: string[] = [
        "--depth",
        "1",
        "--single-branch",
        "--no-tags",
        "--branch",
        branch,
    ];

    const cloneStart = Date.now();
    try {
        await git.clone(options.repoUrl, options.targetPath, cloneOptions);
    } catch (err: unknown) {
        const rawMsg = err instanceof Error ? err.message : String(err);
        const cleanMsg = sanitizeGitError(rawMsg, options.token);

        if (/git:\s*(command\s*)?not found|spawn git ENOENT|not recognized as an internal or external command/i.test(rawMsg)) {
            throw createGeneratorError({
                code: "ERR_GIT_NOT_FOUND",
                title: "Git Executable Not Found",
                details: "Git CLI is not installed or not accessible in your system PATH.",
                action: 'Install Git and ensure the "git" executable is accessible in your system PATH.',
                cause: err,
            });
        }

        const isRepoNotFound =
            /repository.*not found|remote:.*not found|404|does not exist|cannot find repository/i.test(rawMsg);
        if (isRepoNotFound) {
            throw createGeneratorError({
                code: "ERR_REPOSITORY_NOT_FOUND",
                title: "Remote Repository Not Found",
                details: `The remote repository at '${options.repoUrl}' could not be found or is inaccessible (404 Not Found).`,
                action: `Verify the repository URL. Run 'npx moodle-delete-schemas' to select and remove the corrupt schema, then run 'npx moodle-create-schemas' to reconfigure.`,
                cause: err,
            });
        }

        const isAuthFailed =
            /authentication failed|invalid username or password|permission to .* denied|terminal prompts disabled|could not read username|401|403|access denied/i.test(rawMsg);
        if (isAuthFailed) {
            throw createGeneratorError({
                code: "ERR_REPOSITORY_AUTH_FAILED",
                title: "Repository Authentication Failed",
                details: `Authentication failed for repository '${options.repoUrl}'. The provided credentials or Personal Access Token are invalid (HTTP 401/403).`,
                action: `Verify your Personal Access Token or credentials. Run 'npx moodle-delete-schemas' to select and remove the corrupt schema, then run 'npx moodle-create-schemas' to reconfigure.`,
                cause: err,
            });
        }

        const isNetwork =
            /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ETIMEDOUT|fetch failed|network\s*(error|is unreachable)|could not resolve host|fatal:\s*unable to access|failed to connect/i.test(rawMsg);
        if (isNetwork) {
            throw createGeneratorError({
                code: "ERR_NETWORK_DISCONNECTED",
                title: "Network Connection Failed",
                details: `Failed to connect to remote host for repository '${options.repoUrl}'. The network connection is unavailable or timed out.`,
                action: "Check your internet connection, proxy settings, or firewall and try again.",
                cause: err,
            });
        }

        throw new Error(cleanMsg);
    }

    const cloneElapsed = ((Date.now() - cloneStart) / 1000).toFixed(1);
    if (!options.silent) {
        console.log(`[moodle-client] Base repository cloned (${cloneElapsed}s).`);
    }

    const repoGit = options.gitInstance ?? simpleGit(options.targetPath);
    await syncSubmodulesResilient(repoGit, options.targetPath, options.silent);

    return options.targetPath;
}

/**
 * Safely removes a cloned repository directory from disk.
 */
export async function cleanupRepository(targetPath: string): Promise<void> {
    await fs.rm(targetPath, { recursive: true, force: true });
}
