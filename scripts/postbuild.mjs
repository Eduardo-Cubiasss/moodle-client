import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

    const schemaDtsFiles = [
        path.resolve(distSchemasDir, "index.d.ts"),
        path.resolve(distSchemasDir, "index.d.mts"),
    ];
    for (const dtsFile of schemaDtsFiles) {
        if (existsSync(dtsFile)) {
            try {
                const content = await fs.readFile(dtsFile, "utf-8");
                if (!content.includes('declare module "@didactika/moodle-client"')) {
                    await fs.appendFile(
                        dtsFile,
                        '\ndeclare module "@didactika/moodle-client" {\n    interface MoodleClient extends GeneratedMoodleServices {}\n}\n',
                        "utf-8"
                    );
                }
            } catch {
                // Ignore
            }
        }
    }
    console.log("[postbuild] Schemas copied to dist/schemas successfully.");
}

main().catch((err) => {
    console.error("[postbuild] Error copying schemas:", err);
    process.exit(1);
});
