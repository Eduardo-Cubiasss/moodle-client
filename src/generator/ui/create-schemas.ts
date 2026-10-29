import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import {
    MoodleSchemaConfigEntry,
    PackageJsonWithMoodleClient,
    SourceType,
    isLocalSource,
} from "../interfaces/config.interfaces";
import { SchemaEntryFlags } from "../interfaces/cli.interfaces";
import {
    parseWebservicesInput,
    validateNamespace,
    validateSourceOption,
    validateRepositoryUrlInput,
    validateBranchInput,
    validateMoodleVersionInput,
    validateLocalPathInput,
} from "../config/input-validators";
import { buildEntryFromFlags } from "../config/entry-builder";
import { toSavedEntry } from "../config/config-manager";
import { resolveLocalPath } from "../config/local-path";
import { runGeneratorWithProgress } from "./progress-bar";
import { findMoodleClientPackageDir, RunGeneratorOptions } from "../runner";
import { askLocalPath, canPrompt } from "./local-path-prompt";
import {
    colors,
    SEPARATOR,
    PromptContext,
    createPromptInterface,
    askQuestion,
    parseYesNoInput,
} from "./prompt-helpers";

export {
    parseYesNoInput,
    parseWebservicesInput,
    validateNamespace,
    validateSourceOption,
    validateRepositoryUrlInput,
    validateBranchInput,
    validateMoodleVersionInput,
    validateLocalPathInput,
};

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

/**
 * The path is used for this generation only: it is never saved, since it differs on every machine.
 */
async function promptLocalSource(
    ctx: PromptContext,
    namespace: string,
    env?: NodeJS.ProcessEnv
): Promise<MoodleSchemaConfigEntry> {
    const localPath = await resolveLocalPath(namespace, { env, ask: (ns) => askLocalPath(ctx, ns) });

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
            type: "moodle-repository",
            url: repoUrl,
            branch,
        },
        webservices,
        outDir,
    };
}

export type CreateGeneratorRunner = (pkgPath: string, options: RunGeneratorOptions) => Promise<void>;

export interface PromptCreateSchemasOptions {
    pkgPath?: string;
    mockAnswers?: string[];
    env?: NodeJS.ProcessEnv;
    generatorRunner?: CreateGeneratorRunner;
}

export interface CreateSchemasFromOptions {
    pkgPath?: string;
    flags: SchemaEntryFlags;
    mockAnswers?: string[];
    env?: NodeJS.ProcessEnv;
    generatorRunner?: CreateGeneratorRunner;
}

interface LoadedPackage {
    resolvedPkgPath: string;
    parsedPkg: PackageJsonWithMoodleClient;
    originalPkgRaw?: string;
    existedInitially: boolean;
    existingNamespaces: Set<string>;
}

async function loadPackageForCreate(pkgPath?: string): Promise<LoadedPackage> {
    const resolvedPkgPath = pkgPath ? path.resolve(pkgPath) : path.resolve(process.cwd(), "package.json");
    const existedInitially = existsSync(resolvedPkgPath);
    let originalPkgRaw: string | undefined;
    let parsedPkg: PackageJsonWithMoodleClient = { name: "moodle-app", version: "1.0.0" };

    if (existedInitially) {
        try {
            originalPkgRaw = await fs.readFile(resolvedPkgPath, "utf-8");
            parsedPkg = JSON.parse(originalPkgRaw);
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
    return { resolvedPkgPath, parsedPkg, originalPkgRaw, existedInitially, existingNamespaces };
}

/**
 * Appends the new entries to package.json (without the path of local sources) and generates them,
 * local ones from the path given for this run. If generation fails, package.json is restored and
 * every directory created for the new entries is removed.
 */
async function persistAndGenerate(
    loaded: LoadedPackage,
    newEntries: MoodleSchemaConfigEntry[],
    generatorRunner?: CreateGeneratorRunner
): Promise<void> {
    const { resolvedPkgPath, parsedPkg, originalPkgRaw, existedInitially } = loaded;
    const saved = newEntries.map(toSavedEntry);

    if (!Array.isArray(parsedPkg["moodle-client"])) {
        parsedPkg["moodle-client"] = saved;
    } else {
        parsedPkg["moodle-client"].push(...saved);
    }
    await fs.writeFile(resolvedPkgPath, JSON.stringify(parsedPkg, null, 2) + "\n", "utf-8");

    const runOptions: RunGeneratorOptions = {
        forceNamespaces: newEntries.map((e) => e.namespace),
        sources: Object.fromEntries(newEntries.filter((e) => isLocalSource(e.source)).map((e) => [e.namespace, e.source])),
    };
    try {
        await (generatorRunner ?? runGeneratorWithProgress)(resolvedPkgPath, runOptions);
    } catch (genErr) {
        // Rollback package.json if initial schema creation failed
        if (existedInitially && originalPkgRaw !== undefined) {
            await fs.writeFile(resolvedPkgPath, originalPkgRaw, "utf-8");
        } else if (!existedInitially) {
            await fs.rm(resolvedPkgPath, { force: true });
        }

        // Clean up any directories created for the new entries
        const configDir = path.dirname(resolvedPkgPath);
        let pkgDir: string | undefined;
        try {
            pkgDir = findMoodleClientPackageDir();
        } catch {
            pkgDir = undefined;
        }
        for (const entry of newEntries) {
            if (entry.outDir) {
                const nsOutDir = path.resolve(configDir, entry.outDir, entry.namespace);
                await fs.rm(nsOutDir, { recursive: true, force: true });
                const parentOutDir = path.resolve(configDir, entry.outDir);
                try {
                    const items = await fs.readdir(parentOutDir);
                    if (items.length === 0) {
                        await fs.rmdir(parentOutDir);
                    }
                } catch {
                    // Ignore if directory doesn't exist
                }
            }
            if (pkgDir) {
                const distNsDir = path.join(pkgDir, "dist/schemas", entry.namespace);
                await fs.rm(distNsDir, { recursive: true, force: true });
            }
        }

        throw genErr;
    }
}

/**
 * One-line mode of `moodle-create-schemas`: builds the entry from flags, appends it to
 * package.json and generates it, with the same rollback as the wizard. A local source takes its
 * path from `--source.path`, MOODLE_<NAMESPACE>_PATH, or a prompt when there is a terminal.
 */
export async function createSchemasFromOptions(
    options: CreateSchemasFromOptions
): Promise<MoodleSchemaConfigEntry> {
    const loaded = await loadPackageForCreate(options.pkgPath);
    let entry = buildEntryFromFlags(options.flags, loaded.existingNamespaces);
    if (isLocalSource(entry.source) && !entry.source.path) {
        const isMock = Boolean(options.mockAnswers && options.mockAnswers.length > 0);
        const rl = !isMock && process.stdin.isTTY ? createPromptInterface() : undefined;
        const ctx: PromptContext = { rl, mockAnswers: options.mockAnswers };
        try {
            const ask = canPrompt(ctx) ? (namespace: string) => askLocalPath(ctx, namespace) : undefined;
            entry = { ...entry, source: { type: "moodle-local", path: await resolveLocalPath(entry.namespace, { env: options.env, ask }) } };
        } finally {
            rl?.close();
        }
    }
    console.log(colors.orange(`Generating schemas for namespace '${entry.namespace}'....\n`));
    await persistAndGenerate(loaded, [entry], options.generatorRunner);
    return entry;
}

export async function promptCreateSchemas(
    options?: PromptCreateSchemasOptions
): Promise<MoodleSchemaConfigEntry[]> {
    const loaded = await loadPackageForCreate(options?.pkgPath);
    const existingNamespaces = loaded.existingNamespaces;

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
                "moodle50",
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
            let sourceType: SourceType = "moodle-official";
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

            const newEntry = await promptSourceFields(ctx, namespace, sourceType, options?.env);
            sessionCreatedEntries.push(newEntry);

            // 3. Create another schema?
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

        // Release stdin readline interface before executing generator
        if (rl) {
            rl.close();
        }

        console.log(SEPARATOR);
        console.log(colors.orange("Generating schemas....\n"));
        await persistAndGenerate(loaded, sessionCreatedEntries, options?.generatorRunner);

        return sessionCreatedEntries;
    } finally {
        if (rl) {
            rl.close();
        }
    }
}

/**
 * Asks the source-specific questions for a new entry.
 */
function promptSourceFields(
    ctx: PromptContext,
    namespace: string,
    sourceType: SourceType,
    env?: NodeJS.ProcessEnv
): Promise<MoodleSchemaConfigEntry> {
    switch (sourceType) {
        case "moodle-official":
            return promptOfficialSource(ctx, namespace);
        case "moodle-local":
            return promptLocalSource(ctx, namespace, env);
        case "moodle-repository":
            return promptRepositorySource(ctx, namespace);
        default: {
            const exhaustiveCheck: never = sourceType;
            throw new Error(`Unsupported source type: ${exhaustiveCheck}`);
        }
    }
}
