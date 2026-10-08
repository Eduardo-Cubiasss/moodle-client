import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import {
    MoodleSchemaConfigEntry,
    PackageJsonWithMoodleClient,
} from "../interfaces/config.interfaces";
import {
    findMoodleClientPackageDir,
    selectiveCleanNamespace,
    generateMasterBarrel,
    ensurePackageDeclarationExports,
} from "../runner";
import {
    colors,
    PromptContext,
    createPromptInterface,
    askQuestion,
} from "./prompt-helpers";
import { validateOutputDirectoryNotEmpty } from "../utils/environment-validator";

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

export interface DeleteSchemasResult {
    deleted: boolean;
    deletedNamespace?: string;
    reason?: string;
}

export async function promptDeleteSchemas(
    options?: PromptDeleteSchemasOptions
): Promise<DeleteSchemasResult> {
    const resolvedPkgPath = options?.pkgPath
        ? path.resolve(options.pkgPath)
        : path.resolve(process.cwd(), "package.json");
    const baseDir = options?.baseDir || path.dirname(resolvedPkgPath);

    if (!existsSync(resolvedPkgPath)) {
        console.log("No schema namespaces found in package.json to delete.");
        return {
            deleted: false,
            reason: "No schema namespaces found in package.json to delete.",
        };
    }

    let parsedPkg: PackageJsonWithMoodleClient;
    try {
        const content = await fs.readFile(resolvedPkgPath, "utf-8");
        parsedPkg = JSON.parse(content);
    } catch {
        console.log("No schema namespaces found in package.json to delete.");
        return {
            deleted: false,
            reason: "No schema namespaces found in package.json to delete.",
        };
    }

    const configs: MoodleSchemaConfigEntry[] = parsedPkg["moodle-client"] || [];
    if (!Array.isArray(configs) || configs.length === 0) {
        console.log("No schema namespaces found in package.json to delete.");
        return {
            deleted: false,
            reason: "No schema namespaces found in package.json to delete.",
        };
    }

    const isMock = Boolean(options?.mockAnswers && options.mockAnswers.length > 0);
    const rl = isMock ? undefined : createPromptInterface();
    const ctx: PromptContext = {
        rl,
        mockAnswers: options?.mockAnswers,
    };

    try {
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

        console.log(colors.orange("Deleting schemas...\n"));

        const targetEntry = configs[selectedIndex];
        if (!targetEntry) {
            return {
                deleted: false,
                reason: `Configuration at index ${selectedIndex} not found.`,
            };
        }
        const targetNs = targetEntry.namespace;

        // 1. Clean outDir files with .webservice.d.ts signature
        if (targetEntry.outDir) {
            const outDirRoot = path.resolve(baseDir, targetEntry.outDir);
            const nsOutDir = path.resolve(outDirRoot, targetNs);
            if (existsSync(nsOutDir)) {
                await validateOutputDirectoryNotEmpty(nsOutDir, targetNs);
                await selectiveCleanNamespace(nsOutDir, true);
                try {
                    const remaining = await fs.readdir(nsOutDir);
                    if (remaining.length === 0) {
                        await fs.rmdir(nsOutDir);
                    }
                } catch {
                    // Ignore rmdir error
                }
            } else if (existsSync(outDirRoot)) {
                await validateOutputDirectoryNotEmpty(outDirRoot, targetNs);
            }

            // Check if any other configuration uses the same outDir
            const otherUsingOutDir = configs
                .filter((_, idx) => idx !== selectedIndex)
                .some((c) => c.outDir === targetEntry.outDir);

            if (!otherUsingOutDir) {
                const outDirRoot = path.resolve(baseDir, targetEntry.outDir);
                if (existsSync(outDirRoot)) {
                    for (const barrel of ["index.d.ts", "index.d.mts", "index.ts"]) {
                        try {
                            await fs.unlink(path.join(outDirRoot, barrel));
                        } catch {
                            // Ignore
                        }
                    }
                    try {
                        const remainingRoot = await fs.readdir(outDirRoot);
                        if (remainingRoot.length === 0) {
                            await fs.rmdir(outDirRoot);
                        }
                    } catch {
                        // Ignore
                    }
                }
            }
        }

        // 2. Clean in package and node_modules/@didactika/moodle-client
        let pkgDir: string | undefined;
        try {
            pkgDir = findMoodleClientPackageDir();
        } catch {
            pkgDir = undefined;
        }

        const candidateDirs: string[] = [
            path.join(baseDir, "node_modules/@didactika/moodle-client/src/schemas", targetNs),
            path.join(baseDir, "node_modules/@didactika/moodle-client/dist/schemas", targetNs),
        ];

        if (pkgDir) {
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
        configs.splice(selectedIndex, 1);
        parsedPkg["moodle-client"] = configs;

        await fs.writeFile(
            resolvedPkgPath,
            JSON.stringify(parsedPkg, null, 2) + "\n",
            "utf-8"
        );

        // 4. Regenerate master barrel and update declarations
        if (pkgDir) {
            try {
                const targetSchemasDir = path.join(pkgDir, "dist/schemas");
                await generateMasterBarrel(targetSchemasDir, configs, pkgDir, baseDir);
                await ensurePackageDeclarationExports(pkgDir);
            } catch {
                // Ignore barrel generation errors if package files are unwriteable
            }
        }

        console.log(colors.green(`[moodle-client] Successfully deleted namespace '${targetNs}'.\n`));

        return {
            deleted: true,
            deletedNamespace: targetNs,
        };
    } finally {
        if (rl) {
            rl.close();
        }
    }
}
