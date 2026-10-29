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
    loadPackageConfigDetailed,
    describeInvalidNamespace,
    reservedNamespaceError,
    InvalidConfigEntry,
    MoodleSchemaConfigEntry,
} from "./config/config-manager";
import { cloneMoodleVersion, cleanupMoodleDirectory } from "./downloader/moodle-downloader";
import { cloneRepository } from "./downloader/git-repository-downloader";
import {
    isLocalSource,
    isRepositorySource,
    isOfficialSource,
    BUNDLED_NAMESPACE,
    BUNDLED_MOODLE_VERSION,
    MoodleSourceConfig,
} from "./interfaces/config.interfaces";
import { localPathRequiredError } from "./config/local-path";
import {
    createGeneratorError,
    validateSchemaDeclarations,
    checkPhpEnvironment,
    verifyLocalMoodlePath,
} from "./utils/environment-validator";

/** Isolated PHP processes used to retry services after the extraction batch crashes or stalls. */
const EXTRACTION_CONCURRENCY = 8;

/**
 * A namespace left out of a targeted run because its configuration is invalid.
 */
export interface SkippedNamespace {
    namespace?: string;
    /** Why the entry is invalid (the details of its configuration error) */
    reason: string;
}

export interface RunGeneratorResult {
    /** Invalid entries that were not processed; their existing schemas were left untouched */
    skipped: SkippedNamespace[];
}

export interface RunGeneratorOptions {
    silent?: boolean;
    force?: boolean;
    forceNamespaces?: string[];
    /**
     * Source to generate each namespace from, overriding package.json. This is how a local source
     * gets the path given for this run, since that path is never saved.
     */
    sources?: Record<string, MoodleSourceConfig>;
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
function isGeneratorOwnedFile(filename: string): boolean {
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

/** JSDoc source line of the bundled namespace, shared with scripts/bundle-schemas.ts. */
export function bundledSourceDescription(): string {
    return `bundled with @didactika/moodle-client (Moodle ${BUNDLED_MOODLE_VERSION})`;
}

export interface BarrelNamespace {
    namespace: string;
    /** Shown in the JSDoc of the namespace property */
    source: string;
}

/**
 * JSDoc source line of a namespace in a barrel. outDir barrels are committed, so a local path
 * never appears: it is different on every machine.
 */
function describeSource(entry: MoodleSchemaConfigEntry): string {
    if (isLocalSource(entry.source)) {
        return "local";
    }
    if (isRepositorySource(entry.source)) {
        return `repository (${entry.source.url}#${entry.source.branch || "main"})`;
    }
    if (isOfficialSource(entry.source)) {
        return `moodle (v${entry.source.version})`;
    }
    return "unknown";
}

/**
 * Builds the source of a master barrel exposing the given namespaces on MoodleClient.
 */
export function buildMasterBarrel(namespaces: BarrelNamespace[]): string {
    const typeName = (ns: string) => `${toPascalCase(ns)}GeneratedServices`;
    let dts = `/**\n * Master barrel for generated Moodle services namespaces.\n */\n`;
    for (const { namespace } of namespaces) {
        dts += `import type { GeneratedMoodleServices as ${typeName(namespace)} } from "./${namespace}/index";\n`;
    }
    dts += `\nexport type {\n`;
    for (const { namespace } of namespaces) {
        dts += `    ${typeName(namespace)},\n`;
    }
    dts += `};\n`;
    dts += `\n// Namespace type barrels\n`;
    for (const { namespace } of namespaces) {
        dts += `export type * as ${namespace} from "./${namespace}/index";\n`;
    }
    dts += `\nexport interface GeneratedMoodleServices {\n`;
    for (const { namespace, source } of namespaces) {
        dts += `    /**\n     * Moodle web services namespace '${namespace}'.\n     * Source: ${source}\n     */\n`;
        dts += `    ${namespace}: ${typeName(namespace)};\n`;
    }
    dts += `}\n\n`;
    dts += `declare module "@didactika/moodle-client" {\n`;
    dts += `    interface MoodleClient extends GeneratedMoodleServices {}\n`;
    dts += `}\n`;
    return dts;
}

/**
 * Generates the master barrel dist/schemas/index.d.ts: the bundled namespace (when its schemas are
 * installed) plus every configured one. Each configured outDir gets a barrel with only the namespaces
 * that live in it, unless a hand-written index.d.ts already lives there.
 *
 * @returns Paths of outDir barrels that were left untouched because they are not generated.
 */
export async function generateMasterBarrel(
    targetSchemasDir: string,
    configs: MoodleSchemaConfigEntry[],
    _pkgDir: string,
    configDir?: string
): Promise<string[]> {
    const skippedBarrels: string[] = [];
    const userEntries = configs.filter((entry) => entry.namespace !== BUNDLED_NAMESPACE);
    const bundled: BarrelNamespace[] = (await hasExistingSchemas(path.join(targetSchemasDir, BUNDLED_NAMESPACE)))
        ? [{ namespace: BUNDLED_NAMESPACE, source: bundledSourceDescription() }]
        : [];
    const toBarrel = (entry: MoodleSchemaConfigEntry): BarrelNamespace => ({ namespace: entry.namespace, source: describeSource(entry) });

    const masterDts = buildMasterBarrel([...bundled, ...userEntries.map(toBarrel)]);
    await fs.mkdir(targetSchemasDir, { recursive: true });
    await fs.writeFile(path.join(targetSchemasDir, "index.d.ts"), masterDts, "utf-8");
    await fs.writeFile(path.join(targetSchemasDir, "index.d.mts"), masterDts, "utf-8");
    await fs.writeFile(path.join(targetSchemasDir, "index.js"), "export {};\n", "utf-8");
    await fs.writeFile(path.join(targetSchemasDir, "index.mjs"), "export {};\n", "utf-8");

    if (!configDir) {
        return skippedBarrels;
    }
    const byOutDir = new Map<string, MoodleSchemaConfigEntry[]>();
    for (const entry of userEntries) {
        if (entry.outDir) {
            const outDirPath = path.resolve(configDir, entry.outDir);
            byOutDir.set(outDirPath, [...(byOutDir.get(outDirPath) ?? []), entry]);
        }
    }
    for (const [outDirPath, entries] of byOutDir) {
        try {
            await fs.mkdir(outDirPath, { recursive: true });
            const rootBarrel = path.join(outDirPath, "index.d.ts");
            if (existsSync(rootBarrel) && !(await isGeneratedBarrelFile(rootBarrel, "index.d.ts"))) {
                // A hand-written index.d.ts is never overwritten.
                skippedBarrels.push(rootBarrel);
            } else {
                await fs.writeFile(rootBarrel, buildMasterBarrel(entries.map(toBarrel)), "utf-8");
            }
            await removeGeneratedBarrel(path.join(outDirPath, "index.d.mts"));
            await removeGeneratedBarrel(path.join(outDirPath, "index.ts"));
        } catch {
            // Ignore
        }
    }
    return skippedBarrels;
}

/**
 * Executes the complete web service generation and storage pipeline for Moodle client.
 * Schemas are stored in dist/schemas/{namespace}/ and [outDir]/{namespace}/.
 */
/**
 * Fails when a namespace requested for regeneration (e.g. with --namespace) is not configured.
 */
function assertNamespacesConfigured(requested: string[] | undefined, configs: MoodleSchemaConfigEntry[]): void {
    if (requested?.includes(BUNDLED_NAMESPACE)) {
        throw reservedNamespaceError();
    }
    const configured = new Set(configs.map((c) => c.namespace));
    const missing = (requested ?? []).filter((ns) => !configured.has(ns));
    if (missing.length > 0) {
        const known = configs.map((c) => `'${c.namespace}'`).join(", ") || "none";
        throw createGeneratorError({
            code: "ERR_NAMESPACE_NOT_FOUND",
            title: "Namespace Not Found",
            details: `Namespace${missing.length > 1 ? "s" : ""} ${missing.map((ns) => `'${ns}'`).join(", ")} ${missing.length > 1 ? "are" : "is"} not configured in 'moodle-client'. Configured namespaces: ${known}.`,
            action: "Check the value of '--namespace'.",
        });
    }
}

/**
 * Loads the configurations for a run. A full run fails on any invalid entry. A targeted run
 * (`forceNamespaces`, used by --namespace, update --sync and create) only needs the targeted
 * namespaces to be valid: the other invalid entries are returned as skipped, so one broken entry
 * does not block work on another namespace. An entry using the bundled namespace always fails.
 */
async function loadConfigsForRun(
    configPath: string | undefined,
    targeted: string[] | undefined
): Promise<{ configs: MoodleSchemaConfigEntry[]; skipped: InvalidConfigEntry[] }> {
    if (!targeted || targeted.length === 0) {
        return { configs: await loadPackageConfig(configPath), skipped: [] };
    }
    const { configs, invalid } = await loadPackageConfigDetailed(configPath);
    // An entry claiming the bundled namespace is never skipped: it must be removed from package.json
    const blocking = invalid.find(
        (entry) =>
            (entry.error.code as string) === "ERR_CONFIG_RESERVED_NAMESPACE" ||
            (entry.namespace !== undefined && targeted.includes(entry.namespace))
    );
    if (blocking) {
        throw blocking.error;
    }
    return { configs, skipped: invalid };
}

/**
 * The entries of a run, each with the source given for this run when there is one.
 */
async function loadRunConfigs(
    configPath: string | undefined,
    options: RunGeneratorOptions | undefined
): Promise<{ configs: MoodleSchemaConfigEntry[]; skipped: InvalidConfigEntry[] }> {
    const loaded = await loadConfigsForRun(configPath, options?.forceNamespaces);
    const configs = loaded.configs.map((entry) => {
        const source = options?.sources?.[entry.namespace];
        return source ? { ...entry, source } : entry;
    });
    assertNamespacesConfigured(options?.forceNamespaces, configs);
    return { configs, skipped: loaded.skipped };
}

/**
 * Whether a run regenerates the entry from its Moodle source, rather than synchronizing schemas
 * that already exist in its outDir or in the package.
 */
async function needsExtraction(
    entry: MoodleSchemaConfigEntry,
    configDir: string,
    pkgDir: string,
    options: RunGeneratorOptions | undefined
): Promise<boolean> {
    if (options?.force || options?.forceNamespaces?.includes(entry.namespace)) {
        return true;
    }
    if (entry.outDir) {
        return !(await hasExistingSchemas(path.resolve(configDir, entry.outDir, entry.namespace)));
    }
    const inDist = await hasExistingSchemas(path.join(pkgDir, "dist/schemas", entry.namespace));
    return !inDist && !(await hasExistingSchemas(path.join(pkgDir, "src/schemas", entry.namespace)));
}

/**
 * The entries a run with these options will regenerate from their Moodle source. The CLIs use it to
 * ask for the paths of local sources before the run starts.
 */
export async function planExtraction(configPath?: string, options?: RunGeneratorOptions): Promise<MoodleSchemaConfigEntry[]> {
    const resolvedConfigPath = configPath ? path.resolve(configPath) : path.resolve(process.cwd(), "package.json");
    const configDir = path.dirname(resolvedConfigPath);
    const { configs } = await loadRunConfigs(configPath, options);
    const pkgDir = findMoodleClientPackageDir();
    const planned: MoodleSchemaConfigEntry[] = [];
    for (const entry of configs) {
        if (await needsExtraction(entry, configDir, pkgDir, options)) {
            planned.push(entry);
        }
    }
    return planned;
}

/**
 * Skipped entries whose schemas are still installed in the package stay in the master barrel,
 * so their types do not disappear from MoodleClient while their configuration is being fixed.
 */
async function keptSkippedEntries(skipped: InvalidConfigEntry[], targetSchemasDir: string): Promise<MoodleSchemaConfigEntry[]> {
    const kept: MoodleSchemaConfigEntry[] = [];
    for (const entry of skipped) {
        if (entry.namespace && !describeInvalidNamespace(entry.namespace) && (await hasExistingSchemas(path.join(targetSchemasDir, entry.namespace)))) {
            kept.push(entry.raw as MoodleSchemaConfigEntry);
        }
    }
    return kept;
}

export async function runGenerator(
    configPath?: string,
    options?: RunGeneratorOptions
): Promise<RunGeneratorResult> {
    const resolvedConfigPath = configPath
        ? path.resolve(configPath)
        : path.resolve(process.cwd(), "package.json");
    const configDir = path.dirname(resolvedConfigPath);

    const { configs, skipped } = await loadRunConfigs(configPath, options);
    const skippedNamespaces = skipped.flatMap((entry) => (entry.namespace ? [entry.namespace] : []));
    const pkgDir = findMoodleClientPackageDir();
    const targetSchemasDir = path.join(pkgDir, "dist/schemas");

    const force = Boolean(options?.force);

    // Concurrency limit of 2 as specified
    const createLimit = typeof pLimit === "function" ? pLimit : (pLimit as unknown as { default: typeof pLimit }).default;
    const limit = createLimit(2);

    // Prune orphaned/unmanaged schema namespaces from dist/schemas
    try {
        if (existsSync(targetSchemasDir)) {
            const configuredNamespaces = new Set([...configs.map((c) => c.namespace), ...skippedNamespaces]);
            const distEntries = await fs.readdir(targetSchemasDir, { withFileTypes: true });
            for (const entry of distEntries) {
                // The bundled namespace is part of the package: never pruned
                if (entry.isDirectory() && entry.name !== BUNDLED_NAMESPACE && !configuredNamespaces.has(entry.name)) {
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
        const configuredNamespaces = new Set([...configs.map((c) => c.namespace), ...skippedNamespaces]);
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
            if (!rawPath) {
                // The path of a local source is never saved: the CLI resolves it before the run.
                throw localPathRequiredError(entry.namespace);
            }
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
                action: "Set 'source.type' to 'moodle-official', 'moodle-repository' or 'moodle-local'.",
            });
        }

        try {
            await checkPhpEnvironment();
            const result = await extractWebservice({
                moodlePath: targetMoodlePath,
                services: entry.webservices,
                concurrency: EXTRACTION_CONCURRENCY,
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
    const barrelConfigs = [...configs, ...(await keptSkippedEntries(skipped, targetSchemasDir))];
    const skippedBarrels = await generateMasterBarrel(targetSchemasDir, barrelConfigs, pkgDir, configDir);
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

    return {
        skipped: skipped.map((entry) => ({ namespace: entry.namespace, reason: entry.error.details ?? entry.error.message })),
    };
}
