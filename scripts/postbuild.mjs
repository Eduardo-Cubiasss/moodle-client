import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function copySchemasDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copySchemasDir(srcPath, destPath);
        } else if (entry.name.endsWith(".d.ts") || entry.name.endsWith(".d.mts")) {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

/**
 * Writes dist/schemas/index.d.ts (and .d.mts) with the barrel of the bundled namespace, built by
 * the same function the CLI uses on every generation.
 *
 * tsup's declaration bundling turns this file into a bare re-export
 * (`export { G as GeneratedMoodleServices } from '../index-<hash>.js'`): GeneratedMoodleServices is
 * then not declared in the file, so a `declare module` block appended to it fails with TS2304 in
 * every project that type-checks its dependencies (skipLibCheck: false).
 */
async function writeSchemasBarrel(distSchemasDir) {
    const { buildMasterBarrel, bundledSourceDescription, BUNDLED_NAMESPACE } = await import(
        pathToFileURL(path.resolve(rootDir, "dist/generator/barrel.mjs")).href
    );
    const barrel = buildMasterBarrel([{ namespace: BUNDLED_NAMESPACE, source: bundledSourceDescription() }]);
    for (const file of ["index.d.ts", "index.d.mts"]) {
        await fs.writeFile(path.join(distSchemasDir, file), barrel, "utf-8");
    }
}

async function main() {
    const srcSchemasDir = path.resolve(rootDir, "src/schemas");
    const distSchemasDir = path.resolve(rootDir, "dist/schemas");

    if (existsSync(srcSchemasDir)) {
        await copySchemasDir(srcSchemasDir, distSchemasDir);
        await fs.writeFile(path.join(distSchemasDir, "index.js"), "export {};\n", "utf-8");
        await fs.writeFile(path.join(distSchemasDir, "index.mjs"), "export {};\n", "utf-8");
    }

    const dtsFiles = [
        path.resolve(rootDir, "dist/index.d.ts"),
        path.resolve(rootDir, "dist/index.d.mts"),
    ];
    for (const dtsFile of dtsFiles) {
        if (existsSync(dtsFile)) {
            try {
                const content = await fs.readFile(dtsFile, "utf-8");
                if (!content.includes('from "./schemas/index"') && !content.includes("from './schemas/index'")) {
                    await fs.appendFile(dtsFile, '\nexport * from "./schemas/index";\n', "utf-8");
                }
            } catch {
                // Ignore
            }
        }
    }

    await writeSchemasBarrel(distSchemasDir);
    console.log("[postbuild] Schemas copied to dist/schemas successfully.");
}

main().catch((err) => {
    console.error("[postbuild] Error copying schemas:", err);
    process.exit(1);
});
