import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    promptUpdateSchemas,
    updateSchemasFromOptions,
} from "../../../src/generator/ui/update-schemas";

const exists = (p: string) => fs.access(p).then(() => true).catch(() => false);

describe("moodle-update-schemas", () => {
    let tempDir: string;
    let pkgJsonPath: string;

    const repoEntry = {
        namespace: "updFuniber",
        source: { type: "moodle-repository", url: "https://gitlab.example.com/moodle.git", branch: "main" },
        webservices: ["*"],
        outDir: "src/moodle",
    };
    const officialEntry = {
        namespace: "updOfficial",
        source: { type: "moodle-official", version: "4.5" },
        webservices: ["core_user_*"],
    };

    async function writePkg(entries: unknown[]): Promise<string> {
        const raw = JSON.stringify({ name: "my-app", "moodle-client": entries }, null, 2) + "\n";
        await fs.writeFile(pkgJsonPath, raw, "utf-8");
        return raw;
    }

    async function readEntries(): Promise<Array<Record<string, unknown>>> {
        return JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))["moodle-client"];
    }

    async function writeGenerated(outDir: string, namespace: string, content: string): Promise<string> {
        const file = path.join(tempDir, outDir, namespace, "core/user/get_users.webservice.d.ts");
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, content, "utf-8");
        return file;
    }

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-update-test-"));
        pkgJsonPath = path.join(tempDir, "package.json");
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    describe("One-line mode (updateSchemasFromOptions)", () => {
        it("should change only the given fields and regenerate only that namespace", async () => {
            await writePkg([officialEntry, repoEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);

            const result = await updateSchemasFromOptions({
                pkgPath: pkgJsonPath,
                flags: { namespace: "updFuniber", sourceBranch: "UEA_MASTER" },
                sync: true,
                generatorRunner: runner,
            });

            expect(result).toMatchObject({ saved: true, synchronized: true });
            expect(result.changes).toEqual(["source.branch: main -> UEA_MASTER"]);
            const entries = await readEntries();
            expect(entries[0]).toEqual(officialEntry);
            expect(entries[1]).toEqual({ ...repoEntry, source: { ...repoEntry.source, branch: "UEA_MASTER" } });
            expect(runner).toHaveBeenCalledWith(pkgJsonPath, "updFuniber", { forceNamespaces: ["updFuniber"] });
        });

        it("should save without regenerating when --sync is not given", async () => {
            await writePkg([repoEntry]);
            const runner = vi.fn();

            const result = await updateSchemasFromOptions({
                pkgPath: pkgJsonPath,
                flags: { namespace: "updFuniber", webservices: "core_*" },
                generatorRunner: runner,
            });

            expect(result).toMatchObject({ saved: true, synchronized: false });
            expect((await readEntries())[0]!.webservices).toEqual(["core_*"]);
            expect(runner).not.toHaveBeenCalled();
        });

        it("should regenerate with the current configuration with --namespace and --sync only", async () => {
            const raw = await writePkg([repoEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);

            const result = await updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updFuniber" }, sync: true, generatorRunner: runner });

            expect(result).toMatchObject({ saved: false, synchronized: true, changes: [] });
            expect(runner).toHaveBeenCalledTimes(1);
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });

        it("should do nothing with --namespace alone", async () => {
            const raw = await writePkg([repoEntry]);
            const runner = vi.fn();

            const result = await updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updFuniber" }, generatorRunner: runner });

            expect(result).toMatchObject({ saved: false, synchronized: false });
            expect(runner).not.toHaveBeenCalled();
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });

        it("should keep the saved configuration and restore the previous schemas when synchronization fails", async () => {
            await writePkg([repoEntry]);
            const generated = await writeGenerated("src/moodle", "updFuniber", "export interface Previous {}\n");

            const failingRunner = vi.fn().mockImplementation(async () => {
                // Regeneration already wiped the namespace before failing
                await fs.rm(path.join(tempDir, "src/moodle/updFuniber"), { recursive: true, force: true });
                await writeGenerated("src/moodle", "updFuniber", "export interface HalfWritten {}\n");
                throw new Error("authentication failed");
            });

            await expect(
                updateSchemasFromOptions({
                    pkgPath: pkgJsonPath,
                    flags: { namespace: "updFuniber", sourceBranch: "broken" },
                    sync: true,
                    generatorRunner: failingRunner,
                })
            ).rejects.toMatchObject({
                code: "ERR_SYNC_FAILED",
                details: expect.stringContaining("was saved, but its schemas could not be regenerated (cause: authentication failed)"),
                action: expect.stringContaining("npx moodle-generate-schemas --namespace updFuniber"),
            });

            expect(((await readEntries())[0]!.source as { branch: string }).branch).toBe("broken");
            expect(await fs.readFile(generated, "utf-8")).toBe("export interface Previous {}\n");
        });

        it("should remove the namespace from its old outDir after moving it, keeping other files there", async () => {
            await writePkg([repoEntry]);
            await writeGenerated("src/moodle", "updFuniber", "export interface Old {}\n");
            await fs.writeFile(path.join(tempDir, "src/moodle/updFuniber/notes.md"), "mine", "utf-8");

            await updateSchemasFromOptions({
                pkgPath: pkgJsonPath,
                flags: { namespace: "updFuniber", outDir: "src/schemas" },
                sync: true,
                generatorRunner: vi.fn().mockResolvedValue(undefined),
            });

            expect((await readEntries())[0]!.outDir).toBe("src/schemas");
            expect(await exists(path.join(tempDir, "src/moodle/updFuniber/core"))).toBe(false);
            expect(await fs.readFile(path.join(tempDir, "src/moodle/updFuniber/notes.md"), "utf-8")).toBe("mine");
        });

        it("should migrate a legacy source type with --namespace alone", async () => {
            await writePkg([{ namespace: "updLegacy", source: { type: "moodle", version: "4.5" }, webservices: ["*"] }]);

            const result = await updateSchemasFromOptions({
                pkgPath: pkgJsonPath,
                flags: { namespace: "updLegacy" },
                generatorRunner: vi.fn().mockResolvedValue(undefined),
            });

            expect(result.changes).toEqual(["source.type: moodle -> moodle-official"]);
            expect((await readEntries())[0]!.source).toEqual({ type: "moodle-official", version: "4.5" });
        });

        it("should refuse to update the bundled namespace", async () => {
            await writePkg([{ namespace: "webservice", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"] }]);
            await expect(
                updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "webservice" }, sync: true, generatorRunner: vi.fn() })
            ).rejects.toMatchObject({ code: "ERR_CONFIG_RESERVED_NAMESPACE" });
        });

        it("should fail with ERR_NAMESPACE_NOT_FOUND for an unknown namespace", async () => {
            await writePkg([repoEntry]);
            await expect(
                updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "nope" }, generatorRunner: vi.fn() })
            ).rejects.toMatchObject({ code: "ERR_NAMESPACE_NOT_FOUND" });
        });

        it("should not write package.json when a flag is invalid", async () => {
            const raw = await writePkg([repoEntry]);
            const runner = vi.fn();
            await expect(
                updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updFuniber", sourceVersion: "4.5" }, generatorRunner: runner })
            ).rejects.toThrow(/does not apply to source type 'moodle-repository'/);
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
            expect(runner).not.toHaveBeenCalled();
        });
    });

    describe("local sources (one-line mode)", () => {
        const localEntry = { namespace: "updLocal", source: { type: "moodle-local" }, webservices: ["*"], outDir: "src/moodle" };

        it("should regenerate from --source.path without saving it", async () => {
            const raw = await writePkg([localEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);

            await updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updLocal", sourcePath: os.tmpdir() }, sync: true, generatorRunner: runner });

            expect(runner).toHaveBeenCalledWith(pkgJsonPath, "updLocal", {
                forceNamespaces: ["updLocal"],
                sources: { updLocal: { type: "moodle-local", path: os.tmpdir() } },
            });
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });

        it("should ask for the path when it is not given otherwise", async () => {
            await writePkg([localEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);
            await updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updLocal" }, sync: true, mockAnswers: [os.tmpdir()], generatorRunner: runner });
            expect(runner.mock.calls[0]![2].sources.updLocal.path).toBe(os.tmpdir());
        });

        it("should fail with ERR_LOCAL_PATH_REQUIRED without a terminal, saving nothing", async () => {
            const raw = await writePkg([localEntry]);
            const runner = vi.fn();
            const wasTTY = process.stdin.isTTY;
            process.stdin.isTTY = false;
            try {
                await expect(
                    updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updLocal", webservices: "core_*" }, sync: true, generatorRunner: runner })
                ).rejects.toMatchObject({ code: "ERR_LOCAL_PATH_REQUIRED", action: expect.stringContaining("--source.path") });
            } finally {
                process.stdin.isTTY = wasTTY;
            }
            expect(runner).not.toHaveBeenCalled();
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });

        it("should not need nor save a path when only saving changes", async () => {
            await writePkg([localEntry]);
            await updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updLocal", webservices: "core_*", sourcePath: os.tmpdir() }, generatorRunner: vi.fn() });
            expect((await readEntries())[0]).toEqual({ ...localEntry, webservices: ["core_*"] });
        });

        it("should drop a path saved by an older version when the entry is saved again", async () => {
            await writePkg([{ ...localEntry, source: { type: "moodle-local", path: "/home/someone/moodle" } }]);
            await updateSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "updLocal", webservices: "core_*" }, generatorRunner: vi.fn() });
            expect((await readEntries())[0]!.source).toEqual({ type: "moodle-local" });
        });
    });

    describe("Interactive wizard (promptUpdateSchemas)", () => {
        it("should keep every value on Enter and change only what is typed", async () => {
            await writePkg([officialEntry, repoEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);

            // Each answer is the final content of the line, which starts with the current value:
            // namespace #2, source type kept, url kept, branch edited, webservices edited,
            // outDir kept, synchronize (changes are saved without asking)
            const answers = ["2", "3", repoEntry.source.url, "UEA_MASTER", "core_*, local_*", "src/moodle", "y"];
            const result = await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: answers, generatorRunner: runner });

            expect(result).toMatchObject({ saved: true, synchronized: true });
            expect((await readEntries())[1]).toEqual({
                ...repoEntry,
                source: { ...repoEntry.source, branch: "UEA_MASTER" },
                webservices: ["core_*", "local_*"],
            });
            expect(runner).toHaveBeenCalledWith(pkgJsonPath, "updFuniber", { forceNamespaces: ["updFuniber"] });
        });

        it("should switch to a local source, save it without path, and ask the path only to synchronize", async () => {
            await writePkg([officialEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);
            // source type local (no path asked here), webservices, outDir, synchronize: y, then the path
            const answers = ["1", "2", "core_user_*", "src/moodle", "y", os.tmpdir()];
            await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: answers, generatorRunner: runner });

            expect((await readEntries())[0]).toEqual({
                namespace: "updOfficial",
                source: { type: "moodle-local" },
                webservices: ["core_user_*"],
                outDir: "src/moodle",
            });
            expect(runner).toHaveBeenCalledWith(pkgJsonPath, "updOfficial", {
                forceNamespaces: ["updOfficial"],
                sources: { updOfficial: { type: "moodle-local", path: os.tmpdir() } },
            });
        });

        it("should not ask the path of a local source when synchronization is declined", async () => {
            await writePkg([{ namespace: "updLocal", source: { type: "moodle-local" }, webservices: ["*"], outDir: "src/moodle" }]);
            const runner = vi.fn();
            // namespace, source type kept, webservices edited, outDir kept, synchronize: n (nothing else asked)
            const result = await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: ["1", "2", "core_*", "src/moodle", "n"], generatorRunner: runner });

            expect(result).toMatchObject({ saved: true, synchronized: false });
            expect(runner).not.toHaveBeenCalled();
        });

        it("should save but not regenerate when synchronization is declined", async () => {
            await writePkg([officialEntry]);
            const runner = vi.fn();
            const answers = ["1", "1", "4.4", "core_user_*", "", "n"];
            const result = await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: answers, generatorRunner: runner });

            expect(result).toMatchObject({ saved: true, synchronized: false });
            expect((await readEntries())[0]!.source).toEqual({ type: "moodle-official", version: "4.4" });
            expect(runner).not.toHaveBeenCalled();
        });

        it("should ask only to synchronize when nothing changed", async () => {
            const raw = await writePkg([officialEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);
            const answers = ["1", "1", "4.5", "core_user_*", "", "y"];
            const result = await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: answers, generatorRunner: runner });

            expect(result).toMatchObject({ saved: false, synchronized: true, changes: [] });
            expect(runner).toHaveBeenCalledWith(pkgJsonPath, "updOfficial", { forceNamespaces: ["updOfficial"] });
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });

        it("should clear optional fields whose prefilled value is deleted, and re-ask required ones", async () => {
            await writePkg([{ ...officialEntry, outDir: "src/moodle" }]);
            // version deleted (required: error, asked again), outDir deleted (cleared)
            const answers = ["1", "1", "", "4.5", "core_user_*", "", "n"];
            await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: answers, generatorRunner: vi.fn() });

            expect((await readEntries())[0]).toEqual(officialEntry);
        });

        it("should not offer the bundled namespace in the wizard", async () => {
            await writePkg([{ namespace: "webservice", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"] }, officialEntry]);
            const runner = vi.fn().mockResolvedValue(undefined);
            // option 1 is updOfficial, the only configurable entry
            const result = await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: ["1", "1", "4.5", "core_user_*", "", "y"], generatorRunner: runner });
            expect(result.namespace).toBe("updOfficial");
            expect(runner).toHaveBeenCalledWith(pkgJsonPath, "updOfficial", { forceNamespaces: ["updOfficial"] });
        });

        it("should report when there is nothing to update", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }), "utf-8");
            const result = await promptUpdateSchemas({ pkgPath: pkgJsonPath, mockAnswers: ["1"] });
            expect(result.saved).toBe(false);
            expect(result.reason).toMatch(/no schema namespaces found/i);
        });
    });
});
