import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    promptCreateSchemas,
    createSchemasFromOptions,
    parseWebservicesInput,
    parseYesNoInput,
    validateNamespace,
    validateSourceOption,
    validateMoodleVersionInput,
} from "../../../src/generator/ui/create-schemas";

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
            expect(validateNamespace("moodle50", new Set())).toBe(true);
            expect(validateNamespace("legacy_api", new Set())).toBe(true);
            expect(validateNamespace("$moodle", new Set())).toBe(true);

            // Empty
            expect(() => validateNamespace("", new Set())).toThrow(/empty/i);
            expect(() => validateNamespace("   ", new Set())).toThrow(/empty/i);

            // Duplicate
            const existing = new Set(["moodle50"]);
            expect(() => validateNamespace("moodle50", existing)).toThrow(/already exists/i);

            // Not a valid identifier: it becomes moodle.<namespace> and part of generated type names
            expect(() => validateNamespace("invalid name", new Set())).toThrow(/invalid/i);
            expect(() => validateNamespace("moodle5.0", new Set())).toThrow(/valid identifier/i);
            expect(() => validateNamespace("local-dev", new Set())).toThrow(/valid identifier/i);
            expect(() => validateNamespace("5moodle", new Set())).toThrow(/valid identifier/i);

            // Reserved for the bundled namespace
            expect(() => validateNamespace("webservice", new Set())).toThrow(/reserved/i);

            // Would share MOODLE_<NAMESPACE>_PATH with an existing namespace
            expect(() => validateNamespace("localdev", new Set(["localDev"]))).toThrow(/share the environment variable MOODLE_LOCALDEV_PATH with 'localDev'/);
            expect(() => validateNamespace("my_ns", new Set(["my$ns"]))).toThrow(/MOODLE_MY_NS_PATH/);
            expect(validateNamespace("localDev2", new Set(["localDev"]))).toBe(true);
        });

        it("should validate source option (1 = Remote, 2 = Local, 3 = Repository)", () => {
            expect(validateSourceOption("1")).toBe("moodle-official");
            expect(validateSourceOption("2")).toBe("moodle-local");
            expect(validateSourceOption("3")).toBe("moodle-repository");

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
            // 1. Namespace: "moodle50"
            // 2. Source: "1" (Remote)
            // 3. Version: "5.0"
            // 4. Webservices: '["core_user_*"]'
            // 5. Save in project dir?: "n"
            // 6. Create another schema?: "n"
            const answers = ["moodle50", "1", "5.0", '["core_user_*"]', "n", "n"];

            await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: answers,
                generatorRunner: mockRunner,
            });

            // Verify package.json contains ONLY the created schema (not default fallback)
            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(1);
            expect(updatedPkg["moodle-client"][0]).toEqual({
                namespace: "moodle50",
                source: {
                    type: "moodle-official",
                    version: "5.0",
                },
                webservices: ["core_user_*"],
            });

            // Verify generator runner was called
            expect(mockRunner).toHaveBeenCalledWith(pkgJsonPath, { forceNamespaces: ["moodle50"], sources: {} });
        });

        it("should prompt and create remote Moodle schema with custom project outDir", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");

            const mockRunner = vi.fn().mockResolvedValue(undefined);

            // Answers sequence:
            // 1. Namespace: "moodle50"
            // 2. Source: "1" (Remote)
            // 3. Version: "5.0"
            // 4. Webservices: "*"
            // 5. Save in project dir?: "y"
            // 6. Path: "src/schemas"
            // 7. Create another schema?: "n"
            const answers = ["moodle50", "1", "5.0", "*", "y", "src/schemas", "n"];

            await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers: answers,
                generatorRunner: mockRunner,
            });

            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toHaveLength(1);
            expect(updatedPkg["moodle-client"][0]).toEqual({
                namespace: "moodle50",
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
            // The path is used to generate, but never saved
            expect(updatedPkg["moodle-client"][0]).toEqual({
                namespace: "moodleLocal",
                source: { type: "moodle-local" },
                webservices: ["core_user_*", "core_course_*"],
                outDir: "src/moodleLocalSchemas",
            });
            expect(mockRunner).toHaveBeenCalledWith(pkgJsonPath, {
                forceNamespaces: ["moodleLocal"],
                sources: { moodleLocal: { type: "moodle-local", path: localMoodleDir } },
            });
        });
    });

    describe("Multiple schemas and validation retry", () => {
        it("should ask again for a namespace that would share the path variable of one created in the same session", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");
            const mockRunner = vi.fn().mockResolvedValue(undefined);

            // Schema 1: namespace, source, version, webservices, save in project? n, another? y
            // Schema 2: 'SCHEMA1' clashes (asked again), 'schema2', source, version, webservices, save? n, another? n
            const answers = [
                "schema1", "1", "4.5", "*", "n", "y",
                "SCHEMA1", "schema2", "1", "5.0", "*", "n", "n",
            ];
            await promptCreateSchemas({ pkgPath: pkgJsonPath, mockAnswers: answers, generatorRunner: mockRunner });

            const namespaces = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))["moodle-client"].map((e: { namespace: string }) => e.namespace);
            expect(namespaces).toEqual(["schema1", "schema2"]);
        });

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
                        source: { type: "moodle-official", version: "4.4" },
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

        it("should rollback package.json and clean up created directories if generation fails", async () => {
            const initialPkg = {
                name: "my-app",
                "moodle-client": [
                    {
                        namespace: "stableSchema",
                        source: { type: "moodle-official", version: "4.4" },
                        webservices: ["*"],
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(initialPkg, null, 2), "utf-8");

            const createdOutDir = path.join(tempDir, "failed-out-dir");
            const mockFailingRunner = vi.fn().mockImplementation(async () => {
                await fs.mkdir(path.join(createdOutDir, "failingSchema"), { recursive: true });
                throw new Error("Simulated remote clone authentication failure");
            });

            const answers = [
                "failingSchema",
                "3",
                "https://gitlab.example.com/repo.git",
                "main",
                "*",
                "failed-out-dir",
                "n",
            ];

            await expect(
                promptCreateSchemas({
                    pkgPath: pkgJsonPath,
                    mockAnswers: answers,
                    generatorRunner: mockFailingRunner,
                })
            ).rejects.toThrow("Simulated remote clone authentication failure");

            // Verify package.json was restored to initial state without failingSchema
            const restoredPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(restoredPkg["moodle-client"]).toHaveLength(1);
            expect(restoredPkg["moodle-client"][0].namespace).toBe("stableSchema");

            // Verify failed directory was cleaned up
            const exists = await fs.access(path.join(createdOutDir, "failingSchema")).then(() => true).catch(() => false);
            expect(exists).toBe(false);
        });
    });
    describe("One-line mode (createSchemasFromOptions)", () => {
        it("should append the entry built from flags and generate it", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");
            const runner = vi.fn().mockResolvedValue(undefined);

            const entry = await createSchemasFromOptions({
                pkgPath: pkgJsonPath,
                flags: {
                    namespace: "funiber",
                    sourceType: "moodle-repository",
                    sourceUrl: "https://gitlab.example.com/moodle.git",
                    sourceBranch: "UEA_MASTER",
                    outDir: "src/moodle",
                },
                generatorRunner: runner,
            });

            const expected = {
                namespace: "funiber",
                source: { type: "moodle-repository", url: "https://gitlab.example.com/moodle.git", branch: "UEA_MASTER" },
                webservices: ["*"],
                outDir: "src/moodle",
            };
            expect(entry).toEqual(expected);
            const pkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(pkg["moodle-client"]).toEqual([expected]);
            expect(runner).toHaveBeenCalledWith(pkgJsonPath, { forceNamespaces: ["funiber"], sources: {} });
        });

        it("should generate a local namespace from --source.path without saving the path", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");
            const runner = vi.fn().mockResolvedValue(undefined);

            await createSchemasFromOptions({
                pkgPath: pkgJsonPath,
                flags: { namespace: "dev", sourceType: "moodle-local", sourcePath: os.tmpdir(), outDir: "src/moodle" },
                generatorRunner: runner,
            });

            expect(runner).toHaveBeenCalledWith(pkgJsonPath, { forceNamespaces: ["dev"], sources: { dev: { type: "moodle-local", path: os.tmpdir() } } });
            expect(JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))["moodle-client"][0].source).toEqual({ type: "moodle-local" });
        });

        it("should take the path of a local namespace from MOODLE_<NAMESPACE>_PATH", async () => {
            await fs.writeFile(pkgJsonPath, JSON.stringify({ name: "my-app" }, null, 2), "utf-8");
            const runner = vi.fn().mockResolvedValue(undefined);
            await createSchemasFromOptions({
                pkgPath: pkgJsonPath,
                flags: { namespace: "dev", sourceType: "moodle-local", outDir: "src/moodle" },
                env: { MOODLE_DEV_PATH: os.tmpdir() },
                generatorRunner: runner,
            });
            expect(runner.mock.calls[0]![1].sources).toEqual({ dev: { type: "moodle-local", path: os.tmpdir() } });
        });

        it("should fail with ERR_LOCAL_PATH_REQUIRED for a local namespace without path nor terminal, leaving package.json untouched", async () => {
            const raw = JSON.stringify({ name: "my-app" }, null, 2);
            await fs.writeFile(pkgJsonPath, raw, "utf-8");
            const runner = vi.fn();
            const wasTTY = process.stdin.isTTY;
            process.stdin.isTTY = false;
            try {
                await expect(
                    createSchemasFromOptions({ pkgPath: pkgJsonPath, flags: { namespace: "dev", sourceType: "moodle-local", outDir: "src/moodle" }, env: {}, generatorRunner: runner })
                ).rejects.toMatchObject({ code: "ERR_LOCAL_PATH_REQUIRED" });
            } finally {
                process.stdin.isTTY = wasTTY;
            }
            expect(runner).not.toHaveBeenCalled();
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });

        it("should reject a namespace that would share the path variable of an existing one, without touching package.json", async () => {
            const initial = { name: "my-app", "moodle-client": [{ namespace: "localDev", source: { type: "moodle-local" }, webservices: ["*"], outDir: "src/moodle" }] };
            const raw = JSON.stringify(initial, null, 2);
            await fs.writeFile(pkgJsonPath, raw, "utf-8");
            const runner = vi.fn();

            await expect(
                createSchemasFromOptions({
                    pkgPath: pkgJsonPath,
                    flags: { namespace: "LocalDev", sourceType: "moodle-official", sourceVersion: "4.5" },
                    generatorRunner: runner,
                })
            ).rejects.toThrow(/--namespace: Namespace 'LocalDev' would share the environment variable MOODLE_LOCALDEV_PATH with 'localDev'/);
            expect(runner).not.toHaveBeenCalled();
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });

        it("should reject a namespace that already exists without touching package.json", async () => {
            const initial = { name: "my-app", "moodle-client": [{ namespace: "funiber", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"] }] };
            const raw = JSON.stringify(initial, null, 2);
            await fs.writeFile(pkgJsonPath, raw, "utf-8");
            const runner = vi.fn();

            await expect(
                createSchemasFromOptions({
                    pkgPath: pkgJsonPath,
                    flags: { namespace: "funiber", sourceType: "moodle-official", sourceVersion: "4.4" },
                    generatorRunner: runner,
                })
            ).rejects.toThrow(/already exists/);
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
            expect(runner).not.toHaveBeenCalled();
        });

        it("should roll back package.json when generation fails", async () => {
            const raw = JSON.stringify({ name: "my-app" }, null, 2);
            await fs.writeFile(pkgJsonPath, raw, "utf-8");

            await expect(
                createSchemasFromOptions({
                    pkgPath: pkgJsonPath,
                    flags: { namespace: "moodle45", sourceType: "moodle-official", sourceVersion: "4.5" },
                    generatorRunner: vi.fn().mockRejectedValue(new Error("clone failed")),
                })
            ).rejects.toThrow("clone failed");
            expect(await fs.readFile(pkgJsonPath, "utf-8")).toBe(raw);
        });
    });
});
