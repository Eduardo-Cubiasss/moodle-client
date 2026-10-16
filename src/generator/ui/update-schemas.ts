import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";
import {
    MoodleSchemaConfigEntry,
    PackageJsonWithMoodleClient,
    SourceType,
    isSourceType,
    BUNDLED_NAMESPACE,
} from "../interfaces/config.interfaces";
import { SchemaEntryFlags } from "../interfaces/cli.interfaces";
import {
    parseWebservicesInput,
    validateSourceOption,
    validateRepositoryUrlInput,
    validateBranchInput,
    validateMoodleVersionInput,
    validateLocalPathInput,
} from "../config/input-validators";
import { mergeEntryWithFlags, describeEntryChanges, normalizeLegacySource } from "../config/entry-builder";
import { runGeneratorWithProgress, wasErrorReported } from "./progress-bar";
import { findMoodleClientPackageDir } from "../runner";
import { cleanNamespaceOutDir, namespaceNotFoundError, promptNamespaceChoice } from "./delete-schemas";
import { createGeneratorError, reservedNamespaceError } from "../config/config-manager";
import {
    colors,
    SEPARATOR,
    PromptContext,
    createPromptInterface,
    askQuestion,
    parseYesNoInput,
} from "./prompt-helpers";

export interface PromptUpdateSchemasOptions {
    pkgPath?: string;
    mockAnswers?: string[];
    generatorRunner?: (pkgPath: string, namespace: string) => Promise<void>;
}

export interface UpdateSchemasFromOptions {
    pkgPath?: string;
    flags: SchemaEntryFlags;
    /** Regenerate the namespace after saving (`--sync`) */
    sync?: boolean;
    generatorRunner?: (pkgPath: string, namespace: string) => Promise<void>;
}

export interface UpdateSchemasResult {
    /** package.json was written with the new configuration */
    saved: boolean;
    /** The namespace was regenerated */
    synchronized: boolean;
    namespace?: string;
    /** One line per changed field; empty when nothing in the configuration changed */
    changes: string[];
    reason?: string;
}

const NOTHING_TO_UPDATE = "No schema namespaces found in package.json to update.";

const SOURCE_MENU =
    "Please select the source for webservice schemas\n[1] Moodle Official (GitHub)\n[2] Moodle Local (Directory)\n[3] Remote Repository (Configurable)\n";

const SOURCE_OPTION: Readonly<Record<SourceType, string>> = {
    "moodle-official": "1",
    "moodle-local": "2",
    "moodle-repository": "3",
};

interface LoadedForUpdate {
    resolvedPkgPath: string;
    baseDir: string;
    parsedPkg: PackageJsonWithMoodleClient;
    configs: MoodleSchemaConfigEntry[];
}

async function loadConfigsForUpdate(pkgPath?: string): Promise<LoadedForUpdate | undefined> {
    const resolvedPkgPath = pkgPath ? path.resolve(pkgPath) : path.resolve(process.cwd(), "package.json");
    if (!existsSync(resolvedPkgPath)) {
        return undefined;
    }
    const originalPkgRaw = await fs.readFile(resolvedPkgPath, "utf-8");
    let parsedPkg: PackageJsonWithMoodleClient;
    try {
        parsedPkg = JSON.parse(originalPkgRaw);
    } catch {
        return undefined;
    }
    const configs = parsedPkg["moodle-client"];
    if (!Array.isArray(configs) || configs.length === 0) {
        return undefined;
    }
    return { resolvedPkgPath, baseDir: path.dirname(resolvedPkgPath), parsedPkg, configs };
}

function findPackageDir(): string | undefined {
    try {
        return findMoodleClientPackageDir();
    } catch {
        return undefined;
    }
}

/**
 * Every directory regeneration may overwrite: the namespace in the new and old outDir and the
 * package's own copies. Duplicates are removed.
 */
function namespaceDirectories(baseDir: string, before: MoodleSchemaConfigEntry, after: MoodleSchemaConfigEntry): string[] {
    const dirs = new Set<string>();
    for (const entry of [before, after]) {
        if (entry.outDir) {
            dirs.add(path.resolve(baseDir, entry.outDir, entry.namespace));
        }
    }
    const pkgDir = findPackageDir();
    if (pkgDir) {
        dirs.add(path.join(pkgDir, "dist/schemas", before.namespace));
        dirs.add(path.join(pkgDir, "src/schemas", before.namespace));
    }
    return [...dirs];
}

interface DirectoryBackup {
    root: string;
    /** Original directory -> its copy, or null when it did not exist */
    copies: Map<string, string | null>;
}

async function backupDirectories(dirs: string[]): Promise<DirectoryBackup> {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-update-backup-"));
    const copies = new Map<string, string | null>();
    let i = 0;
    for (const dir of dirs) {
        if (existsSync(dir)) {
            const copy = path.join(root, String(i++));
            await fs.cp(dir, copy, { recursive: true });
            copies.set(dir, copy);
        } else {
            copies.set(dir, null);
        }
    }
    return { root, copies };
}

async function restoreDirectories(backup: DirectoryBackup): Promise<void> {
    for (const [dir, copy] of backup.copies) {
        await fs.rm(dir, { recursive: true, force: true });
        if (copy) {
            await fs.cp(copy, dir, { recursive: true });
        }
    }
}

/**
 * Writes the updated entry to package.json.
 */
async function saveEntry(loaded: LoadedForUpdate, index: number, updated: MoodleSchemaConfigEntry): Promise<void> {
    loaded.parsedPkg["moodle-client"] = loaded.configs.map((entry, idx) => (idx === index ? updated : entry));
    await fs.writeFile(loaded.resolvedPkgPath, JSON.stringify(loaded.parsedPkg, null, 2) + "\n", "utf-8");
}

/**
 * Error raised when synchronization fails after the configuration was saved.
 */
function syncFailedError(namespace: string, cause: unknown) {
    const causeText = wasErrorReported(cause)
        ? "the error above"
        : (cause as { details?: string }).details ?? (cause instanceof Error ? cause.message : String(cause));
    return createGeneratorError({
        code: "ERR_SYNC_FAILED",
        title: "Schema Synchronization Failed",
        details: `The configuration of '${namespace}' was saved, but its schemas could not be regenerated (cause: ${causeText}); the previous schemas were restored.`,
        action: `Fix the cause and run 'npx moodle-generate-schemas --namespace ${namespace}', or 'npx moodle-update-schemas --namespace ${namespace}' with the corrected options and --sync.`,
        cause,
    });
}

/**
 * Regenerates only this namespace from the saved configuration. If generation fails, every
 * directory it touched is restored, so the previous schemas keep working. On success, a namespace
 * moved to a different outDir is cleaned from the old one (files moodle-client did not generate stay).
 */
async function synchronizeNamespace(
    loaded: LoadedForUpdate,
    before: MoodleSchemaConfigEntry,
    updated: MoodleSchemaConfigEntry,
    generatorRunner?: (pkgPath: string, namespace: string) => Promise<void>
): Promise<void> {
    const { resolvedPkgPath, baseDir } = loaded;
    const backup = await backupDirectories(namespaceDirectories(baseDir, before, updated));
    try {
        try {
            if (generatorRunner) {
                await generatorRunner(resolvedPkgPath, updated.namespace);
            } else {
                await runGeneratorWithProgress(resolvedPkgPath, { forceNamespaces: [updated.namespace] });
            }
        } catch (genErr) {
            await restoreDirectories(backup);
            throw genErr;
        }
        if (before.outDir && before.outDir !== updated.outDir) {
            const current = loaded.parsedPkg["moodle-client"] ?? [];
            await cleanNamespaceOutDir(baseDir, before, current, async () => false);
        }
    } finally {
        await fs.rm(backup.root, { recursive: true, force: true });
    }
}

function printChanges(namespace: string, changes: string[]): void {
    if (changes.length === 0) {
        console.log(colors.dim(`No configuration changes for '${namespace}'.`));
        return;
    }
    console.log(colors.bold(namespace));
    for (const change of changes) {
        console.log(`  ${change}`);
    }
}

function syncHint(namespace: string): string {
    return `Schemas of '${namespace}' were not synchronized. Run 'npx moodle-generate-schemas --namespace ${namespace}' (or add --sync) to regenerate them.`;
}

/**
 * Saves the entry when it changed. Returns whether package.json was written.
 */
async function persistChanges(loaded: LoadedForUpdate, index: number, updated: MoodleSchemaConfigEntry, changes: string[]): Promise<boolean> {
    if (changes.length === 0) {
        return false;
    }
    await saveEntry(loaded, index, updated);
    console.log(colors.green(`[moodle-client] Configuration of '${updated.namespace}' saved to package.json.`));
    return true;
}

/**
 * Synchronizes the namespace when requested; otherwise explains how to do it later.
 */
async function syncIfRequested(
    loaded: LoadedForUpdate,
    index: number,
    updated: MoodleSchemaConfigEntry,
    changes: string[],
    saved: boolean,
    sync: boolean,
    generatorRunner?: (pkgPath: string, namespace: string) => Promise<void>
): Promise<UpdateSchemasResult> {
    const before = loaded.configs[index]!;
    const namespace = before.namespace;
    if (!sync) {
        console.log(colors.dim(syncHint(namespace)));
        return { saved, synchronized: false, namespace, changes };
    }

    console.log(colors.orange(`Synchronizing schemas for namespace '${namespace}'....\n`));
    try {
        await synchronizeNamespace(loaded, before, updated, generatorRunner);
    } catch (err: unknown) {
        throw saved ? syncFailedError(namespace, err) : err;
    }
    return { saved, synchronized: true, namespace, changes };
}

/**
 * One-line mode of `moodle-update-schemas`: only the given flags change and are saved;
 * `sync` (`--sync`) then regenerates the namespace. With `--namespace` alone nothing changes,
 * and `--sync` regenerates it with its current configuration.
 */
export async function updateSchemasFromOptions(options: UpdateSchemasFromOptions): Promise<UpdateSchemasResult> {
    const namespace = options.flags.namespace?.trim();
    if (namespace === BUNDLED_NAMESPACE) {
        throw reservedNamespaceError();
    }
    const loaded = await loadConfigsForUpdate(options.pkgPath);
    const configs = loaded?.configs ?? [];
    const index = configs.findIndex((c) => c.namespace === namespace);
    if (!loaded || namespace === undefined || index < 0) {
        throw namespaceNotFoundError(namespace ?? "", configs);
    }

    const before = configs[index]!;
    const updated = mergeEntryWithFlags(before, options.flags);
    const changes = describeEntryChanges(before, updated);
    printChanges(namespace, changes);
    if (changes.length === 0 && !options.sync) {
        console.log(colors.dim(`Nothing to do for '${namespace}'. Pass options to change, or --sync to regenerate it.`));
        return { saved: false, synchronized: false, namespace, changes, reason: "No changes and --sync not given." };
    }
    const saved = await persistChanges(loaded, index, updated, changes);
    return syncIfRequested(loaded, index, updated, changes, saved, Boolean(options.sync), options.generatorRunner);
}

/**
 * Asks a question with `current` already typed in the input line: Enter keeps it, and it can be
 * edited or deleted. `parse` validates the final text (an empty text included) and normalizes it.
 */
async function askPrefilled<T>(
    ctx: PromptContext,
    title: string,
    current: string,
    label: string,
    parse: (value: string) => T
): Promise<T> {
    let result: T | undefined;
    await askQuestion(
        ctx,
        title,
        undefined,
        label,
        (val) => {
            try {
                result = parse(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        },
        current
    );
    return result as T;
}

function requiredText(value: string): string {
    if (!value) {
        throw new Error("Path cannot be empty.");
    }
    return value;
}

/** An empty answer clears an optional text value. */
function optionalText(value: string): string | undefined {
    return value || undefined;
}

async function promptSource(
    ctx: PromptContext,
    current: MoodleSchemaConfigEntry,
    type: SourceType
): Promise<MoodleSchemaConfigEntry["source"]> {
    const same = current.source.type === type ? current.source : undefined;
    console.log(SEPARATOR);

    if (type === "moodle-official") {
        const currentVersion = same?.type === "moodle-official" ? same.version : "";
        const version = await askPrefilled(ctx, "Please enter the Moodle version", currentVersion, "Version: ", validateMoodleVersionInput);
        return { type, version };
    }
    if (type === "moodle-repository") {
        const currentUrl = same?.type === "moodle-repository" ? same.url : "";
        const currentBranch = same?.type === "moodle-repository" ? same.branch ?? "main" : "main";
        const url = await askPrefilled(ctx, "Please enter the repository URL", currentUrl, "URL: ", validateRepositoryUrlInput);
        console.log(SEPARATOR);
        const branch = await askPrefilled(ctx, "Please enter the branch or tag (empty for main)", currentBranch, "Branch: ", validateBranchInput);
        return { type, url, branch };
    }
    const currentPath = same?.type === "moodle-local" ? same.path : "";
    const localPath = await askPrefilled(ctx, "Please enter the path to your Moodle directory", currentPath, "Path: ", validateLocalPathInput);
    return { type, path: localPath };
}

async function promptOutDir(ctx: PromptContext, current: MoodleSchemaConfigEntry, type: SourceType): Promise<string | undefined> {
    console.log(SEPARATOR);
    if (type === "moodle-official") {
        return askPrefilled(ctx, "Please enter the directory to save the schemas (empty for none)", current.outDir ?? "", "Path: ", optionalText);
    }
    return askPrefilled(ctx, "Please enter the directory to save the schemas", current.outDir ?? "", "Path: ", requiredText);
}

/**
 * Asks every field of an entry with its current value already typed in: Enter keeps it,
 * and it can be edited or deleted.
 */
async function promptEntryChanges(ctx: PromptContext, stored: MoodleSchemaConfigEntry): Promise<MoodleSchemaConfigEntry> {
    const current = normalizeLegacySource(stored);
    console.log(SEPARATOR);
    const currentOption = isSourceType(current.source.type) ? SOURCE_OPTION[current.source.type] : "";
    const type = await askPrefilled(ctx, SOURCE_MENU.trimEnd(), currentOption, "Option: ", validateSourceOption);

    const source = await promptSource(ctx, current, type);

    console.log(SEPARATOR);
    const webservices = await askPrefilled(ctx, "Please enter the webservices pattern", current.webservices.join(", "),
        "Webservices: ", parseWebservicesInput);

    const outDir = await promptOutDir(ctx, current, type);

    const { outDir: _outDir, ...rest } = current;
    return {
        ...rest,
        source,
        webservices,
        ...(outDir ? { outDir } : {}),
    };
}

async function askYesNo(ctx: PromptContext, title: string): Promise<boolean> {
    let answer = false;
    await askQuestion(ctx, title, "y, yes, n, no", "Response: ", (val) => {
        try {
            answer = parseYesNoInput(val);
            return undefined;
        } catch (err: any) {
            return err.message;
        }
    });
    return answer;
}

/**
 * Interactive `moodle-update-schemas`: pick a namespace, review each field (each starts with its
 * current value), save the changes, then choose whether to synchronize (regenerate) its schemas.
 */
export async function promptUpdateSchemas(options?: PromptUpdateSchemasOptions): Promise<UpdateSchemasResult> {
    const loaded = await loadConfigsForUpdate(options?.pkgPath);
    if (!loaded) {
        console.log(NOTHING_TO_UPDATE);
        return { saved: false, synchronized: false, changes: [], reason: NOTHING_TO_UPDATE };
    }

    const isMock = Boolean(options?.mockAnswers && options.mockAnswers.length > 0);
    const rl = isMock ? undefined : createPromptInterface();
    const ctx: PromptContext = { rl, mockAnswers: options?.mockAnswers };

    // The bundled namespace is not configurable, so it is not offered
    const choices = loaded.configs
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => entry.namespace !== BUNDLED_NAMESPACE);
    if (choices.length === 0) {
        if (rl) {
            rl.close();
        }
        console.log(NOTHING_TO_UPDATE);
        return { saved: false, synchronized: false, changes: [], reason: NOTHING_TO_UPDATE };
    }

    try {
        const choice = await promptNamespaceChoice(ctx, choices.map(({ entry }) => entry));
        const index = choices[choice]!.index;
        const before = loaded.configs[index]!;
        const namespace = before.namespace;
        const updated = await promptEntryChanges(ctx, before);
        const changes = describeEntryChanges(before, updated);

        console.log(SEPARATOR);
        printChanges(namespace, changes);
        const saved = await persistChanges(loaded, index, updated, changes);

        console.log(SEPARATOR);
        const sync = await askYesNo(ctx, `Do you want to synchronize the schemas for ${namespace}? (y/n)`);
        if (rl) {
            rl.close();
        }
        return await syncIfRequested(loaded, index, updated, changes, saved, sync, options?.generatorRunner);
    } finally {
        if (rl) {
            rl.close();
        }
    }
}
