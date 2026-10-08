import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    promptDeleteSchemas,
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
                        source: { type: "moodle", version: "5.0" },
                        webservices: ["*"],
                    },
                    {
                        namespace: "moodleLegacy",
                        source: { type: "local", path: "/path/to/moodle" },
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
            await fs.writeFile(path.join(nsDir, "index.d.ts"), "// generated barrel");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "local", path: "/path/to/moodle" },
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

        it("should preserve user files in outDir and not delete folder if user files exist and user answers 'n'", async () => {
            const outDir = path.join(tempDir, "src/moodleLegacySchemas");
            const nsDir = path.join(outDir, "moodleLegacy");
            await fs.mkdir(nsDir, { recursive: true });

            // Create generated file AND custom user file
            await fs.writeFile(path.join(nsDir, "core_user_get_users.webservice.d.ts"), "// generated");
            await fs.writeFile(path.join(nsDir, "index.d.ts"), "// generated barrel");
            await fs.writeFile(path.join(nsDir, "my-custom-helper.ts"), "export const helper = 1;");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "local", path: "/path/to/moodle" },
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
            await fs.writeFile(path.join(nsDir, "index.d.ts"), "// generated barrel");
            await fs.writeFile(path.join(nsDir, "my-custom-helper.ts"), "export const helper = 1;");

            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "moodleLegacy",
                        source: { type: "local", path: "/path/to/moodle" },
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
                        source: { type: "moodle", version: "5.0" },
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
});
