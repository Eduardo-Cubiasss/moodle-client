/**
 * Development-only: regenerates the bundled 'webservice' namespace (src/schemas/webservice and
 * src/schemas/index.ts) from Moodle BUNDLED_MOODLE_VERSION. Not published: scripts/ is outside the
 * package "files", tsup does not build it, and tsx is a devDependency.
 *
 *   npm run schemas:bundle                              # download the release and regenerate
 *   npm run schemas:bundle -- --moodle-path ~/moodle    # use an existing checkout of that version
 *   npm run schemas:bundle -- --out /tmp/check          # write somewhere else (src/schemas untouched)
 *
 * To bundle another Moodle version, change BUNDLED_MOODLE_VERSION in
 * src/generator/interfaces/config.interfaces.ts first. Then build and commit src/schemas.
 */
import fs from "fs/promises";
import os from "os";
import path from "path";
import { extractWebservice, generateWebserviceFiles } from "@didactika/moodle-client-schemas";
import { BUNDLED_NAMESPACE, BUNDLED_MOODLE_VERSION } from "../src/generator/interfaces/config.interfaces";
import { cloneMoodleVersion, cleanupMoodleDirectory } from "../src/generator/downloader/moodle-downloader";
import { checkPhpEnvironment } from "../src/generator/utils/environment-validator";
import { buildMasterBarrel, bundledSourceDescription } from "../src/generator/runner";

const ROOT = path.resolve(__dirname, "..");

function option(name: string): string | undefined {
    const args = process.argv.slice(2);
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
}

function expandHome(p: string): string {
    return p.startsWith("~/") ? path.join(os.homedir(), p.slice(2)) : path.resolve(p);
}

/**
 * The package's own master barrel: the bundled namespace only, without the module augmentation,
 * which scripts/postbuild.mjs adds to dist/schemas/index.d.ts.
 */
function bundledMasterSource(): string {
    const barrel = buildMasterBarrel([{ namespace: BUNDLED_NAMESPACE, source: bundledSourceDescription() }]);
    return barrel.slice(0, barrel.indexOf("declare module")).trimEnd() + "\n";
}

async function main(): Promise<void> {
    const outRoot = expandHome(option("--out") ?? path.join(ROOT, "src/schemas"));
    const localPath = option("--moodle-path");
    const moodlePath = localPath
        ? expandHome(localPath)
        : await cloneMoodleVersion(BUNDLED_MOODLE_VERSION, await fs.mkdtemp(path.join(os.tmpdir(), "moodle-bundle-")));

    try {
        await checkPhpEnvironment();
        console.log(`Extracting every web service of Moodle ${BUNDLED_MOODLE_VERSION} from ${moodlePath} ...`);
        const { schemas, errors } = await extractWebservice({ moodlePath, services: ["*"] });
        for (const error of errors) {
            console.warn(`  [${error.code}] ${error.serviceName ?? ""} ${error.message}`);
        }
        if (schemas.length === 0) {
            throw new Error("No web service could be extracted; src/schemas was not changed.");
        }

        const namespaceDir = path.join(outRoot, BUNDLED_NAMESPACE);
        // Types come from the package itself ("../../index"), and the namespace is attached through
        // the master barrel, never as direct methods.
        await generateWebserviceFiles(schemas, namespaceDir, { importSource: "../../index", augmentClient: false });
        await fs.copyFile(path.join(namespaceDir, "index.d.ts"), path.join(namespaceDir, "index.d.mts"));
        await fs.writeFile(path.join(outRoot, "index.ts"), bundledMasterSource(), "utf-8");

        console.log(`${schemas.length} services written to ${namespaceDir} (${errors.length} errors).`);
    } finally {
        if (!localPath) {
            await cleanupMoodleDirectory(moodlePath);
        }
    }
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
