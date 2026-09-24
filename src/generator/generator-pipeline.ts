import fs from "fs/promises";
import path from "path";
import os from "os";
import { resolveWebserviceFilePath } from "./resolver/path-resolver";
import { emitWebserviceCode, hasRequiredParameters } from "./emitter/ts-code-emitter";
import { emitBarrelCode } from "./emitter/barrel-emitter";
import { loadOrCreateConfig } from "./config/config-manager";
import { cloneMoodleVersion, cleanupMoodleDirectory } from "./downloader/single-version-downloader";
import { extractWebservice } from "./extractor";
import {
    WebServiceSchema,
    GeneratedServiceMetadata,
} from "./interfaces/generator.interfaces";

/**
 * Generates all individual `.webservice-client.ts` files and the central `index.ts` barrel.
 * Wipes outDir before generating to eliminate any orphaned or stale files from previous runs.
 *
 * @param {WebServiceSchema[]} schemas - List of extracted webservice schemas
 * @param {string} outDir - Target output directory
 * @returns {Promise<void>}
 */
export async function generateWebserviceFiles(
    schemas: WebServiceSchema[],
    outDir: string
): Promise<void> {
    // 1. Wipe and re-create outDir to ensure no orphaned files remain
    await fs.rm(outDir, { recursive: true, force: true });
    await fs.mkdir(outDir, { recursive: true });

    const metadataList: GeneratedServiceMetadata[] = [];

    // 2. Emit each webservice in its hierarchical folder
    for (const schema of schemas) {
        const relFilePath = resolveWebserviceFilePath(schema.name);
        const absoluteFilePath = path.join(outDir, relFilePath);

        const parentDir = path.dirname(absoluteFilePath);
        await fs.mkdir(parentDir, { recursive: true });

        const code = emitWebserviceCode(schema);
        await fs.writeFile(absoluteFilePath, code, "utf-8");

        const relativeImportPath = `./${relFilePath.replace(/\.ts$/, "")}`;
        metadataList.push({
            name: schema.name,
            relativeImportPath,
            hasRequiredParams: hasRequiredParameters(schema),
            description: schema.description,
        });
    }

    // 3. Emit central index.ts barrel
    const barrelCode = emitBarrelCode(metadataList);
    await fs.writeFile(path.join(outDir, "index.ts"), barrelCode, "utf-8");
}

/**
 * Runs the complete end-to-end generator pipeline:
 * 1. Loads or creates default config.
 * 2. If remote: shallow clones target version tag.
 * 3. Extracts webservice AST schemas via headless PHP adapter.
 * 4. Cleans up temp clone if remote.
 * 5. Generates all .webservice-client.ts files and index.ts barrel.
 *
 * @param {string} [configPath] - Optional path to config file
 * @returns {Promise<void>}
 */
export async function runGeneratorPipeline(configPath?: string): Promise<void> {
    const config = await loadOrCreateConfig(configPath);
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
            concurrency: 8,
        });

        await generateWebserviceFiles(result.schemas as any, config.outDir);
    } finally {
        if (shouldCleanup && targetMoodlePath) {
            await cleanupMoodleDirectory(targetMoodlePath);
        }
    }
}

