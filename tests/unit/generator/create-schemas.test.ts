import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    promptCreateSchemas,
    parseWebservicesInput,
    parseYesNoInput,
    validateNamespace,
    validateSourceOption,
    validateMoodleVersionInput,
} from "../../../src/generator/interactive/create-schemas";

describe("moodle-create-schemas unit tests", () => {
    let tempDir: string;
    let pkgJsonPath: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-create-test-"));
        pkgJsonPath = path.join(tempDir, "package.json");
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    describe("Input Parsers & Validators", () => {
        it("should parse webservices pattern from JSON array format", () => {
            const result = parseWebservicesInput('["core_user_*", "local_plugin_example"]');
            expect(result).toEqual(["core_user_*", "local_plugin_example"]);
        });

        it("should parse webservices pattern from comma-separated string without quotes", () => {
            const result = parseWebservicesInput("core_user_*, local_plugin_example");
            expect(result).toEqual(["core_user_*", "local_plugin_example"]);
        });

        it("should strip any spaces from comma-separated webservices without quotes", () => {
            const result = parseWebservicesInput("  core_user_*  ,   local_plugin_example  ");
            expect(result).toEqual(["core_user_*", "local_plugin_example"]);
            expect(result[0]).toBe("core_user_*");
            expect(result[1]).toBe("local_plugin_example");
        });

        it("should parse wildcard webservice pattern", () => {
            expect(parseWebservicesInput("*")).toEqual(["*"]);
            expect(parseWebservicesInput("  *  ")).toEqual(["*"]);
            expect(parseWebservicesInput('["*"]')).toEqual(["*"]);
        });

        it("should throw or return error on empty webservices input", () => {
            expect(() => parseWebservicesInput("")).toThrow(/empty/i);
            expect(() => parseWebservicesInput("   ")).toThrow(/empty/i);
            expect(() => parseWebservicesInput("[]")).toThrow(/empty/i);
        });

        it("should parse yes/no answers correctly", () => {
            expect(parseYesNoInput("y")).toBe(true);
            expect(parseYesNoInput("yes")).toBe(true);
            expect(parseYesNoInput("YES")).toBe(true);
            expect(parseYesNoInput("n")).toBe(false);
            expect(parseYesNoInput("no")).toBe(false);
            expect(parseYesNoInput("NO")).toBe(false);
        });

        it("should reject invalid yes/no answers", () => {
            expect(() => parseYesNoInput("")).toThrow();
            expect(() => parseYesNoInput("maybe")).toThrow();
            expect(() => parseYesNoInput("1")).toThrow();
        });

        it("should validate namespace (non-empty, valid format, no duplicates)", () => {
            expect(validateNamespace("moodle5.0", new Set())).toBe(true);
            expect(validateNamespace("legacy_api", new Set())).toBe(true);

            // Empty
            expect(() => validateNamespace("", new Set())).toThrow(/empty/i);
            expect(() => validateNamespace("   ", new Set())).toThrow(/empty/i);

            // Duplicate
            const existing = new Set(["moodle5.0"]);
            expect(() => validateNamespace("moodle5.0", existing)).toThrow(/already exists/i);

            // Invalid characters (spaces)
            expect(() => validateNamespace("invalid name", new Set())).toThrow(/invalid/i);
        });

        it("should validate source option (1 = Remote, 2 = Local, 3 = Repository)", () => {
            expect(validateSourceOption("1")).toBe("remote");
            expect(validateSourceOption("2")).toBe("local");

            expect(validateSourceOption("3")).toBe("repository");

            // Invalid options
            expect(() => validateSourceOption("4")).toThrow(/invalid/i);
            expect(() => validateSourceOption("abc")).toThrow(/invalid/i);
            expect(() => validateSourceOption("")).toThrow(/invalid/i);
        });

        it("should validate Moodle version (>= 2.0)", () => {
            expect(validateMoodleVersionInput("5.0")).toBe("5.0");
            expect(validateMoodleVersionInput("4.5")).toBe("4.5");
            expect(validateMoodleVersionInput("4.5.2")).toBe("4.5");

            // Unsupported / invalid
            expect(() => validateMoodleVersionInput("1.9")).toThrow(/supported|2\.0/i);
            expect(() => validateMoodleVersionInput("")).toThrow(/empty/i);
            expect(() => validateMoodleVersionInput("abc")).toThrow(/supported|2\.0/i);
        });
    });

    describe("Interactive Create Flow (Moodle Remote)", () => {
        it("should prompt and create remote Moodle schema without project outDir", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");

            const mockRunner = vi.fn().mockResolvedValue(undefined);

            // Answers sequence:
            // 1. Namespace: "moodle5.0"
            // 2. Source: "1" (Remote)
            // 3. Version: "5.0"
            // 4. Webservices: '["core_user_*"]'
            // 5. Save in project dir?: "n"
            // 6. Create another schema?: "n"
            const answers = ["moodle5.0", "1", "5.0", '["core_user_*"]', "n", "n"];

            await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: answers,
                generatorRunner: mockRunner,
            });

            // Verify package.json contains ONLY the created schema (not default fallback)
            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(1);
            expect(updatedPkg["moodle-client"][0]).toEqual({
                namespace: "moodle5.0",
                source: {
                    type: "moodle-official",
                    version: "5.0",
                },
                webservices: ["core_user_*"],
            });

            // Verify generator runner was called
            expect(mockRunner).toHaveBeenCalledWith(pkgJsonPath);
        });

        it("should prompt and create remote Moodle schema with custom project outDir", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");

            const mockRunner = vi.fn().mockResolvedValue(undefined);

            // Answers sequence:
            // 1. Namespace: "moodle5.0"
            // 2. Source: "1" (Remote)
            // 3. Version: "5.0"
            // 4. Webservices: "*"
            // 5. Save in project dir?: "y"
            // 6. Path: "src/schemas"
            // 7. Create another schema?: "n"
            const answers = ["moodle5.0", "1", "5.0", "*", "y", "src/schemas", "n"];

            await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: answers,
                generatorRunner: mockRunner,
            });

            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(1);
            expect(updatedPkg["moodle-client"][0]).toEqual({
                namespace: "moodle5.0",
                source: {
                    type: "moodle-official",
                    version: "5.0",
                },
                webservices: ["*"],
                outDir: "src/schemas",
            });
        });
    });

    describe("Interactive Create Flow (Moodle Local)", () => {
        it("should prompt and create local Moodle schema asking for Moodle path and project outDir", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");

            const localMoodleDir = path.join(tempDir, "local-moodle");
            await fs.mkdir(localMoodleDir);

            const mockRunner = vi.fn().mockResolvedValue(undefined);

            // Answers sequence for local:
            // 1. Namespace: "moodleLocal"
            // 2. Source: "2" (Local)
            // 3. Moodle directory path: localMoodleDir
            // 4. Webservices: '["core_user_*", "core_course_*"]'
            // 5. Directory to save schemas (outDir): "src/moodleLocalSchemas"
            // 6. Create another schema?: "n"
            const answers = [
                "moodleLocal",
                "2",
                localMoodleDir,
                '["core_user_*", "core_course_*"]',
                "src/moodleLocalSchemas",
                "n",
            ];

            await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: answers,
                generatorRunner: mockRunner,
            });

            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(1);
            expect(updatedPkg["moodle-client"][0]).toEqual({
                namespace: "moodleLocal",
                source: {
                    type: "moodle-local",
                    path: localMoodleDir,
                },
                webservices: ["core_user_*", "core_course_*"],
                outDir: "src/moodleLocalSchemas",
            });
        });
    });

    describe("Multiple schemas and validation retry", () => {
        it("should allow creating multiple schemas in one session and prevent duplicates", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");

            const mockRunner = vi.fn().mockResolvedValue(undefined);

            // Answers sequence:
            // Schema 1:
            // 1. Namespace: "schema1"
            // 2. Source: "1" (Remote)
            // 3. Version: "4.5"
            // 4. Webservices: "*"
            // 5. Save in project dir?: "n"
            // 6. Create another?: "y"
            // Schema 2 (attempts duplicate "schema1" first, then valid "schema2"):
            // 7. Namespace: "schema1" (invalid -> retry)
            // 8. Namespace: "schema2" (valid)
            // 9. Source: "1"
            // 10. Version: "5.0"
            // 11. Webservices: "*"
            // 12. Save in project dir?: "n"
            // 13. Create another?: "n"
            const answers = [
                "schema1", "1", "4.5", "*", "n", "y",
                "schema1", "schema2", "1", "5.0", "*", "n", "n",
            ];

            await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: answers,
                generatorRunner: mockRunner,
            });

            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(2);
            expect(updatedPkg["moodle-client"][0].namespace).toBe("schema1");
            expect(updatedPkg["moodle-client"][1].namespace).toBe("schema2");
        });

        it("should preserve pre-existing configurations and append newly created ones", async () => {
            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "existingSchema",
                        source: { type: "moodle", version: "4.4" },
                        webservices: ["*"],
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            const mockRunner = vi.fn().mockResolvedValue(undefined);

            const answers = ["newSchema", "1", "5.0", "*", "n", "n"];

            await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: answers,
                generatorRunner: mockRunner,
            });

            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(2);
            expect(updatedPkg["moodle-client"][0].namespace).toBe("existingSchema");
            expect(updatedPkg["moodle-client"][1].namespace).toBe("newSchema");
        });
    });
});
