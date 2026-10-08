import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";
import {
    MoodleSchemaConfigEntry,
    PackageJsonWithMoodleClient,
} from "../interfaces/config.interfaces";
import {
    normalizeMoodleVersion,
    isMoodleVersionSupported,
} from "../config/config-manager";
import { runGeneratorWithProgress } from "./progress-bar";
import {
    colors,
    SEPARATOR,
    PromptContext,
    createPromptInterface,
    askQuestion,
} from "./prompt-helpers";

export function parseWebservicesInput(input: string): string[] {
    const trimmed = input.trim();
    if (!trimmed || trimmed === "[]") {
        throw new Error("Webservices pattern cannot be empty.");
    }

    let items: string[];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                items = parsed.map((s) => String(s));
            } else {
                items = [trimmed];
            }
        } catch {
            const inner = trimmed.slice(1, -1);
            items = inner.split(",");
        }
    } else {
        items = trimmed.split(",");
    }

    const filtered = items
        .map((s) => s.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, ""))
        .filter((s) => s.length > 0);

    if (filtered.length === 0) {
        throw new Error("Webservices pattern cannot be empty.");
    }
    return filtered;
}

export function parseYesNoInput(input: string): boolean {
    const normalized = input.trim().toLowerCase();
    if (normalized === "y" || normalized === "yes") {
        return true;
    }
    if (normalized === "n" || normalized === "no") {
        return false;
    }
    throw new Error("Please answer with 'y', 'yes', 'n', or 'no'.");
}

export function validateNamespace(
    namespace: string,
    existingNamespaces: Set<string>
): boolean {
    const trimmed = namespace.trim();
    if (!trimmed) {
        throw new Error("Namespace cannot be empty.");
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) {
        throw new Error(
            "Invalid namespace format. Namespace can only contain letters, numbers, hyphens, underscores, and dots (no spaces)."
        );
    }
    if (existingNamespaces.has(trimmed)) {
        throw new Error(`Namespace '${trimmed}' already exists.`);
    }
    return true;
}

export function validateSourceOption(option: string): "remote" | "local" | "repository" {
    const trimmed = option.trim();
    if (trimmed === "1") {
        return "remote";
    }
    if (trimmed === "2") {
        return "local";
    }
    if (trimmed === "3") {
        return "repository";
    }
    throw new Error("Invalid option. Please enter 1, 2, or 3.");
}

export function validateRepositoryUrlInput(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) {
        throw new Error("Repository URL cannot be empty.");
    }
    if (!/^(https?:\/\/|git@|ssh:\/\/).+/i.test(trimmed)) {
        throw new Error("Invalid repository URL. Must start with http://, https://, git@, or ssh://");
    }
    return trimmed;
}

export function validateBranchInput(branch: string): string {
    const trimmed = branch.trim();
    if (!trimmed) {
        return "main";
    }
    return trimmed;
}

export function validateMoodleVersionInput(version: string): string {
    const trimmed = version.trim();
    if (!trimmed) {
        throw new Error("Version cannot be empty.");
    }
    if (!isMoodleVersionSupported(trimmed)) {
        throw new Error(
            `Moodle version '${trimmed}' is unsupported. Web services schema generation requires Moodle 2.0 or higher.`
        );
    }
    return normalizeMoodleVersion(trimmed);
}

export function validateLocalPathInput(rawPath: string): string {
    const trimmed = rawPath.trim();
    if (!trimmed) {
        throw new Error("Path cannot be empty.");
    }
    const resolved = trimmed.startsWith("~/")
        ? path.join(os.homedir(), trimmed.slice(2))
        : path.resolve(process.cwd(), trimmed);
    if (!existsSync(resolved)) {
        throw new Error(`Directory '${resolved}' does not exist.`);
    }
    return trimmed;
}

async function promptOfficialSource(
    ctx: PromptContext,
    namespace: string
): Promise<MoodleSchemaConfigEntry> {
    console.log(SEPARATOR);
    let normalizedVersion = "5.0";
    await askQuestion(
        ctx,
        "Please enter the Moodle version",
        "5.0",
        "Version: ",
        (val) => {
            try {
                normalizedVersion = validateMoodleVersionInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );

    console.log(SEPARATOR);
    let webservices: string[] = ["*"];
    await askQuestion(
        ctx,
        "Please enter the webservices pattern",
        "core_user_*, local_plugin_example",
        "Webservices: ",
        (val) => {
            try {
                webservices = parseWebservicesInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );

    console.log(SEPARATOR);
    let saveInProject = false;
    await askQuestion(
        ctx,
        "Would you like to save the schemas in a project directory? (y/n)",
        "y, yes, n, no",
        "Response: ",
        (val) => {
            try {
                saveInProject = parseYesNoInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );

    let outDir: string | undefined;
    if (saveInProject) {
        console.log(SEPARATOR);
        outDir = await askQuestion(
            ctx,
            "Please enter the path to the schemas directory",
            "src/moodleSchemas",
            "Path: ",
            (val) => {
                if (!val.trim()) {
                    return "Path cannot be empty.";
                }
                return undefined;
            }
        );
    }

    return {
        namespace,
        source: {
            type: "moodle-official",
            version: normalizedVersion,
        },
        webservices,
        ...(outDir ? { outDir } : {}),
    };
}

async function promptLocalSource(
    ctx: PromptContext,
    namespace: string
): Promise<MoodleSchemaConfigEntry> {
    console.log(SEPARATOR);
    let localPath = "";
    await askQuestion(
        ctx,
        "Please enter the path to your Moodle directory",
        "~/projects/moodle",
        "Path: ",
        (val) => {
            try {
                localPath = validateLocalPathInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );

    console.log(SEPARATOR);
    let webservices: string[] = ["*"];
    await askQuestion(
        ctx,
        "Please enter the webservices pattern",
        "core_user_*, local_plugin_example",
        "Webservices: ",
        (val) => {
            try {
                webservices = parseWebservicesInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );

    console.log(SEPARATOR);
    const outDir = await askQuestion(
        ctx,
        "Please enter the directory to save the schemas",
        "src/moodleLegacySchemas",
        "Path: ",
        (val) => {
            if (!val.trim()) {
                return "Path cannot be empty.";
            }
            return undefined;
        }
    );

    return {
        namespace,
        source: {
            type: "moodle-local",
            path: localPath,
        },
        webservices,
        outDir,
    };
}

async function promptRepositorySource(
    ctx: PromptContext,
    namespace: string
): Promise<MoodleSchemaConfigEntry> {
    console.log(SEPARATOR);
    let repoUrl = "";
    await askQuestion(
        ctx,
        "Please enter the repository URL",
        "https://github.com/my-org/moodle.git",
        "URL: ",
        (val) => {
            try {
                repoUrl = validateRepositoryUrlInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );

    console.log(SEPARATOR);
    let branch = "main";
    await askQuestion(
        ctx,
        "Please enter the branch or tag",
        "main",
        "Branch: ",
        (val) => {
            branch = validateBranchInput(val);
            return undefined;
        }
    );

    console.log(SEPARATOR);
    let webservices: string[] = ["*"];
    await askQuestion(
        ctx,
        "Please enter the webservices pattern",
        "core_user_*, local_plugin_example",
        "Webservices: ",
        (val) => {
            try {
                webservices = parseWebservicesInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );

    console.log(SEPARATOR);
    const outDir = await askQuestion(
        ctx,
        "Please enter the directory to save the schemas",
        "src/moodleSchemas",
        "Path: ",
        (val) => {
            if (!val.trim()) {
                return "Path cannot be empty.";
            }
            return undefined;
        }
    );

    return {
        namespace,
        source: {
            type: "repository",
            url: repoUrl,
            branch,
        },
        webservices,
        outDir,
    };
}

export interface PromptCreateSchemasOptions {
    pkgPath?: string;
    mockAnswers?: string[];
    generatorRunner?: (pkgPath: string) => Promise<void>;
}

export async function promptCreateSchemas(
    options?: PromptCreateSchemasOptions
): Promise<MoodleSchemaConfigEntry[]> {
    const resolvedPkgPath = options?.pkgPath
        ? path.resolve(options.pkgPath)
        : path.resolve(process.cwd(), "package.json");

    let parsedPkg: PackageJsonWithMoodleClient = {
        name: "moodle-app",
        version: "1.0.0",
    };

    if (existsSync(resolvedPkgPath)) {
        try {
            const content = await fs.readFile(resolvedPkgPath, "utf-8");
            parsedPkg = JSON.parse(content);
        } catch {
            // Keep default structure if file cannot be parsed
        }
    }

    const existingNamespaces = new Set<string>();
    if (Array.isArray(parsedPkg["moodle-client"])) {
        for (const entry of parsedPkg["moodle-client"]) {
            if (entry && typeof entry.namespace === "string") {
                existingNamespaces.add(entry.namespace.trim());
            }
        }
    }

    const sessionCreatedEntries: MoodleSchemaConfigEntry[] = [];
    const isMock = Boolean(options?.mockAnswers && options.mockAnswers.length > 0);
    const rl = isMock ? undefined : createPromptInterface();
    const ctx: PromptContext = {
        rl,
        mockAnswers: options?.mockAnswers,
    };

    try {
        let createMore = true;
        let isFirstQuestion = true;

        while (createMore) {
            if (!isFirstQuestion) {
                console.log(SEPARATOR);
            }
            isFirstQuestion = false;

            // 1. Namespace
            const namespace = await askQuestion(
                ctx,
                "Please enter the namespace name",
                "moodle5.0",
                "Namespace: ",
                (val) => {
                    try {
                        validateNamespace(val, existingNamespaces);
                        return undefined;
                    } catch (err: any) {
                        return err.message;
                    }
                }
            );
            existingNamespaces.add(namespace);

            // 2. Source selection
            console.log(SEPARATOR);
            const sourceTitle =
                "Please select the source for webservice schemas\n[1] Moodle Official (GitHub)\n[2] Moodle Local (Directory)\n[3] Remote Repository (Configurable)\n";
            let sourceType = "remote" as "remote" | "local" | "repository";
            await askQuestion(
                ctx,
                sourceTitle,
                undefined,
                "Option: ",
                (val) => {
                    try {
                        sourceType = validateSourceOption(val);
                        return undefined;
                    } catch (err: any) {
                        return err.message;
                    }
                }
            );

            let newEntry: MoodleSchemaConfigEntry;

            switch (sourceType) {
                case "remote":
                    newEntry = await promptOfficialSource(ctx, namespace);
                    break;
                case "local":
                    newEntry = await promptLocalSource(ctx, namespace);
                    break;
                case "repository":
                    newEntry = await promptRepositorySource(ctx, namespace);
                    break;
                default: {
                    const exhaustiveCheck: never = sourceType;
                    throw new Error(`Unsupported source type: ${exhaustiveCheck}`);
                }
            }

            sessionCreatedEntries.push(newEntry);

            // 6. Create another schema?
            console.log(SEPARATOR);
            await askQuestion(
                ctx,
                "Would you like to create another schema? (y/n)",
                "y, yes, n, no",
                "Response: ",
                (val) => {
                    try {
                        createMore = parseYesNoInput(val);
                        return undefined;
                    } catch (err: any) {
                        return err.message;
                    }
                }
            );
        }

        // Finish question flow & generate
        console.log(SEPARATOR);
        console.log(colors.orange("Generating schemas....\n"));

        // Persist to package.json
        if (!Array.isArray(parsedPkg["moodle-client"])) {
            parsedPkg["moodle-client"] = sessionCreatedEntries;
        } else {
            parsedPkg["moodle-client"].push(...sessionCreatedEntries);
        }

        await fs.writeFile(
            resolvedPkgPath,
            JSON.stringify(parsedPkg, null, 2) + "\n",
            "utf-8"
        );

        // Run schema generation
        if (options?.generatorRunner) {
            await options.generatorRunner(resolvedPkgPath);
        } else {
            await runGeneratorWithProgress(resolvedPkgPath);
        }

        return sessionCreatedEntries;
    } finally {
        if (rl) {
            rl.close();
        }
    }
}
