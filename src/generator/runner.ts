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
    MoodleGeneratorError,
} from "@didactika/moodle-client-schemas";
import {
    loadPackageConfig,
    MoodleSchemaConfigEntry,
} from "./config/config-manager";
import { cloneMoodleVersion, cleanupMoodleDirectory } from "./downloader/moodle-downloader";
import { cloneRepository } from "./downloader/git-repository-downloader";
import {
    isLocalSource,
    isRepositorySource,
    isOfficialSource,
} from "./interfaces/config.interfaces";
import {
    createGeneratorError,
    validateSchemaDeclarations,
    checkPhpEnvironment,
    verifyLocalMoodlePath,
} from "./utils/environment-validator";

export interface RunGeneratorOptions {
    silent?: boolean;
    force?: boolean;
    forceNamespaces?: string[];
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
 * Recursively checks if a directory contains at least one .webservice.d.ts file.
 */
async function containsWebserviceFilesRecursively(dir: string): Promise<boolean> {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                const found = await containsWebserviceFilesRecursively(fullPath);
                if (found) {
                    return true;
                }
            } else if (
                entry.name.endsWith(".webservice.d.ts") ||
                entry.name.endsWith(".webservice-client.d.ts")
            ) {
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
}

/**
 * Checks if a given directory exists and contains valid webservice schema files.
 * Requires both a non-empty index.d.ts and at least one .webservice.d.ts file in its tree.
 */
export async function hasExistingSchemas(dir: string): Promise<boolean> {
    try {
        const stat = await fs.stat(dir);
        if (!stat.isDirectory()) {
            return false;
        }

        // 1. Verify index.d.ts exists and is not empty (0 bytes)
        const indexPath = path.join(dir, "index.d.ts");
        try {
            const indexStat = await fs.stat(indexPath);
            if (indexStat.size === 0) {
                return false;
            }
        } catch {
            return false;
        }

        // 2. Recursively verify at least one .webservice.d.ts file exists
        return await containsWebserviceFilesRecursively(dir);
    } catch {
        return false;
    }
}

/**
 * Verifies that the specified output directory exists or can be created, and has write permissions.
 */
export async function verifyOutDirWritable(targetDir: string): Promise<void> {
    try {
        await fs.mkdir(targetDir, { recursive: true });
        await fs.access(targetDir, fs.constants.W_OK);
    } catch (err: unknown) {
        throw createGeneratorError({
            code: "ERR_OUTPUT_DIRECTORY_NOT_WRITABLE",
            title: "Output Directory Not Writable",
            details: `Cannot write to output directory '${targetDir}': Permission denied.`,
            action: `Grant write permissions to the directory (e.g. chmod u+w '${targetDir}') or specify a different output directory in your configuration.`,
            cause: err,
        });
    }
}

const GENERATED_SUFFIXES = [
    ".webservice.d.ts",
    ".webservice.ts",
    ".webservice-client.d.ts",
    ".webservice-client.ts",
];

const DECLARATION_BARREL_NAMES = new Set(["index.d.ts", "index.d.mts", "index.ts"]);
const RUNTIME_STUB_NAMES = new Set(["index.js", "index.mjs"]);
const SOURCE_MAP_NAMES = new Set(["index.js.map", "index.mjs.map"]);

/** Every barrel emitted by the schema generator or by generateMasterBarrel declares this interface. */
const BARREL_MARKER = "GeneratedMoodleServices";
const RUNTIME_STUB_CONTENT = "export {};";

/**
 * Returns true for generated per-service files (`*.webservice(.d).ts`, `*.webservice-client(.d).ts`).
 * Barrels (`index.*`) are NOT owned by name: use {@link isGeneratedBarrelFile}, which checks their content.
 */
export function isGeneratorOwnedFile(filename: string): boolean {
    return GENERATED_SUFFIXES.some((suffix) => filename.endsWith(suffix));
}

async function readTextFile(fullPath: string): Promise<string | null> {
    try {
        return await fs.readFile(fullPath, "utf-8");
    } catch {
        return null;
    }
}

/**
 * Checks whether a root-level `index.*` file was produced by the generator, based on its content.
 * User-written barrels with the same names are never considered generated.
 */
export async function isGeneratedBarrelFile(fullPath: string, filename: string): Promise<boolean> {
    const isDeclaration = DECLARATION_BARREL_NAMES.has(filename);
    const isRuntimeStub = RUNTIME_STUB_NAMES.has(filename);
    if (!isDeclaration && !isRuntimeStub) {
        return false;
    }
    const content = await readTextFile(fullPath);
    if (content === null) {
        return false;
    }
    return isDeclaration ? content.includes(BARREL_MARKER) : content.trim() === RUNTIME_STUB_CONTENT;
}

/**
 * Checks whether a file inside a namespace directory belongs to the generator.
 * Barrels and runtime stubs are only recognised at the namespace root.
 */
async function isGeneratorOwnedPath(fullPath: string, filename: string, isRoot: boolean): Promise<boolean> {
    if (isGeneratorOwnedFile(filename)) {
        return true;
    }
    if (!isRoot) {
        return false;
    }
    if (SOURCE_MAP_NAMES.has(filename)) {
        return true;
    }
    return isGeneratedBarrelFile(fullPath, filename);
}

/**
 * Removes a barrel only if its content proves it was generated.
 */
export async function removeGeneratedBarrel(filePath: string): Promise<void> {
    if (await isGeneratedBarrelFile(filePath, path.basename(filePath))) {
        await fs.rm(filePath, { force: true });
    }
}

async function isEmptyDirectory(dir: string): Promise<boolean> {
    try {
        return (await fs.readdir(dir)).length === 0;
    } catch {
        return false;
    }
}

/**
 * Recursively inspects a namespace directory and reports whether it contains anything
 * the generator did not create (user files, user barrels, user directories).
 */
export async function hasNonGeneratorFiles(dir: string, isRoot = true): Promise<boolean> {
    let entries: import("fs").Dirent[];
    try {
        entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
        return false;
    }
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (await hasNonGeneratorFiles(fullPath, false)) {
                return true;
            }
        } else if (!(await isGeneratorOwnedPath(fullPath, entry.name, isRoot))) {
            return true;
        }
    }
    return false;
}

/**
 * Selectively deletes generated webservice files and barrels from a namespace directory.
 * - `*.webservice(.d).ts` / `*.webservice-client(.d).ts` files are removed anywhere in the tree;
 * - `index.*` barrels and runtime stubs are removed only at the namespace root and only when generated;
 * - directories are pruned only when they became empty because generated files were removed,
 *   so user files and user directories (even empty ones) are never touched.
 *
 * @returns true if any generated file was removed inside dir.
 */
export async function selectiveCleanNamespace(dir: string, isRoot = true): Promise<boolean> {
    let entries: import("fs").Dirent[];
    try {
        entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
        return false;
    }
    let removedAny = false;
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const removedInside = await selectiveCleanNamespace(fullPath, false);
            if (removedInside && (await isEmptyDirectory(fullPath))) {
                await fs.rmdir(fullPath);
            }
            removedAny = removedAny || removedInside;
        } else if (entry.isFile() && (await isGeneratorOwnedPath(fullPath, entry.name, isRoot))) {
            await fs.unlink(fullPath);
            removedAny = true;
        }
    }
    return removedAny;
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
        } else if (entry.name.endsWith(".d.ts")) {
            const content = await fs.readFile(srcPath, "utf-8");
            await fs.writeFile(destPath, content, "utf-8");
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
export async function ensurePackageDeclarationExports(pkgDir: string): Promise<void> {
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
 *
 * Fresh generation never emits it (augmentClient: false); this only cleans
 * outDir caches written by pre-release moodle-client-schemas builds, which always did.
 */
async function stripDirectModuleAugmentation(dir: string): Promise<void> {
    for (const filename of ["index.d.ts", "index.d.mts"]) {
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
 * Generates the master barrel dist/schemas/index.d.ts that aggregates all schema namespaces,
 * and mirrors it to each configured outDir root unless a hand-written index.d.ts already lives there.
 *
 * @returns Paths of outDir barrels that were left untouched because they are not generated.
 */
export async function generateMasterBarrel(
    targetSchemasDir: string,
    configs: MoodleSchemaConfigEntry[],
    pkgDir: string,
    configDir?: string
): Promise<string[]> {
    const skippedBarrels: string[] = [];
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

    masterDts += `\n// Namespace type barrels\n`;
    for (const entry of configs) {
        masterDts += `export type * as ${entry.namespace} from "./${entry.namespace}/index";\n`;
    }

    masterDts += `\nexport interface GeneratedMoodleServices {\n`;
    for (const entry of configs) {
        const typeName = `${toPascalCase(entry.namespace)}GeneratedServices`;
        let sourceDesc = "";
        if (isLocalSource(entry.source)) {
            sourceDesc = `local (${entry.source.path})`;
        } else if (isRepositorySource(entry.source)) {
            sourceDesc = `repository (${entry.source.url}#${entry.source.branch || "main"})`;
        } else if (isOfficialSource(entry.source)) {
            sourceDesc = `moodle (v${entry.source.version})`;
        } else {
            sourceDesc = "unknown";
        }
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
                const rootBarrel = path.join(outDirPath, "index.d.ts");
                if (existsSync(rootBarrel) && !(await isGeneratedBarrelFile(rootBarrel, "index.d.ts"))) {
                    // A hand-written index.d.ts is never overwritten.
                    skippedBarrels.push(rootBarrel);
                } else {
                    await fs.writeFile(rootBarrel, masterDts, "utf-8");
                }
                await removeGeneratedBarrel(path.join(outDirPath, "index.d.mts"));
                await removeGeneratedBarrel(path.join(outDirPath, "index.ts"));
            } catch {
                // Ignore
            }
        }
    }
    return skippedBarrels;
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
    const createLimit = typeof pLimit === "function" ? pLimit : (pLimit as unknown as { default: typeof pLimit }).default;
    const limit = createLimit(2);

    // Prune orphaned/unmanaged schema namespaces from dist/schemas
    try {
        if (existsSync(targetSchemasDir)) {
            const configuredNamespaces = new Set(configs.map((c) => c.namespace));
            const distEntries = await fs.readdir(targetSchemasDir, { withFileTypes: true });
            for (const entry of distEntries) {
                if (entry.isDirectory() && !configuredNamespaces.has(entry.name)) {
                    const srcSchemaDir = path.join(pkgDir, "src/schemas", entry.name);
                    if (!existsSync(srcSchemaDir)) {
                        await fs.rm(path.join(targetSchemasDir, entry.name), { recursive: true, force: true });
                        logInfo(
                            `[moodle-client] Cleaned orphaned schema namespace '${entry.name}' from '@didactika/moodle-client'.`,
                            options?.silent
                        );
                    }
                }
            }
        }
    } catch {
        // Ignore dist prune error
    }

    // Check for unmanaged directories in outDir and inform user
    if (configDir) {
        const configuredNamespaces = new Set(configs.map((c) => c.namespace));
        const uniqueOutDirs = new Set<string>();
        for (const entry of configs) {
            if (entry.outDir) {
                uniqueOutDirs.add(path.resolve(configDir, entry.outDir));
            }
        }
        for (const outDirPath of uniqueOutDirs) {
            try {
                const entries = await fs.readdir(outDirPath, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isDirectory() && !configuredNamespaces.has(entry.name)) {
                        logInfo(
                            `[moodle-client] Info: Directory '${entry.name}' in '${outDirPath}' is not a configured schema namespace. Preserving untouched.`,
                            options?.silent
                        );
                    }
                }
            } catch {
                // Ignore if outDir doesn't exist yet
            }
        }
    }

    // Verify that configured outDir paths exist or are writable
    if (configDir) {
        for (const entry of configs) {
            if (entry.outDir) {
                const outDirPath = path.resolve(configDir, entry.outDir);
                await verifyOutDirWritable(outDirPath);
            }
        }
    }

    const processSingleSchema = async (entry: MoodleSchemaConfigEntry) => {
        const nsDistDir = path.join(targetSchemasDir, entry.namespace);
        const nsProjectOutDir = entry.outDir
            ? path.resolve(configDir, entry.outDir, entry.namespace)
            : undefined;
        const isForced = force || Boolean(options?.forceNamespaces?.includes(entry.namespace));

        // Check if outDir cache already exists and force is not set
        if (nsProjectOutDir && !isForced) {
            await validateSchemaDeclarations(nsProjectOutDir, entry.namespace);
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

        // Check if internal package schemas already exist and force is not set (no outDir mode)
        if (!nsProjectOutDir && !isForced) {
            const existsInDist = await hasExistingSchemas(nsDistDir);
            const srcSchemasNsDir = path.join(pkgDir, "src/schemas", entry.namespace);
            const existsInSrc = await hasExistingSchemas(srcSchemasNsDir);

            if (existsInDist || existsInSrc) {
                if (!existsInDist && existsInSrc) {
                    await fs.mkdir(nsDistDir, { recursive: true });
                    await copyDir(srcSchemasNsDir, nsDistDir);
                    await fs.writeFile(path.join(nsDistDir, "index.js"), "export {};\n", "utf-8");
                    await fs.writeFile(path.join(nsDistDir, "index.mjs"), "export {};\n", "utf-8");
                    await ensureDtsMtsSync(nsDistDir);
                }
                logInfo(
                    `[moodle-client] Schemas already exist in '@didactika/moodle-client' for namespace '${entry.namespace}'. Generation skipped.`,
                    options?.silent
                );
                return;
            }
        }

        // Clean stale webservices in dist and outDir
        await fs.rm(nsDistDir, { recursive: true, force: true });
        if (nsProjectOutDir) {
            await fs.mkdir(nsProjectOutDir, { recursive: true });
            await selectiveCleanNamespace(nsProjectOutDir);
        }

        // Full extraction & generation
        let targetMoodlePath: string | undefined;
        let shouldCleanup = false;

        if (isLocalSource(entry.source)) {
            const rawPath = entry.source.path;
            targetMoodlePath = rawPath.startsWith("~/")
                ? path.join(os.homedir(), rawPath.slice(2))
                : path.resolve(configDir, rawPath);
            shouldCleanup = false;
            await verifyLocalMoodlePath(targetMoodlePath, entry.namespace);
        } else if (isRepositorySource(entry.source)) {
            const repoSource = entry.source;
            const tempCloneDir = path.join(
                os.tmpdir(),
                `moodle-repo-${entry.namespace}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
            );
            logInfo(
                `[moodle-client] [${entry.namespace}] Cloning repository from '${repoSource.url}' (branch: ${repoSource.branch || "main"})...`,
                options?.silent
            );
            targetMoodlePath = await cloneRepository({
                repoUrl: repoSource.url,
                targetPath: tempCloneDir,
                branch: repoSource.branch || "main",
                silent: options?.silent,
            });
            shouldCleanup = true;
        } else if (isOfficialSource(entry.source)) {
            const version = entry.source.version;
            const tempCloneDir = path.join(
                os.tmpdir(),
                `moodle-v${version}-${entry.namespace}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
            );
            targetMoodlePath = await cloneMoodleVersion(version, tempCloneDir);
            shouldCleanup = true;
        } else {
            throw new MoodleGeneratorError({
                code: "ERR_CONFIG_INVALID_JSON",
                title: "Invalid Source Type",
                details: `Configuration '${entry.namespace}' has unknown source type.`,
                action: "Set 'source.type' to 'moodle-official', 'local', or 'repository'.",
            });
        }

        try {
            await checkPhpEnvironment();
            const result = await extractWebservice({
                moodlePath: targetMoodlePath,
                services: entry.webservices,
                concurrency: entry.concurrency ?? 8,
            });

            if (result.errors && result.errors.length > 0) {
                if (!options?.silent) {
                    for (const err of result.errors) {
                        console.error(
                            `[moodle-client] [${entry.namespace}] Extraction error: [${err.code}] ${
                                err.serviceName ? `(${err.serviceName}) ` : ""
                            }${err.message}`
                        );
                    }
                }
                if (result.schemas.length === 0 && result.errors[0]) {
                    const firstErr = result.errors[0];
                    if (targetMoodlePath && firstErr.code === "INVALID_MOODLE_PATH") {
                        try {
                            await fs.access(targetMoodlePath, fs.constants.R_OK | (fs.constants.X_OK ?? 0));
                            await fs.readdir(targetMoodlePath);
                            const versionFile = path.join(targetMoodlePath, "version.php");
                            await fs.access(versionFile, fs.constants.R_OK);
                        } catch (permErr: unknown) {
                            const pErr = permErr as NodeJS.ErrnoException;
                            if (pErr.code === "EACCES" || pErr.code === "EPERM") {
                                throw createGeneratorError({
                                    code: "ERR_MOODLE_PATH_PERMISSION_DENIED",
                                    title: "Moodle Path Permission Denied",
                                    details: `Permission denied when accessing Moodle codebase at '${targetMoodlePath}'. The directory cannot be read.`,
                                    action: `Grant read and execute permissions to the directory (e.g., chmod u+rx '${targetMoodlePath}') and try again.`,
                                    cause: permErr,
                                });
                            }
                        }
                    }
                    throw mapExtractionErrorToGeneratorError(firstErr, targetMoodlePath);
                }
            }

            // 1. Generate files directly into package's dist/schemas/{namespace}
            await fs.mkdir(nsDistDir, { recursive: true });
            await generateWebserviceFiles(
                result.schemas as WebServiceSchema[],
                nsDistDir,
                { importSource: "@didactika/moodle-client", augmentClient: false }
            );
            await fs.writeFile(path.join(nsDistDir, "index.js"), "export {};\n", "utf-8");
            await fs.writeFile(path.join(nsDistDir, "index.mjs"), "export {};\n", "utf-8");
            await ensureDtsMtsSync(nsDistDir);

            // 2. If outDir is specified, also generate files into outDir/{namespace}
            if (nsProjectOutDir) {
                await fs.mkdir(nsProjectOutDir, { recursive: true });
                await generateWebserviceFiles(
                    result.schemas as WebServiceSchema[],
                    nsProjectOutDir,
                    { importSource: "@didactika/moodle-client", augmentClient: false }
                );
                await removeGeneratedBarrel(path.join(nsProjectOutDir, "index.d.mts"));
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
                        { importSource: "@didactika/moodle-client", augmentClient: false }
                    );
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
    const skippedBarrels = await generateMasterBarrel(targetSchemasDir, configs, pkgDir, configDir);
    for (const barrel of skippedBarrels) {
        logInfo(
            `[moodle-client] Info: '${barrel}' is not a generated barrel. Preserving it untouched; re-export the namespaces manually if needed.`,
            options?.silent
        );
    }
    await ensurePackageDeclarationExports(pkgDir);

    logInfo(
        `[moodle-client] You can import types and clients directly: import { MoodleClient } from "@didactika/moodle-client";`,
        options?.silent
    );
}
