import type { SimpleGit } from "simple-git";

export interface GitRepositoryCloneOptions {
    repoUrl: string;
    targetPath: string;
    branch?: string;
    token?: string;
    silent?: boolean;
    gitInstance?: SimpleGit;
}

export interface SubmoduleSyncResult {
    total: number;
    successful: number;
    failed: string[];
}
