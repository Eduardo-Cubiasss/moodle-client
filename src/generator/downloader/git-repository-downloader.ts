import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { simpleGit, SimpleGit } from "simple-git";
import {
    GitRepositoryCloneOptions,
    SubmoduleSyncResult,
} from "../interfaces/repository.interfaces";
import { sanitizeGitError } from "../auth/credential-manager";

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

    try {
        await git.submoduleUpdate([
            "--init",
            "--recursive",
            "--depth",
            "1",
            "--shallow-submodules",
            "--jobs",
            "8",
        ]);
        return { total: 1, successful: 1, failed: [] };
    } catch (_batchErr) {
        if (!silent) {
            console.warn(
                "[moodle-client] Warning: Batch submodule sync failed. Recovering accessible submodules individually..."
            );
        }

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

        for (const line of lines) {
            const parts = line.split(/\s+/);
            const subPath = parts[1];
            if (!subPath) {
                continue;
            }

            try {
                await git.submoduleUpdate(["--init", "--depth", "1", subPath]);
                successCount++;
            } catch (subErr: unknown) {
                failedList.push(subPath);
                if (!silent) {
                    const msg = subErr instanceof Error ? subErr.message : String(subErr);
                    console.warn(
                        `[moodle-client] Warning: Submodule '${subPath}' could not be initialized (${msg}). Skipping.`
                    );
                }
            }
        }

        return {
            total: lines.length,
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

    try {
        await git.clone(options.repoUrl, options.targetPath, cloneOptions);
    } catch (err: unknown) {
        const rawMsg = err instanceof Error ? err.message : String(err);
        const cleanMsg = sanitizeGitError(rawMsg, options.token);
        throw new Error(cleanMsg);
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
