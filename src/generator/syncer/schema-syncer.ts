import fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";

/**
 * Finds the root directory of the installed or linked @didactika/moodle-client package.
 *
 * @param {string} baseDir - Directory to start search from (usually where config is located)
 * @returns {string | null} Package directory or null if not found
 */
export function findPackageDir(baseDir: string): string | null {
    // 1. Check direct node_modules in baseDir
    const directBaseCand = path.resolve(baseDir, "node_modules/@didactika/moodle-client");
    if (existsSync(path.join(directBaseCand, "package.json"))) {
        return directBaseCand;
    }

    // 2. Try require.resolve starting specifically from baseDir
    try {
        const pkgJsonPath = require.resolve("@didactika/moodle-client/package.json", {
            paths: [baseDir],
        });
        return path.dirname(pkgJsonPath);
    } catch {
        // Ignored, proceed to next strategy
    }

    // 3. Check direct node_modules in process.cwd()
    const directCwdCand = path.resolve(process.cwd(), "node_modules/@didactika/moodle-client");
    if (existsSync(path.join(directCwdCand, "package.json"))) {
        return directCwdCand;
    }

    // 4. Ascend upwards from baseDir or cwd to check if we are inside @didactika/moodle-client itself
    const startDirs = [baseDir, process.cwd()];
    for (const start of startDirs) {
        let current = path.resolve(start);
        while (current !== path.dirname(current)) {
            const candidatePkg = path.join(current, "package.json");
            if (existsSync(candidatePkg)) {
                try {
                    const content = JSON.parse(readFileSync(candidatePkg, "utf-8"));
                    if (content.name === "@didactika/moodle-client") {
                        return current;
                    }
                } catch {
                    // Ignore JSON parse error
                }
            }
            current = path.dirname(current);
        }
    }

    return null;
}

/**
 * Resolves the primary internal schemas directory inside @didactika/moodle-client.
 *
 * @param {string} baseDir - Context directory (where config is located)
 * @returns {string} Target directory path for schemas
 */
export function resolveInternalPackageSchemasDir(baseDir: string): string {
    const pkgDir = findPackageDir(baseDir);
    if (pkgDir) {
        const distSchemas = path.join(pkgDir, "dist/schemas");
        const srcSchemas = path.join(pkgDir, "src/schemas");
        if (existsSync(path.join(pkgDir, "dist"))) {
            return distSchemas;
        }
        if (existsSync(path.join(pkgDir, "src"))) {
            return srcSchemas;
        }
        return distSchemas;
    }
    return path.resolve(baseDir, "node_modules/@didactika/moodle-client/dist/schemas");
}

/**
 * Checks if a given directory exists and contains webservice schema files.
 *
 * @param {string} dir - Directory to check
 * @returns {Promise<boolean>} True if directory exists and has schemas
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
        return entries.some((e) => e.endsWith(".webservice-client.ts") || e.endsWith(".webservice-client.d.ts"));
    } catch {
        return false;
    }
}

/**
 * Recursively copies all .ts files from src to dest, optionally writing .d.ts alongside them.
 *
 * @param {string} src - Source folder
 * @param {string} dest - Destination folder
 * @param {boolean} emitDts - Whether to emit .d.ts files alongside .ts files
 * @returns {Promise<number>} Number of schema files copied
 */
async function copyDir(src: string, dest: string, emitDts: boolean): Promise<number> {
    await fs.mkdir(dest, { recursive: true });
    let count = 0;
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            count += await copyDir(srcPath, destPath, emitDts);
        } else if (entry.name.endsWith(".d.ts") || entry.name.endsWith(".ts")) {
            const content = await fs.readFile(srcPath, "utf-8");
            await fs.writeFile(destPath, content, "utf-8");

            if (entry.name.endsWith(".d.ts")) {
                const tsPath = destPath.replace(/\.d\.ts$/, ".ts");
                await fs.writeFile(tsPath, content, "utf-8");
            } else if (entry.name.endsWith(".ts") && emitDts) {
                const dtsPath = destPath.replace(/\.ts$/, ".d.ts");
                await fs.writeFile(dtsPath, content, "utf-8");
            }
            count++;
        }
    }
    return count;
}

/**
 * Synchronizes schemas from source directory (e.g. outDir) into the internal
 * @didactika/moodle-client package directories (dist/schemas and src/schemas if present).
 * Also ensures dist/index.d.ts re-exports from ./schemas/index.
 *
 * @param {string} sourceDir - Source directory containing generated schema files
 * @param {string} baseDir - Directory where config file is located
 * @returns {Promise<{ syncedCount: number; targets: string[] }>}
 */
export async function syncSchemas(
    sourceDir: string,
    baseDir: string
): Promise<{ syncedCount: number; targets: string[] }> {
    const pkgDir = findPackageDir(baseDir);
    const resolvedSource = path.resolve(sourceDir);
    const targets: string[] = [];

    let syncedCount = 0;
    if (pkgDir) {
        const distSchemas = path.join(pkgDir, "dist/schemas");
        if (path.resolve(distSchemas) !== resolvedSource) {
            targets.push(distSchemas);
            syncedCount = await copyDir(resolvedSource, distSchemas, true);
        }

        const srcSchemas = path.join(pkgDir, "src/schemas");
        if (existsSync(path.join(pkgDir, "src")) && path.resolve(srcSchemas) !== resolvedSource) {
            targets.push(srcSchemas);
            await copyDir(resolvedSource, srcSchemas, false);
        }
    } else {
        const fallbackTarget = path.resolve(baseDir, "node_modules/@didactika/moodle-client/dist/schemas");
        if (path.resolve(fallbackTarget) !== resolvedSource) {
            targets.push(fallbackTarget);
            syncedCount = await copyDir(resolvedSource, fallbackTarget, true);
        }
    }

    // Ensure declaration files in package export ./schemas/index
    if (pkgDir) {
        const dtsFiles = [
            path.join(pkgDir, "dist/index.d.ts"),
            path.join(pkgDir, "dist/index.d.mts"),
        ];
        for (const dtsFile of dtsFiles) {
            if (existsSync(dtsFile)) {
                try {
                    const content = await fs.readFile(dtsFile, "utf-8");
                    if (!content.includes('export * from "./schemas/index"')) {
                        await fs.appendFile(dtsFile, '\nexport * from "./schemas/index";\n', "utf-8");
                    }
                } catch {
                    // Ignore read/append error
                }
            }
        }
    }

    return { syncedCount, targets };
}
