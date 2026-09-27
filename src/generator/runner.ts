import fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";
import os from "os";
import pLimit from "p-limit";
import {
    extractWebservice,
    generateWebserviceFiles,
    WebServiceSchema,
    mapExtractionErrorToGeneratorError,
} from "@didactika/moodle-client-schemas";
import {
    loadPackageConfig,
    MoodleSchemaConfigEntry,
} from "./config/config-manager";
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

function toPascalCase(str: string): string {
    return str
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toUpperCase());
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
            (e) =>
                e.endsWith(".webservice-client.ts") ||
                e.endsWith(".webservice-client.d.ts") ||
                e.endsWith(".webservice.ts") ||
                e.endsWith(".webservice.d.ts")
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
 * Strips direct MoodleClient module augmentation from sub-barrels
 * so methods are exclusively exposed through their namespace.
 */
async function stripDirectModuleAugmentation(dir: string): Promise<void> {
    for (const filename of ["index.d.ts", "index.d.mts", "index.ts"]) {
        const filePath = path.join(dir, filename);
        if (existsSync(filePath)) {
            try {
                let content = await fs.readFile(filePath, "utf-8");
                content = content.replace(
                    /\n*declare module ["']@didactika\/moodle-client["']\s*\{\s*interface MoodleClient extends GeneratedMoodleServices\s*\{\}\s*\}[\s\n]*$/,
                    "\n"
                );
                await fs.writeFile(filePath, content, "utf-8");
            } catch {
                // Ignore
            }
        }
    }
}

/**
 * Ensures index.d.mts exists alongside index.d.ts with identical content
 * for full compatibility with ESM/NodeNext module resolution.
 */
async function ensureDtsMtsSync(dir: string): Promise<void> {
    const dtsPath = path.join(dir, "index.d.ts");
    const dmtsPath = path.join(dir, "index.d.mts");
    if (existsSync(dtsPath)) {
        try {
            const content = await fs.readFile(dtsPath, "utf-8");
            await fs.writeFile(dmtsPath, content, "utf-8");
        } catch {
            // Ignore
        }
    }
}

/**
 * Generates the master barrel dist/schemas/index.d.ts that aggregates all schema namespaces.
 */
async function generateMasterBarrel(
    targetSchemasDir: string,
    configs: MoodleSchemaConfigEntry[],
    pkgDir: string,
    configDir?: string
): Promise<void> {
    let masterDts = `/**\n * Master barrel for generated Moodle services namespaces.\n */\n`;

    for (const entry of configs) {
        const typeName = `${toPascalCase(entry.namespace)}GeneratedServices`;
        masterDts += `import type { GeneratedMoodleServices as ${typeName} } from "./${entry.namespace}/index";\n`;
    }

    masterDts += `\nexport type {\n`;
    for (const entry of configs) {
        const typeName = `${toPascalCase(entry.namespace)}GeneratedServices`;
        masterDts += `    ${typeName},\n`;
    }
    masterDts += `};\n`;

    masterDts += `\nexport interface GeneratedMoodleServices {\n`;
    for (const entry of configs) {
        const typeName = `${toPascalCase(entry.namespace)}GeneratedServices`;
        const sourceDesc =
            entry.source.type === "local"
                ? `local (${entry.source.path})`
                : `moodle-official (v${entry.source.version})`;
        masterDts += `    /**\n     * Moodle web services namespace '${entry.namespace}'.\n     * Source: ${sourceDesc}\n     */\n`;
        masterDts += `    ${entry.namespace}: ${typeName};\n`;
    }
    masterDts += `}\n\n`;

    masterDts += `declare module "@didactika/moodle-client" {\n`;
    masterDts += `    interface MoodleClient extends GeneratedMoodleServices {}\n`;
    masterDts += `}\n`;

    await fs.mkdir(targetSchemasDir, { recursive: true });
    await fs.writeFile(path.join(targetSchemasDir, "index.d.ts"), masterDts, "utf-8");
    await fs.writeFile(path.join(targetSchemasDir, "index.d.mts"), masterDts, "utf-8");
    await fs.writeFile(path.join(targetSchemasDir, "index.js"), "export {};\n", "utf-8");
    await fs.writeFile(path.join(targetSchemasDir, "index.mjs"), "export {};\n", "utf-8");

    // Also update src/schemas if developing in moodle-client repo
    const srcSchemasDir = path.join(pkgDir, "src/schemas");
    if (existsSync(srcSchemasDir)) {
        try {
            await fs.writeFile(path.join(srcSchemasDir, "index.d.ts"), masterDts, "utf-8");
            await fs.writeFile(path.join(srcSchemasDir, "index.d.mts"), masterDts, "utf-8");
        } catch {
            // Ignore
        }
    }

    // Also write master barrel to outDir root if configured
    if (configDir) {
        const uniqueOutDirs = new Set<string>();
        for (const entry of configs) {
            if (entry.outDir) {
                uniqueOutDirs.add(path.resolve(configDir, entry.outDir));
            }
        }
        for (const outDirPath of uniqueOutDirs) {
            try {
                await fs.mkdir(outDirPath, { recursive: true });
                await fs.writeFile(path.join(outDirPath, "index.d.ts"), masterDts, "utf-8");
                await fs.writeFile(path.join(outDirPath, "index.ts"), masterDts, "utf-8");
            } catch {
                // Ignore
            }
        }
    }
}

/**
 * Executes the complete web service generation and storage pipeline for Moodle client.
 * Schemas are stored in dist/schemas/{namespace}/ and [outDir]/{namespace}/.
 */
export async function runGenerator(
    configPath?: string,
    options?: RunGeneratorOptions
): Promise<void> {
    const resolvedConfigPath = configPath
        ? path.resolve(configPath)
        : path.resolve(process.cwd(), "package.json");
    const configDir = path.dirname(resolvedConfigPath);

    const configs = await loadPackageConfig(configPath);
    const pkgDir = findMoodleClientPackageDir();
    const targetSchemasDir = path.join(pkgDir, "dist/schemas");

    const force = Boolean(options?.force);

    // Concurrency limit of 2 as specified
    const createLimit = typeof pLimit === "function" ? pLimit : (pLimit as any).default;
    const limit = createLimit(2);

    const processSingleSchema = async (entry: MoodleSchemaConfigEntry) => {
        const nsDistDir = path.join(targetSchemasDir, entry.namespace);
        const nsProjectOutDir = entry.outDir
            ? path.resolve(configDir, entry.outDir, entry.namespace)
            : undefined;

        // Check if outDir cache already exists and force is not set
        if (nsProjectOutDir && !force) {
            const existsWithSchemas = await hasExistingSchemas(nsProjectOutDir);
            if (existsWithSchemas) {
                logInfo(
                    `[moodle-client] Schemas already exist in '${entry.outDir}/${entry.namespace}'. Generation skipped.`,
                    options?.silent
                );
                await fs.rm(nsDistDir, { recursive: true, force: true });
                const count = await copyDir(nsProjectOutDir, nsDistDir);
                await fs.writeFile(path.join(nsDistDir, "index.js"), "export {};\n", "utf-8");
                await fs.writeFile(path.join(nsDistDir, "index.mjs"), "export {};\n", "utf-8");
                await stripDirectModuleAugmentation(nsDistDir);
                await ensureDtsMtsSync(nsDistDir);

                logInfo(
                    `[moodle-client] Synchronized ${count} schemas from '${entry.outDir}/${entry.namespace}' to '@didactika/moodle-client'.`,
                    options?.silent
                );
                return;
            }
        }

        // Full extraction & generation
        let targetMoodlePath: string | undefined;
        let shouldCleanup = false;

        if (entry.source.type === "local") {
            const rawPath = entry.source.path;
            targetMoodlePath = rawPath.startsWith("~/")
                ? path.join(os.homedir(), rawPath.slice(2))
                : path.resolve(configDir, rawPath);
        } else {
            const tempCloneDir = path.join(
                os.tmpdir(),
                `moodle-v${entry.source.version}-${entry.namespace}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
            );
            targetMoodlePath = await cloneMoodleVersion(entry.source.version, tempCloneDir);
            shouldCleanup = true;
        }

        try {
            const result = await extractWebservice({
                moodlePath: targetMoodlePath,
                services: entry.webservices,
                concurrency: entry.concurrency ?? 8,
            });

            if (result.errors && result.errors.length > 0) {
                for (const err of result.errors) {
                    console.error(
                        `[moodle-client] [${entry.namespace}] Extraction error: [${err.code}] ${
                            err.serviceName ? `(${err.serviceName}) ` : ""
                        }${err.message}`
                    );
                }
                if (result.schemas.length === 0 && result.errors[0]) {
                    throw mapExtractionErrorToGeneratorError(result.errors[0], targetMoodlePath);
                }
            }

            // 1. Generate files directly into package's dist/schemas/{namespace}
            await fs.mkdir(nsDistDir, { recursive: true });
            await generateWebserviceFiles(
                result.schemas as WebServiceSchema[],
                nsDistDir,
                { importSource: "@didactika/moodle-client" }
            );
            await fs.writeFile(path.join(nsDistDir, "index.js"), "export {};\n", "utf-8");
            await fs.writeFile(path.join(nsDistDir, "index.mjs"), "export {};\n", "utf-8");
            await stripDirectModuleAugmentation(nsDistDir);
            await ensureDtsMtsSync(nsDistDir);

            // 2. If outDir is specified, also generate files into outDir/{namespace}
            if (nsProjectOutDir) {
                await fs.mkdir(nsProjectOutDir, { recursive: true });
                await generateWebserviceFiles(
                    result.schemas as WebServiceSchema[],
                    nsProjectOutDir,
                    { importSource: "@didactika/moodle-client" }
                );
                await stripDirectModuleAugmentation(nsProjectOutDir);
                await ensureDtsMtsSync(nsProjectOutDir);
            }

            // 3. If developing in moodle-client repository, also update src/schemas/{namespace}
            const srcSchemasNsDir = path.join(pkgDir, "src/schemas", entry.namespace);
            const srcSchemasRootDir = path.join(pkgDir, "src/schemas");
            if (existsSync(srcSchemasRootDir)) {
                try {
                    await fs.mkdir(srcSchemasNsDir, { recursive: true });
                    await generateWebserviceFiles(
                        result.schemas as WebServiceSchema[],
                        srcSchemasNsDir,
                        { importSource: "@didactika/moodle-client" }
                    );
                    await stripDirectModuleAugmentation(srcSchemasNsDir);
                    await ensureDtsMtsSync(srcSchemasNsDir);
                } catch {
                    // Ignore dev directory copy error
                }
            }

            if (entry.outDir) {
                logInfo(
                    `[moodle-client] Successfully generated ${result.schemas.length} webservices for '${entry.namespace}' into '${entry.outDir}/${entry.namespace}' and '@didactika/moodle-client'.`,
                    options?.silent
                );
            } else {
                logInfo(
                    `[moodle-client] Successfully generated ${result.schemas.length} webservices for '${entry.namespace}' into '@didactika/moodle-client'.`,
                    options?.silent
                );
            }
        } finally {
            if (shouldCleanup && targetMoodlePath) {
                await cleanupMoodleDirectory(targetMoodlePath);
            }
        }
    };

    // Execute concurrently with p-limit(2)
    await Promise.all(configs.map((entry) => limit(() => processSingleSchema(entry))));

    // Generate aggregated master barrel
    await generateMasterBarrel(targetSchemasDir, configs, pkgDir, configDir);
    await ensurePackageDeclarationExports(pkgDir);

    logInfo(
        `[moodle-client] You can import types and clients directly: import { MoodleClient } from "@didactika/moodle-client";`,
        options?.silent
    );
}
