import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    promptDeleteSchemas,
    deleteSchemasFromOptions,
    validateDeleteOption,
} from "../../../src/generator/ui/delete-schemas";

describe("moodle-delete-schemas unit tests", () => {
    let tempDir: string;
    let pkgJsonPath: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-delete-test-"));
        pkgJsonPath = path.join(tempDir, "package.json");
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    describe("Input Validation", () => {
        it("should validate option within range 1..N", () => {
            expect(validateDeleteOption("1", 3)).toBe(0); // 0-based index
            expect(validateDeleteOption("2", 3)).toBe(1);
            expect(validateDeleteOption("3", 3)).toBe(2);
        });

        it("should reject options out of range or invalid format", () => {
            expect(() => validateDeleteOption("0", 3)).toThrow(/invalid/i);
            expect(() => validateDeleteOption("4", 3)).toThrow(/invalid/i);
            expect(() => validateDeleteOption("-1", 3)).toThrow(/invalid/i);
            expect(() => validateDeleteOption("abc", 3)).toThrow(/invalid/i);
            expect(() => validateDeleteOption("", 3)).toThrow(/empty|invalid/i);
        });
    });

    describe("Interactive Delete Flow", () => {
        it("should handle empty package.json gracefully without error", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");

            const result = await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: [],
            });

            expect(result.deleted).toBe(false);
            expect(result.reason).toMatch(/no schema namespaces found/i);
        });

        it("should delete selected namespace configuration from package.json", async () => {
            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodle5.0",
                        source: { type: "moodle-official", version: "5.0" },
                        webservices: ["*"],
                    },
                    {
                        namespace: "moodleLegacy",
                        source: { type: "moodle-local", path: "/path/to/moodle" },
                        webservices: ["core_user_*"],
                        outDir: "src/moodleLegacySchemas",
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            // User selects option "1" (moodle5.0)
            const result = await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: ["1"],
                baseDir: tempDir,
            });

            expect(result.deleted).toBe(true);
            expect(result.deletedNamespace).toBe("moodle5.0");

            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(1);
            expect(updatedPkg["moodle-client"][0].namespace).toBe("moodleLegacy");
        });

        it("should clean outDir files with signature .webservice.d.ts and index.d.ts", async () => {
            const outDir = path.join(tempDir, "src/moodleLegacySchemas");
            const nsDir = path.join(outDir, "moodleLegacy");
            await fs.mkdir(nsDir, { recursive: true });

            // Create generated files
            await fs.writeFile(path.join(nsDir, "core_user_get_users.webservice.d.ts"), "// generated");
            await fs.writeFile(path.join(nsDir, "index.d.ts"), "export interface GeneratedMoodleServices {}\n");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "moodle-local", path: "/path/to/moodle" },
                        webservices: ["core_user_*"],
                        outDir: "src/moodleLegacySchemas",
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            const result = await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: ["1"],
                baseDir: tempDir,
            });

            expect(result.deleted).toBe(true);

            // Generated files should be deleted
            const nsDirExists = await fs.access(nsDir).then(() => true).catch(() => false);
            expect(nsDirExists).toBe(false);
        });

        it("should ask before force-deleting when the namespace contains a hand-written index.ts", async () => {
            const outDir = path.join(tempDir, "src/moodleLegacySchemas");
            const nsDir = path.join(outDir, "moodleLegacy");
            await fs.mkdir(path.join(nsDir, "helpers"), { recursive: true });

            await fs.writeFile(path.join(nsDir, "core_user_get_users.webservice.d.ts"), "// generated");
            await fs.writeFile(path.join(nsDir, "index.d.ts"), "export interface GeneratedMoodleServices {}\n");
            await fs.writeFile(path.join(nsDir, "helpers/index.ts"), "export const helper = 1;");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "moodle-local", path: "/path/to/moodle" },
                        webservices: ["core_user_*"],
                        outDir: "src/moodleLegacySchemas",
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: ["1", "n"],
                baseDir: tempDir,
            });

            expect(await fs.readFile(path.join(nsDir, "helpers/index.ts"), "utf-8")).toBe("export const helper = 1;");
            expect(await fs.access(path.join(nsDir, "core_user_get_users.webservice.d.ts")).then(() => true).catch(() => false)).toBe(false);
            expect(await fs.access(path.join(nsDir, "index.d.ts")).then(() => true).catch(() => false)).toBe(false);
        });

        it("should keep a hand-written index.ts in the outDir root when deleting a namespace", async () => {
            const outDir = path.join(tempDir, "src/moodleLegacySchemas");
            const nsDir = path.join(outDir, "moodleLegacy");
            await fs.mkdir(nsDir, { recursive: true });
            await fs.writeFile(path.join(nsDir, "core_user_get_users.webservice.d.ts"), "// generated");
            await fs.writeFile(path.join(outDir, "index.ts"), "export * from './custom';");
            await fs.writeFile(path.join(outDir, "index.d.ts"), "/**\n * Master barrel for generated Moodle services namespaces.\n */\nexport interface GeneratedMoodleServices {}\n");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "moodle-local", path: "/path/to/moodle" },
                        webservices: ["core_user_*"],
                        outDir: "src/moodleLegacySchemas",
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: ["1"],
                baseDir: tempDir,
            });

            expect(await fs.readFile(path.join(outDir, "index.ts"), "utf-8")).toBe("export * from './custom';");
            expect(await fs.access(path.join(outDir, "index.d.ts")).then(() => true).catch(() => false)).toBe(false);
        });

        it("should preserve user files in outDir and not delete folder if user files exist and user answers 'n'", async () => {
            const outDir = path.join(tempDir, "src/moodleLegacySchemas");
            const nsDir = path.join(outDir, "moodleLegacy");
            await fs.mkdir(nsDir, { recursive: true });

            // Create generated file AND custom user file
            await fs.writeFile(path.join(nsDir, "core_user_get_users.webservice.d.ts"), "// generated");
            await fs.writeFile(path.join(nsDir, "index.d.ts"), "export interface GeneratedMoodleServices {}\n");
            await fs.writeFile(path.join(nsDir, "my-custom-helper.ts"), "export const helper = 1;");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "moodle-local", path: "/path/to/moodle" },
                        webservices: ["core_user_*"],
                        outDir: "src/moodleLegacySchemas",
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: ["1", "n"],
                baseDir: tempDir,
            });

            // Generated file deleted
            const generatedFileExists = await fs
                .access(path.join(nsDir, "core_user_get_users.webservice.d.ts"))
                .then(() => true)
                .catch(() => false);
            expect(generatedFileExists).toBe(false);

            // User file PRESERVED
            const userFileExists = await fs
                .access(path.join(nsDir, "my-custom-helper.ts"))
                .then(() => true)
                .catch(() => false);
            expect(userFileExists).toBe(true);

            // Directory NOT deleted
            const nsDirExists = await fs.access(nsDir).then(() => true).catch(() => false);
            expect(nsDirExists).toBe(true);

            // Root outDir also preserved
            const outDirExists = await fs.access(outDir).then(() => true).catch(() => false);
            expect(outDirExists).toBe(true);
        });

        it("should force delete all files including user files when user confirms 'y'", async () => {
            const outDir = path.join(tempDir, "src/moodleLegacySchemas");
            const nsDir = path.join(outDir, "moodleLegacy");
            await fs.mkdir(nsDir, { recursive: true });

            // Create generated file AND custom user file
            await fs.writeFile(path.join(nsDir, "core_user_get_users.webservice.d.ts"), "// generated");
            await fs.writeFile(path.join(nsDir, "index.d.ts"), "export interface GeneratedMoodleServices {}\n");
            await fs.writeFile(path.join(nsDir, "my-custom-helper.ts"), "export const helper = 1;");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "moodle-local", path: "/path/to/moodle" },
                        webservices: ["core_user_*"],
                        outDir: "src/moodleLegacySchemas",
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: ["1", "y"],
                baseDir: tempDir,
            });

            // Namespace directory should be completely deleted
            const nsDirExists = await fs.access(nsDir).then(() => true).catch(() => false);
            expect(nsDirExists).toBe(false);

            // Root outDir PRESERVED (e.g. src/moodleLegacySchemas remains even if empty)
            const outDirExists = await fs.access(outDir).then(() => true).catch(() => false);
            expect(outDirExists).toBe(true);
        });

        it("should delete namespace in node_modules without failing if node_modules does not exist", async () => {
            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodle5.0",
                        source: { type: "moodle-official", version: "5.0" },
                        webservices: ["*"],
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            // In this test tempDir does not contain node_modules/@didactika/moodle-client
            // It must complete cleanly without throwing
            const result = await promptDeleteSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: ["1"],
                baseDir: tempDir,
            });

            expect(result.deleted).toBe(true);
        });
    });
    describe("One-line mode (deleteSchemasFromOptions)", () => {
        const pkgWithLocal = (outDir: string) => ({
            name: "my-app",
            "moodle-client": [
                { namespace: "keepMe", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"] },
                { namespace: "localDev", source: { type: "moodle-local", path: "." }, webservices: ["*"], outDir },
            ],
        });

        it("should delete the named namespace, its generated files and its entry", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkgWithLocal("schemas"), null, 2), "utf-8");
            const nsDir = path.join(tempDir, "schemas/localDev/core/user");
            await fs.mkdir(nsDir, { recursive: true });
            await fs.writeFile(path.join(nsDir, "get_users.webservice.d.ts"), "export interface X {}\n", "utf-8");

            const result = await deleteSchemasFromOptions({ pkgPath: pkgJsonPath, namespace: "localDev" });

            expect(result).toEqual({ deleted: true, deletedNamespace: "localDev" });
            const pkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(pkg["moodle-client"].map((c: { namespace: string }) => c.namespace)).toEqual(["keepMe"]);
            expect(await fs.access(path.join(tempDir, "schemas/localDev")).then(() => true).catch(() => false)).toBe(false);
        });

        it("should keep files moodle-client did not generate unless --purge is given", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkgWithLocal("schemas"), null, 2), "utf-8");
            const nsDir = path.join(tempDir, "schemas/localDev");
            await fs.mkdir(nsDir, { recursive: true });
            await fs.writeFile(path.join(nsDir, "notes.md"), "mine", "utf-8");

            await deleteSchemasFromOptions({ pkgPath: pkgJsonPath, namespace: "localDev" });
            expect(await fs.readFile(path.join(nsDir, "notes.md"), "utf-8")).toBe("mine");

            await fs.writeFile(pkgJsonPath, JSON.stringify(pkgWithLocal("schemas"), null, 2), "utf-8");
            await deleteSchemasFromOptions({ pkgPath: pkgJsonPath, namespace: "localDev", purge: true });
            expect(await fs.access(nsDir).then(() => true).catch(() => false)).toBe(false);
        });

        it("should only remove a stale 'webservice' entry from package.json, never the bundled files", async () => {
            await fs.writeFile(
                pkgJsonPath,
                JSON.stringify({ name: "my-app", "moodle-client": [{ namespace: "webservice", source: { type: "moodle-official", version: "4.5" }, webservices: ["core_user_*"] }] }, null, 2),
                "utf-8"
            );
            const bundledDir = path.join(tempDir, "node_modules/@didactika/moodle-client/dist/schemas/webservice");
            await fs.mkdir(bundledDir, { recursive: true });
            await fs.writeFile(path.join(bundledDir, "index.d.ts"), "export interface GeneratedMoodleServices {}\n", "utf-8");

            const result = await deleteSchemasFromOptions({ pkgPath: pkgJsonPath, namespace: "webservice" });

            expect(result).toEqual({ deleted: true, deletedNamespace: "webservice" });
            expect(JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))["moodle-client"]).toEqual([]);
            expect(await fs.readFile(path.join(bundledDir, "index.d.ts"), "utf-8")).toContain("GeneratedMoodleServices");
        });

        it("should refuse to delete the bundled namespace when no entry declares it", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkgWithLocal("schemas"), null, 2), "utf-8");
            await expect(deleteSchemasFromOptions({ pkgPath: pkgJsonPath, namespace: "webservice" })).rejects.toMatchObject({
                code: "ERR_CONFIG_RESERVED_NAMESPACE",
            });
        });

        it("should fail with ERR_NAMESPACE_NOT_FOUND listing the configured namespaces", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkgWithLocal("schemas"), null, 2), "utf-8");
            await expect(deleteSchemasFromOptions({ pkgPath: pkgJsonPath, namespace: "nope" })).rejects.toMatchObject({
                code: "ERR_NAMESPACE_NOT_FOUND",
                details: expect.stringContaining("Configured namespaces: 'keepMe', 'localDev'"),
            });
        });
    });
});
