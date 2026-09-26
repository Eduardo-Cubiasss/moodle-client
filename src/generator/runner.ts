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
import { loadOrCreateConfig } from "./config/config-manager";
import { cloneMoodleVersion, cleanupMoodleDirectory } from "./downloader/moodle-downloader";

export interface RunGeneratorOptions {
    silent?: boolean;
}

function logInfo(message: string, silent?: boolean): void {
    if (!silent) {
        console.log(message);
    }
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
 * Schemas are stored directly inside @didactika/moodle-client.
 */
export async function runGenerator(
    configPath?: string,
    options?: RunGeneratorOptions
): Promise<void> {
    const config = await loadOrCreateConfig(configPath);
    const pkgDir = findMoodleClientPackageDir();
    const targetSchemasDir = path.join(pkgDir, "dist/schemas");

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

        // Generate files directly into package's dist/schemas
        await generateWebserviceFiles(
            result.schemas as WebServiceSchema[],
            targetSchemasDir,
            { importSource: "@didactika/moodle-client" }
        );

        // Emit empty JS barrel stubs so module resolution succeeds in runtime
        await fs.writeFile(path.join(targetSchemasDir, "index.js"), "export {};\n", "utf-8");
        await fs.writeFile(path.join(targetSchemasDir, "index.mjs"), "export {};\n", "utf-8");

        // If developing in moodle-client repository, also update src/schemas
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

        logInfo(
            `[moodle-client] Successfully generated ${result.schemas.length} webservices into '@didactika/moodle-client'.`,
            options?.silent
        );
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
