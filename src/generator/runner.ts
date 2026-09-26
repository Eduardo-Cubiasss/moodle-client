import fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";
import os from "os";
import {
    extractWebservice,
    generateWebserviceFiles,
    WebServiceSchema,
    mapExtractionErrorToGeneratorError,
} from "@didactika/moodle-client-schemas";
import { loadOrCreateConfig, DEFAULT_CONFIG_FILENAME } from "./config/config-manager";
import { cloneMoodleVersion, cleanupMoodleDirectory } from "./downloader/moodle-downloader";

export interface RunGeneratorOptions {
    silent?: boolean;
    force?: boolean;
}

function logInfo(message: string, silent?: boolean): void {
    if (!silent) {
        console.log(message);
    }
}

/**
 * Checks if a given directory exists and contains webservice schema files.
 */
export async function hasExistingSchemas(dir: string): Promise<boolean> {
    try {
        const stat = await fs.stat(dir);
        if (!stat.isDirectory()) {
            return false;
        }
        const entries = await fs.readdir(dir);
        if (entries.includes("index.ts") || entries.includes("index.d.ts")) {
            return true;
        }
        return entries.some(
            (e) => e.endsWith(".webservice-client.ts") || e.endsWith(".webservice-client.d.ts")
        );
    } catch {
        return false;
    }
}

/**
 * Recursively copies schema files from src to dest as TypeScript declaration files (.d.ts).
 */
async function copyDir(src: string, dest: string): Promise<number> {
    await fs.mkdir(dest, { recursive: true });
    let count = 0;
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            count += await copyDir(srcPath, destPath);
        } else if (entry.name.endsWith(".d.ts") || entry.name.endsWith(".ts")) {
            const content = await fs.readFile(srcPath, "utf-8");
            const dtsPath = destPath.endsWith(".d.ts")
                ? destPath
                : destPath.replace(/\.ts$/, ".d.ts");
            await fs.writeFile(dtsPath, content, "utf-8");
            count++;
        }
    }
    return count;
}

/**
 * Resolves the root directory of the installed @didactika/moodle-client package.
 */
export function findMoodleClientPackageDir(): string {
    // 1. Direct node_modules relative to process.cwd()
    const cwdPkg = path.resolve(process.cwd(), "node_modules/@didactika/moodle-client");
    if (existsSync(path.join(cwdPkg, "package.json"))) {
        return cwdPkg;
    }

    // 2. Ascend upwards from __dirname to find package.json for @didactika/moodle-client
    let current = __dirname;
    while (current !== path.dirname(current)) {
        const pkgJsonPath = path.join(current, "package.json");
        if (existsSync(pkgJsonPath)) {
            try {
                const content = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
                if (content.name === "@didactika/moodle-client") {
                    return current;
                }
            } catch {
                // Ignore parse errors
            }
        }
        current = path.dirname(current);
    }

    // Fallback: parent of generator directory
    return path.resolve(__dirname, "..");
}

/**
 * Ensures declaration files in the package re-export from ./schemas/index.
 */
async function ensurePackageDeclarationExports(pkgDir: string): Promise<void> {
    const dtsFiles = [
        path.join(pkgDir, "dist/index.d.ts"),
        path.join(pkgDir, "dist/index.d.mts"),
    ];

    for (const dtsFile of dtsFiles) {
        if (existsSync(dtsFile)) {
            try {
                const content = await fs.readFile(dtsFile, "utf-8");
                if (!content.includes('from "./schemas/index"') && !content.includes("from './schemas/index'")) {
                    await fs.appendFile(dtsFile, '\nexport * from "./schemas/index";\n', "utf-8");
                }
            } catch {
                // Ignore append error
            }
        }
    }
}

/**
 * Executes the complete web service generation and storage pipeline for Moodle client.
 * Schemas are stored directly inside @didactika/moodle-client and in outDir when configured.
 */
export async function runGenerator(
    configPath?: string,
    options?: RunGeneratorOptions
): Promise<void> {
    const resolvedConfigPath = configPath
        ? path.resolve(configPath)
        : path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
    const configDir = path.dirname(resolvedConfigPath);

    const config = await loadOrCreateConfig(configPath);
    const pkgDir = findMoodleClientPackageDir();
    const targetSchemasDir = path.join(pkgDir, "dist/schemas");

    const force = Boolean(options?.force);

    // If outDir is specified and force is NOT set:
    if (config.outDir && !force) {
        const resolvedOutDir = path.resolve(configDir, config.outDir);
        const existsWithSchemas = await hasExistingSchemas(resolvedOutDir);

        if (existsWithSchemas) {
            logInfo(
                `[moodle-client] Schemas already exist in '${config.outDir}'. Generation skipped.`,
                options?.silent
            );
            await fs.rm(targetSchemasDir, { recursive: true, force: true });
            const count = await copyDir(resolvedOutDir, targetSchemasDir);
            await fs.writeFile(path.join(targetSchemasDir, "index.js"), "export {};\n", "utf-8");
            await fs.writeFile(path.join(targetSchemasDir, "index.mjs"), "export {};\n", "utf-8");
            await ensurePackageDeclarationExports(pkgDir);

            logInfo(
                `[moodle-client] Synchronized ${count} schemas from '${config.outDir}' to '@didactika/moodle-client'.`,
                options?.silent
            );
            logInfo(
                `[moodle-client] You can import types and clients directly: import { MoodleClient } from "@didactika/moodle-client";`,
                options?.silent
            );
            return;
        }
    }

    // Otherwise, perform full extraction and generation
    let targetMoodlePath = config.moodlePath;
    let shouldCleanup = false;

    if (!targetMoodlePath) {
        const tempCloneDir = path.join(os.tmpdir(), `moodle-v${config.version}-${Date.now()}`);
        targetMoodlePath = await cloneMoodleVersion(config.version, tempCloneDir);
        shouldCleanup = true;
    }

    try {
        const result = await extractWebservice({
            moodlePath: targetMoodlePath,
            services: config.webservices,
            concurrency: config.concurrency ?? 8,
        });

        if (result.errors && result.errors.length > 0) {
            for (const err of result.errors) {
                console.error(
                    `[moodle-client] Extraction error: [${err.code}] ${
                        err.serviceName ? `(${err.serviceName}) ` : ""
                    }${err.message}`
                );
            }
            if (result.schemas.length === 0 && result.errors[0]) {
                throw mapExtractionErrorToGeneratorError(result.errors[0], targetMoodlePath);
            }
        }

        // 1. Generate files directly into package's dist/schemas (node_modules)
        await generateWebserviceFiles(
            result.schemas as WebServiceSchema[],
            targetSchemasDir,
            { importSource: "@didactika/moodle-client" }
        );
        await fs.writeFile(path.join(targetSchemasDir, "index.js"), "export {};\n", "utf-8");
        await fs.writeFile(path.join(targetSchemasDir, "index.mjs"), "export {};\n", "utf-8");

        // 2. If outDir is specified, also generate files into outDir
        if (config.outDir) {
            const resolvedOutDir = path.resolve(configDir, config.outDir);
            await generateWebserviceFiles(
                result.schemas as WebServiceSchema[],
                resolvedOutDir,
                { importSource: "@didactika/moodle-client" }
            );
        }

        // 3. If developing in moodle-client repository, also update src/schemas
        const srcSchemasDir = path.join(pkgDir, "src/schemas");
        if (existsSync(srcSchemasDir)) {
            try {
                await generateWebserviceFiles(
                    result.schemas as WebServiceSchema[],
                    srcSchemasDir,
                    { importSource: "@didactika/moodle-client" }
                );
            } catch {
                // Ignore dev directory copy error
            }
        }

        await ensurePackageDeclarationExports(pkgDir);

        if (config.outDir) {
            logInfo(
                `[moodle-client] Successfully generated ${result.schemas.length} webservices into '${config.outDir}' and '@didactika/moodle-client'.`,
                options?.silent
            );
        } else {
            logInfo(
                `[moodle-client] Successfully generated ${result.schemas.length} webservices into '@didactika/moodle-client'.`,
                options?.silent
            );
        }
        logInfo(
            `[moodle-client] You can import types and clients directly: import { MoodleClient } from "@didactika/moodle-client";`,
            options?.silent
        );
    } finally {
        if (shouldCleanup && targetMoodlePath) {
            await cleanupMoodleDirectory(targetMoodlePath);
        }
    }
}
