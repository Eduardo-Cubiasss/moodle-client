import process from "node:process";
import path from "node:path";
import os from "node:os";
import { existsSync, statSync, readFileSync, readdirSync } from "node:fs";
import { MoodleSchemaConfigEntry, MoodleSourceConfig, isLocalSource } from "../interfaces/config.interfaces";
import { validateLocalPathInput } from "../config/input-validators";
import { resolveLocalPath } from "../config/local-path";
import { SEPARATOR, PromptContext, askQuestion } from "./prompt-helpers";

export interface LocalPathExampleOptions {
    cwd?: string;
    platform?: NodeJS.Platform;
    searchCandidates?: boolean;
}

/**
 * Checks whether a candidate directory has a Moodle structure:
 * either candidate/version.php or candidate/public/version.php.
 */
export function isMoodleDirectory(candidateDir: string): boolean {
    try {
        if (!existsSync(candidateDir)) {
            return false;
        }
        const stat = statSync(candidateDir);
        if (!stat.isDirectory()) {
            return false;
        }
        const versionFile = existsSync(path.join(candidateDir, "version.php"))
            ? path.join(candidateDir, "version.php")
            : existsSync(path.join(candidateDir, "public", "version.php"))
              ? path.join(candidateDir, "public", "version.php")
              : undefined;

        if (!versionFile) {
            return false;
        }

        const content = readFileSync(versionFile, { encoding: "utf-8", flag: "r" }).slice(0, 1000);
        return /moodle/i.test(content) || /\$version\s*=/i.test(content);
    } catch {
        return false;
    }
}

function formatCandidatePath(candidatePath: string, cwd: string): string {
    return path.resolve(cwd, candidatePath);
}

/**
 * Searches common locations and parent siblings for a real Moodle directory.
 */
export function findCandidateMoodleDirectory(options: { cwd?: string; platform?: NodeJS.Platform } = {}): string | undefined {
    const cwd = options.cwd ?? process.cwd();
    const platform = options.platform ?? process.platform;
    const home = os.homedir();

    // 1. Direct immediate paths relative to cwd
    const immediateCandidates = [
        path.join(cwd, "moodle"),
        path.join(cwd, "..", "moodle"),
        path.join(cwd, "..", "..", "moodle"),
    ];
    for (const cand of immediateCandidates) {
        if (isMoodleDirectory(cand)) {
            return formatCandidatePath(cand, cwd);
        }
    }

    // 2. Siblings of cwd (parent directory subfolders)
    try {
        const parent = path.resolve(cwd, "..");
        if (existsSync(parent)) {
            const entries = readdirSync(parent, { withFileTypes: true });
            const sorted = entries.filter((e) => e.isDirectory() && !e.name.startsWith(".")).sort((a, b) => {
                const aMoodle = a.name.toLowerCase().includes("moodle");
                const bMoodle = b.name.toLowerCase().includes("moodle");
                if (aMoodle && !bMoodle) return -1;
                if (!aMoodle && bMoodle) return 1;
                return a.name.localeCompare(b.name);
            });

            for (const entry of sorted) {
                const full = path.join(parent, entry.name);
                if (full !== path.resolve(cwd) && isMoodleDirectory(full)) {
                    return formatCandidatePath(full, cwd);
                }
            }
        }
    } catch {
        // Ignore read/permission errors
    }

    // 3. Direct subfolders in cwd (excluding node_modules, dist, etc.)
    try {
        if (existsSync(cwd)) {
            const entries = readdirSync(cwd, { withFileTypes: true });
            const ignored = new Set(["node_modules", "dist", "coverage", "vendor", "build", ".git"]);
            for (const entry of entries) {
                if (entry.isDirectory() && !entry.name.startsWith(".") && !ignored.has(entry.name)) {
                    const full = path.join(cwd, entry.name);
                    if (isMoodleDirectory(full)) {
                        return formatCandidatePath(full, cwd);
                    }
                }
            }
        }
    } catch {
        // Ignore
    }

    // 4. User home directories
    const homeCandidates = [
        path.join(home, "moodle"),
        path.join(home, "projects", "moodle"),
        path.join(home, "Sites", "moodle"),
        path.join(home, "workspace", "moodle"),
    ];
    for (const cand of homeCandidates) {
        if (isMoodleDirectory(cand)) {
            return formatCandidatePath(cand, cwd);
        }
    }

    // Direct children of home project folders
    const homeFoldersToScan = [
        path.join(home, "projects"),
        path.join(home, "workspace"),
        path.join(home, "Sites"),
    ];
    for (const parent of homeFoldersToScan) {
        try {
            if (existsSync(parent)) {
                const entries = readdirSync(parent, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isDirectory() && !entry.name.startsWith(".")) {
                        const full = path.join(parent, entry.name);
                        if (isMoodleDirectory(full)) {
                            return formatCandidatePath(full, cwd);
                        }
                    }
                }
            }
        } catch {}
    }

    // 5. Well-known system web roots by platform
    const systemPaths: string[] = [];
    if (platform === "win32") {
        systemPaths.push(
            "C:\\xampp\\htdocs\\moodle",
            "C:\\laragon\\www\\moodle",
            "C:\\wamp64\\www\\moodle",
            "C:\\projects\\moodle",
            "C:\\moodle",
            "D:\\xampp\\htdocs\\moodle",
            "D:\\moodle"
        );
        for (const root of ["C:\\xampp\\htdocs", "C:\\laragon\\www"]) {
            try {
                if (existsSync(root)) {
                    const entries = readdirSync(root, { withFileTypes: true });
                    for (const entry of entries) {
                        if (entry.isDirectory()) {
                            systemPaths.push(path.join(root, entry.name));
                        }
                    }
                }
            } catch {}
        }
    } else if (platform === "darwin") {
        systemPaths.push(
            "/Applications/MAMP/htdocs/moodle",
            "/Applications/XAMPP/xamppfiles/htdocs/moodle",
            "/Library/WebServer/Documents/moodle"
        );
        try {
            const mampHtdocs = "/Applications/MAMP/htdocs";
            if (existsSync(mampHtdocs)) {
                const entries = readdirSync(mampHtdocs, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        systemPaths.push(path.join(mampHtdocs, entry.name));
                    }
                }
            }
        } catch {}
    } else {
        systemPaths.push(
            "/var/www/html/moodle",
            "/var/www/moodle",
            "/srv/http/moodle"
        );
        try {
            const wwwHtml = "/var/www/html";
            if (existsSync(wwwHtml)) {
                const entries = readdirSync(wwwHtml, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        systemPaths.push(path.join(wwwHtml, entry.name));
                    }
                }
            }
        } catch {}
    }

    for (const sysPath of systemPaths) {
        if (isMoodleDirectory(sysPath)) {
            return formatCandidatePath(sysPath, cwd);
        }
    }

    return undefined;
}

/**
 * Returns a static platform-appropriate fallback example path.
 */
export function getDefaultLocalPathExample(platform: NodeJS.Platform = process.platform): string {
    switch (platform) {
        case "win32":
            return "C:\\xampp\\htdocs\\moodle";
        case "darwin":
            return "/Applications/MAMP/htdocs/moodle";
        default:
            return "/var/www/html/moodle";
    }
}

/**
 * Returns a platform-appropriate example path for the local Moodle prompt.
 * Discovers any existing Moodle codebase on disk first (version.php or public/version.php).
 */
export function getLocalPathExample(param?: NodeJS.Platform | LocalPathExampleOptions): string {
    const options: LocalPathExampleOptions =
        typeof param === "string" ? { platform: param, searchCandidates: false } : (param ?? {});
    const platform = options.platform ?? process.platform;
    const shouldSearch = options.searchCandidates ?? true;

    if (shouldSearch) {
        const candidate = findCandidateMoodleDirectory(options);
        if (candidate) {
            return candidate;
        }
    }

    return getDefaultLocalPathExample(platform);
}

/**
 * Whether questions can be asked: answers are mocked (tests) or stdin is a terminal.
 */
export function canPrompt(ctx: PromptContext): boolean {
    return Boolean(ctx.mockAnswers && ctx.mockAnswers.length > 0) || Boolean(ctx.rl) || Boolean(process.stdin.isTTY);
}

/**
 * Asks for the local Moodle path of a namespace. Nothing is prefilled: the path is never saved.
 */
export async function askLocalPath(ctx: PromptContext, namespace: string): Promise<string> {
    console.log(SEPARATOR);
    return askQuestion(
        ctx,
        `Please enter the path to your Moodle directory for '${namespace}'`,
        getLocalPathExample(),
        "Path: ",
        (val) => {
            try {
                validateLocalPathInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );
}

export interface ResolveLocalSourcesOptions {
    ctx: PromptContext;
}

/**
 * Asks the path of every local entry that is about to be generated, when it can be asked.
 * Returns the sources to generate with, by namespace.
 */
export async function resolveLocalSources(
    entries: MoodleSchemaConfigEntry[],
    options: ResolveLocalSourcesOptions
): Promise<Record<string, MoodleSourceConfig>> {
    const sources: Record<string, MoodleSourceConfig> = {};
    const ask = canPrompt(options.ctx) ? (namespace: string) => askLocalPath(options.ctx, namespace) : undefined;
    for (const entry of entries) {
        if (isLocalSource(entry.source)) {
            const localPath = entry.source.path ?? (await resolveLocalPath(entry.namespace, { ask }));
            sources[entry.namespace] = { type: "moodle-local", path: localPath };
        }
    }
    return sources;
}
