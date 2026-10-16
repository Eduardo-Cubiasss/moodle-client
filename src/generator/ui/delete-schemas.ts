import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import {
    MoodleSchemaConfigEntry,
    PackageJsonWithMoodleClient,
    BUNDLED_NAMESPACE,
} from "../interfaces/config.interfaces";
import { createGeneratorError, reservedNamespaceError } from "../config/config-manager";
import {
    findMoodleClientPackageDir,
    selectiveCleanNamespace,
    generateMasterBarrel,
    ensurePackageDeclarationExports,
    hasNonGeneratorFiles,
    removeGeneratedBarrel,
} from "../runner";

export { hasNonGeneratorFiles };
import {
    colors,
    SEPARATOR,
    PromptContext,
    createPromptInterface,
    askQuestion,
    parseYesNoInput,
} from "./prompt-helpers";

export function validateDeleteOption(
    optionStr: string,
    totalCount: number
): number {
    const trimmed = optionStr.trim();
    if (!trimmed) {
        throw new Error("Option cannot be empty.");
    }
    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num < 1 || num > totalCount || String(num) !== trimmed) {
        throw new Error(
            `Invalid option. Please enter a number between 1 and ${totalCount}.`
        );
    }
    return num - 1;
}

export interface PromptDeleteSchemasOptions {
    pkgPath?: string;
    mockAnswers?: string[];
    baseDir?: string;
}

export interface DeleteSchemasFromOptions {
    pkgPath?: string;
    namespace: string;
    /** Also delete files in the namespace directory that moodle-client did not generate */
    purge?: boolean;
    baseDir?: string;
}

export interface DeleteSchemasResult {
    deleted: boolean;
    deletedNamespace?: string;
    reason?: string;
}

const NOTHING_TO_DELETE = "No schema namespaces found in package.json to delete.";

interface LoadedConfigs {
    resolvedPkgPath: string;
    baseDir: string;
    parsedPkg: PackageJsonWithMoodleClient;
    configs: MoodleSchemaConfigEntry[];
}

async function loadConfigsForDelete(pkgPath?: string, baseDir?: string): Promise<LoadedConfigs | undefined> {
    const resolvedPkgPath = pkgPath ? path.resolve(pkgPath) : path.resolve(process.cwd(), "package.json");
    const resolvedBaseDir = baseDir || path.dirname(resolvedPkgPath);
    if (!existsSync(resolvedPkgPath)) {
        return undefined;
    }
    let parsedPkg: PackageJsonWithMoodleClient;
    try {
        parsedPkg = JSON.parse(await fs.readFile(resolvedPkgPath, "utf-8"));
    } catch {
        return undefined;
    }
    const configs: MoodleSchemaConfigEntry[] = parsedPkg["moodle-client"] || [];
    if (!Array.isArray(configs) || configs.length === 0) {
        return undefined;
    }
    return { resolvedPkgPath, baseDir: resolvedBaseDir, parsedPkg, configs };
}

/**
 * Removes the generated files of one namespace from its outDir. Files moodle-client did not generate
 * are kept unless `deleteForeignFiles` returns true for that directory. The outDir root barrel is
 * removed only when no entry in `remainingConfigs` still uses the same outDir.
 */
export async function cleanNamespaceOutDir(
    baseDir: string,
    entry: MoodleSchemaConfigEntry,
    remainingConfigs: MoodleSchemaConfigEntry[],
    deleteForeignFiles: (nsOutDir: string) => Promise<boolean>
): Promise<void> {
    if (!entry.outDir) {
        return;
    }
    const outDirRoot = path.resolve(baseDir, entry.outDir);
    const nsOutDir = path.resolve(outDirRoot, entry.namespace);
    if (existsSync(nsOutDir)) {
        const containsForeignFiles = await hasNonGeneratorFiles(nsOutDir);
        const shouldForceDelete = containsForeignFiles && (await deleteForeignFiles(nsOutDir));

        if (shouldForceDelete) {
            await fs.rm(nsOutDir, { recursive: true, force: true });
        } else {
            await selectiveCleanNamespace(nsOutDir, true);
            try {
                const remaining = await fs.readdir(nsOutDir);
                if (remaining.length === 0) {
                    await fs.rmdir(nsOutDir);
                }
            } catch {
                // Ignore rmdir error
            }
        }
    }

    const otherUsingOutDir = remainingConfigs.some((c) => c.outDir === entry.outDir);
    if (!otherUsingOutDir && existsSync(outDirRoot)) {
        for (const barrel of ["index.d.ts", "index.d.mts", "index.ts"]) {
            // Only generated master barrels are removed; hand-written ones are preserved.
            await removeGeneratedBarrel(path.join(outDirRoot, barrel));
        }
        // NOTE: outDirRoot itself (e.g. 'src/bro') is never deleted, only the namespace directory.
    }
}

function findPackageDir(): string | undefined {
    try {
        return findMoodleClientPackageDir();
    } catch {
        return undefined;
    }
}

/**
 * Deletes the namespace at `index`: its generated files, its copies inside the package, its
 * package.json entry, and then refreshes the master barrel.
 */
async function removeNamespace(
    loaded: LoadedConfigs,
    index: number,
    deleteForeignFiles: (nsOutDir: string) => Promise<boolean>
): Promise<DeleteSchemasResult> {
    const { resolvedPkgPath, baseDir, parsedPkg, configs } = loaded;
    const targetEntry = configs[index];
    if (!targetEntry) {
        return { deleted: false, reason: `Configuration at index ${index} not found.` };
    }
    const targetNs = targetEntry.namespace;
    const remainingConfigs = configs.filter((_, idx) => idx !== index);
    const isBundled = targetNs === BUNDLED_NAMESPACE;

    // 1. Clean outDir files for target namespace
    await cleanNamespaceOutDir(baseDir, targetEntry, remainingConfigs, deleteForeignFiles);

    // 2. Clean in package and node_modules/@didactika/moodle-client; the bundled schemas are never touched
    const pkgDir = findPackageDir();
    const candidateDirs: string[] = isBundled
        ? []
        : [
              path.join(baseDir, "node_modules/@didactika/moodle-client/src/schemas", targetNs),
              path.join(baseDir, "node_modules/@didactika/moodle-client/dist/schemas", targetNs),
          ];
    if (pkgDir && !isBundled) {
        candidateDirs.push(path.join(pkgDir, "dist/schemas", targetNs));
        candidateDirs.push(path.join(pkgDir, "src/schemas", targetNs));
    }
    for (const dir of candidateDirs) {
        try {
            await fs.rm(dir, { recursive: true, force: true });
        } catch {
            // Ignore missing directories
        }
    }

    // 3. Remove entry from package.json
    parsedPkg["moodle-client"] = remainingConfigs;
    await fs.writeFile(resolvedPkgPath, JSON.stringify(parsedPkg, null, 2) + "\n", "utf-8");

    // 4. Regenerate master barrel and update declarations
    if (pkgDir) {
        try {
            const targetSchemasDir = path.join(pkgDir, "dist/schemas");
            await generateMasterBarrel(targetSchemasDir, remainingConfigs, pkgDir, baseDir);
            await ensurePackageDeclarationExports(pkgDir);
        } catch {
            // Ignore barrel generation errors if package files are unwriteable
        }
    }

    if (isBundled) {
        console.log(colors.green(`[moodle-client] Removed the '${targetNs}' entry from package.json. The bundled '${targetNs}' namespace stays available; reinstall @didactika/moodle-client to restore its schemas if they were regenerated.\n`));
    } else {
        console.log(colors.green(`[moodle-client] Successfully deleted namespace '${targetNs}'.\n`));
    }
    return { deleted: true, deletedNamespace: targetNs };
}

/**
 * Error raised when a namespace given on the command line is not configured.
 */
export function namespaceNotFoundError(namespace: string, configs: MoodleSchemaConfigEntry[]) {
    const known = configs.map((c) => `'${c.namespace}'`).join(", ") || "none";
    return createGeneratorError({
        code: "ERR_NAMESPACE_NOT_FOUND",
        title: "Namespace Not Found",
        details: `Namespace '${namespace}' is not configured in 'moodle-client'. Configured namespaces: ${known}.`,
        action: "Check the value of '--namespace'.",
    });
}

/**
 * One-line mode of `moodle-delete-schemas`. Without `purge`, files in the namespace directory that
 * moodle-client did not generate are kept.
 */
export async function deleteSchemasFromOptions(
    options: DeleteSchemasFromOptions
): Promise<DeleteSchemasResult> {
    const loaded = await loadConfigsForDelete(options.pkgPath, options.baseDir);
    const index = loaded ? loaded.configs.findIndex((c) => c.namespace === options.namespace) : -1;
    if (!loaded || index < 0) {
        // The bundled namespace can only be "deleted" as a stale package.json entry
        throw options.namespace === BUNDLED_NAMESPACE ? reservedNamespaceError() : namespaceNotFoundError(options.namespace, loaded?.configs ?? []);
    }
    console.log(colors.orange(`Deleting schemas for namespace '${options.namespace}'...\n`));
    return removeNamespace(loaded, index, async (nsOutDir) => {
        if (!options.purge) {
            const relativePath = path.relative(loaded.baseDir, nsOutDir) || nsOutDir;
            console.log(colors.dim(`Keeping files in '${relativePath}' that were not generated by moodle-client (pass --purge to delete them).`));
        }
        return Boolean(options.purge);
    });
}

export async function promptDeleteSchemas(
    options?: PromptDeleteSchemasOptions
): Promise<DeleteSchemasResult> {
    const loaded = await loadConfigsForDelete(options?.pkgPath, options?.baseDir);
    if (!loaded) {
        console.log(NOTHING_TO_DELETE);
        return { deleted: false, reason: NOTHING_TO_DELETE };
    }
    const { configs, baseDir } = loaded;

    const isMock = Boolean(options?.mockAnswers && options.mockAnswers.length > 0);
    const rl = isMock ? undefined : createPromptInterface();
    const ctx: PromptContext = {
        rl,
        mockAnswers: options?.mockAnswers,
    };

    try {
        const selectedIndex = await promptNamespaceChoice(ctx, configs);

        console.log(colors.orange("Deleting schemas...\n"));

        return await removeNamespace(loaded, selectedIndex, async (nsOutDir) => {
            console.log(SEPARATOR);
            const relativePath = path.relative(baseDir, nsOutDir) || nsOutDir;
            let shouldForceDelete = false;
            await askQuestion(
                ctx,
                `Directory '${relativePath}' contains files that were not generated by moodle-client. Do you want to delete them anyway? (y/n)`,
                "y, yes, n, no",
                "Response: ",
                (val) => {
                    try {
                        shouldForceDelete = parseYesNoInput(val);
                        return undefined;
                    } catch (err: any) {
                        return err.message;
                    }
                }
            );
            return shouldForceDelete;
        });
    } finally {
        if (rl) {
            rl.close();
        }
    }
}

/**
 * Shows the numbered list of configured namespaces and returns the 0-based index chosen.
 */
export async function promptNamespaceChoice(
    ctx: PromptContext,
    configs: MoodleSchemaConfigEntry[]
): Promise<number> {
    let optionsList = "Please enter namespace\n";
    optionsList += `~ Example: 1 ~\n`;
    configs.forEach((entry, idx) => {
        optionsList += `[${idx + 1}] ${entry.namespace}\n`;
    });

    let selectedIndex = 0;
    await askQuestion(
        ctx,
        optionsList,
        undefined,
        "Option: ",
        (val) => {
            try {
                selectedIndex = validateDeleteOption(val, configs.length);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );
    return selectedIndex;
}
