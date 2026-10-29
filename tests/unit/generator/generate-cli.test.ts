import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { generateSchemas } from "../../../src/generator/cli";
import { makeMoodleDir } from "./helpers/moodle";

describe("moodle-generate-schemas (local paths)", () => {
    let tempDir: string;
    let pkgJsonPath: string;
    let originalCwd: string;

    async function writeSchemas(namespace: string): Promise<void> {
        const dir = path.join(tempDir, "src/moodle", namespace);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, "index.d.ts"), "export interface GeneratedMoodleServices {}\n", "utf-8");
        await fs.writeFile(path.join(dir, "a.webservice.d.ts"), "export interface A {}\n", "utf-8");
    }

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-generate-cli-test-"));
        pkgJsonPath = path.join(tempDir, "package.json");
        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        await fs.mkdir(nodeModulesDir, { recursive: true });
        await fs.writeFile(path.join(nodeModulesDir, "package.json"), JSON.stringify({ name: "@didactika/moodle-client" }), "utf-8");
        await fs.writeFile(
            pkgJsonPath,
            JSON.stringify({
                name: "app",
                "moodle-client": [
                    // A path saved by an older version is ignored: it is always asked
                    { namespace: "dev", source: { type: "moodle-local", path: "/somewhere/else" }, webservices: ["*"], outDir: "src/moodle" },
                    { namespace: "repo", source: { type: "moodle-repository", url: "https://a/b.git", branch: "main" }, webservices: ["*"], outDir: "src/moodle" },
                ],
            }),
            "utf-8"
        );
        await writeSchemas("dev");
        await writeSchemas("repo");
        originalCwd = process.cwd();
        process.chdir(tempDir);
    });

    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    it("should not ask anything when only synchronizing existing schemas", async () => {
        const runner = vi.fn().mockResolvedValue(undefined);
        await generateSchemas({ configPath: pkgJsonPath, env: {}, generatorRunner: runner });
        expect(runner).toHaveBeenCalledWith(pkgJsonPath, { force: undefined, forceNamespaces: undefined, sources: {} });
    });

    it("should ask the path of every local namespace regenerated with --force, and only of those", async () => {
        const moodleDir = await makeMoodleDir(tempDir);
        const runner = vi.fn().mockResolvedValue(undefined);

        await generateSchemas({ configPath: pkgJsonPath, force: true, env: {}, mockAnswers: [moodleDir], generatorRunner: runner });

        expect(runner.mock.calls[0]![1].sources).toEqual({ dev: { type: "moodle-local", path: moodleDir } });
    });

    it("should read the path from MOODLE_<NAMESPACE>_PATH without asking", async () => {
        const moodleDir = await makeMoodleDir(tempDir);
        const runner = vi.fn().mockResolvedValue(undefined);

        await generateSchemas({ configPath: pkgJsonPath, namespaces: ["dev"], env: { MOODLE_DEV_PATH: moodleDir }, generatorRunner: runner });

        expect(runner.mock.calls[0]![1]).toMatchObject({ forceNamespaces: ["dev"], sources: { dev: { type: "moodle-local", path: moodleDir } } });
    });

    it("should not ask for a path when the regenerated namespace is not local", async () => {
        const runner = vi.fn().mockResolvedValue(undefined);
        await generateSchemas({ configPath: pkgJsonPath, namespaces: ["repo"], env: {}, generatorRunner: runner });
        expect(runner.mock.calls[0]![1].sources).toEqual({});
    });

    it("should ask for a local namespace whose schemas are missing, even without --force", async () => {
        await fs.rm(path.join(tempDir, "src/moodle/dev/a.webservice.d.ts"));
        const moodleDir = await makeMoodleDir(tempDir);
        const runner = vi.fn().mockResolvedValue(undefined);

        await generateSchemas({ configPath: pkgJsonPath, env: {}, mockAnswers: [moodleDir], generatorRunner: runner });

        expect(runner.mock.calls[0]![1].sources).toEqual({ dev: { type: "moodle-local", path: moodleDir } });
    });

    it("should fail before running with ERR_LOCAL_PATH_REQUIRED when there is no terminal to ask on", async () => {
        const runner = vi.fn();
        const wasTTY = process.stdin.isTTY;
        process.stdin.isTTY = false;
        try {
            await expect(generateSchemas({ configPath: pkgJsonPath, force: true, env: {}, generatorRunner: runner })).rejects.toMatchObject({
                code: "ERR_LOCAL_PATH_REQUIRED",
                action: expect.stringContaining("MOODLE_DEV_PATH"),
            });
        } finally {
            process.stdin.isTTY = wasTTY;
        }
        expect(runner).not.toHaveBeenCalled();
    });
});
