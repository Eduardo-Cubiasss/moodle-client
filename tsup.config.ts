import { defineConfig } from "tsup";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

async function copyDirWithDts(src: string, dest: string) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDirWithDts(srcPath, destPath);
        } else if (entry.name.endsWith(".ts")) {
            const content = await fs.readFile(srcPath, "utf-8");
            await fs.writeFile(destPath, content, "utf-8");
            const dtsPath = destPath.replace(/\.ts$/, ".d.ts");
            await fs.writeFile(dtsPath, content, "utf-8");
        }
    }
}

export default defineConfig({
    entry: ["src/index.ts", "src/generator/cli.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    target: "node20",
    async onSuccess() {
        // 1. Copy PHP adapter
        const sourcePhpAdapter = path.resolve(__dirname, "src/generator/php-adapter");
        const targetPhpAdapter = path.resolve(__dirname, "dist/generator/php-adapter");
        if (existsSync(sourcePhpAdapter)) {
            await fs.cp(sourcePhpAdapter, targetPhpAdapter, { recursive: true });
        }

        // 2. Copy pre-packaged schemas to dist/schemas as both .ts and .d.ts
        const sourceSchemas = path.resolve(__dirname, "src/schemas");
        const targetSchemas = path.resolve(__dirname, "dist/schemas");
        if (existsSync(sourceSchemas)) {
            await copyDirWithDts(sourceSchemas, targetSchemas);
        }

        // 3. Ensure declaration files export from ./schemas/index
        const dtsFiles = [
            path.resolve(__dirname, "dist/index.d.ts"),
            path.resolve(__dirname, "dist/index.d.mts"),
        ];
        for (const dtsFile of dtsFiles) {
            if (existsSync(dtsFile)) {
                const content = await fs.readFile(dtsFile, "utf-8");
                if (!content.includes('export * from "./schemas/index"')) {
                    await fs.appendFile(dtsFile, '\nexport * from "./schemas/index";\n', "utf-8");
                }
            }
        }
    },
});

