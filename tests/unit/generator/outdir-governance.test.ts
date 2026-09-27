import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import * as configManager from "../../../src/generator/config/config-manager";
import * as downloader from "../../../src/generator/downloader/moodle-downloader";
import { extractWebservice } from "@didactika/moodle-client-schemas";
import {
    hasExistingSchemas,
    selectiveCleanNamespace,
    runGenerator,
} from "../../../src/generator/runner";

vi.mock("@didactika/moodle-client-schemas", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@didactika/moodle-client-schemas")>();
    return {
        ...actual,
        extractWebservice: vi.fn(),
    };
});

describe("outDir Governance, Detection & Selective Cleanup", () => {
    let tempDir: string;
    let nodeModulesDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-outdir-governance-test-"));
        nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        await fs.mkdir(path.join(nodeModulesDir, "dist"), { recursive: true });
        await fs.writeFile(
            path.join(nodeModulesDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client", version: "2.3.4" }),
            "utf-8"
        );
        await fs.writeFile(path.join(nodeModulesDir, "dist/index.d.ts"), "// index\n", "utf-8");

        vi.clearAllMocks();
        vi.restoreAllMocks();

        vi.spyOn(downloader, "cloneMoodleVersion").mockResolvedValue(
            path.join(tempDir, "cloned-moodle")
        );
        vi.spyOn(downloader, "cleanupMoodleDirectory").mockResolvedValue();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    describe("hasExistingSchemas (Recursive & Dual-Factor Check)", () => {
        it("should return false when directory does not exist", async () => {
            const nonExistent = path.join(tempDir, "does-not-exist");
            expect(await hasExistingSchemas(nonExistent)).toBe(false);
        });

        it("should return false when directory exists but is completely empty", async () => {
            const emptyDir = path.join(tempDir, "empty-dir");
            await fs.mkdir(emptyDir, { recursive: true });
            expect(await hasExistingSchemas(emptyDir)).toBe(false);
        });

        it("should return false when directory contains subdirectories but no .webservice.d.ts files", async () => {
            const dirWithEmptySubdirs = path.join(tempDir, "subdirs-dir");
            await fs.mkdir(path.join(dirWithEmptySubdirs, "core/course"), { recursive: true });
            await fs.mkdir(path.join(dirWithEmptySubdirs, "mod/assign"), { recursive: true });
            expect(await hasExistingSchemas(dirWithEmptySubdirs)).toBe(false);
        });

        it("should return false when directory has only an index.d.ts but no .webservice.d.ts files", async () => {
            const dirOnlyIndex = path.join(tempDir, "only-index");
            await fs.mkdir(dirOnlyIndex, { recursive: true });
            await fs.writeFile(path.join(dirOnlyIndex, "index.d.ts"), "export {};\n", "utf-8");
            expect(await hasExistingSchemas(dirOnlyIndex)).toBe(false);
        });

        it("should return false when index.d.ts is 0 bytes (corrupted file)", async () => {
            const dirCorruptIndex = path.join(tempDir, "corrupt-index");
            await fs.mkdir(path.join(dirCorruptIndex, "core/course"), { recursive: true });
            await fs.writeFile(
                path.join(dirCorruptIndex, "core/course/get_courses.webservice.d.ts"),
                "export interface Test {}",
                "utf-8"
            );
            // 0-byte index.d.ts
            await fs.writeFile(path.join(dirCorruptIndex, "index.d.ts"), "", "utf-8");

            expect(await hasExistingSchemas(dirCorruptIndex)).toBe(false);
        });

        it("should return false when directory has .webservice.d.ts files but index.d.ts is missing", async () => {
            const dirMissingIndex = path.join(tempDir, "missing-index");
            await fs.mkdir(path.join(dirMissingIndex, "core/course"), { recursive: true });
            await fs.writeFile(
                path.join(dirMissingIndex, "core/course/get_courses.webservice.d.ts"),
                "export interface Test {}",
                "utf-8"
            );

            expect(await hasExistingSchemas(dirMissingIndex)).toBe(false);
        });

        it("should return true when directory has both non-empty index.d.ts and .webservice.d.ts in subdirectories", async () => {
            const validDir = path.join(tempDir, "valid-schemas");
            await fs.mkdir(path.join(validDir, "core/course"), { recursive: true });
            await fs.writeFile(
                path.join(validDir, "core/course/get_courses.webservice.d.ts"),
                "export interface CoreCourseGetCoursesParams {}",
                "utf-8"
            );
            await fs.writeFile(
                path.join(validDir, "index.d.ts"),
                "export * from './core/course/get_courses.webservice';\n",
                "utf-8"
            );

            expect(await hasExistingSchemas(validDir)).toBe(true);
        });
    });

    describe("selectiveCleanNamespace (Non-destructive cleanup & Pruning)", () => {
        it("should delete all .webservice.d.ts and index files while strictly preserving user files", async () => {
            const nsDir = path.join(tempDir, "schemas/test-ns");
            await fs.mkdir(path.join(nsDir, "core/course"), { recursive: true });
            await fs.mkdir(path.join(nsDir, "core/notes"), { recursive: true });

            // Generator-owned files
            const ws1 = path.join(nsDir, "core/course/get_courses.webservice.d.ts");
            const indexDts = path.join(nsDir, "index.d.ts");
            const indexDmts = path.join(nsDir, "index.d.mts");
            await fs.writeFile(ws1, "// ws", "utf-8");
            await fs.writeFile(indexDts, "// index", "utf-8");
            await fs.writeFile(indexDmts, "// index mts", "utf-8");

            // User-owned files
            const userReadme = path.join(nsDir, "README.md");
            const userNotes = path.join(nsDir, "core/notes/developer-notes.txt");
            const customTypes = path.join(nsDir, "core/course/custom-augmentations.d.ts");
            await fs.writeFile(userReadme, "# Documentation", "utf-8");
            await fs.writeFile(userNotes, "Custom notes", "utf-8");
            await fs.writeFile(customTypes, "export type MyType = string;", "utf-8");

            await selectiveCleanNamespace(nsDir);

            // Generated files must be deleted
            expect(await fs.access(ws1).then(() => true).catch(() => false)).toBe(false);
            expect(await fs.access(indexDts).then(() => true).catch(() => false)).toBe(false);
            expect(await fs.access(indexDmts).then(() => true).catch(() => false)).toBe(false);

            // User files must be strictly preserved
            expect(await fs.access(userReadme).then(() => true).catch(() => false)).toBe(true);
            expect(await fs.access(userNotes).then(() => true).catch(() => false)).toBe(true);
            expect(await fs.access(customTypes).then(() => true).catch(() => false)).toBe(true);

            // Subdirectories containing user files must be preserved
            expect(await fs.access(path.join(nsDir, "core/notes")).then(() => true).catch(() => false)).toBe(true);
            expect(await fs.access(path.join(nsDir, "core/course")).then(() => true).catch(() => false)).toBe(true);
            // Root namespace directory must be preserved
            expect(await fs.access(nsDir).then(() => true).catch(() => false)).toBe(true);
        });

        it("should prune empty intermediate subdirectories when all webservice files are deleted", async () => {
            const nsDir = path.join(tempDir, "schemas/pruning-ns");
            await fs.mkdir(path.join(nsDir, "core/course"), { recursive: true });

            const ws = path.join(nsDir, "core/course/action.webservice.d.ts");
            await fs.writeFile(ws, "// ws", "utf-8");

            await selectiveCleanNamespace(nsDir);

            // The empty course and core subdirectories must be pruned
            expect(await fs.access(path.join(nsDir, "core/course")).then(() => true).catch(() => false)).toBe(false);
            expect(await fs.access(path.join(nsDir, "core")).then(() => true).catch(() => false)).toBe(false);
            // Namespace root remains
            expect(await fs.access(nsDir).then(() => true).catch(() => false)).toBe(true);
        });
    });

    describe("Multi-Namespace Isolation & Orchestration in runGenerator", () => {
        it("should skip extraction for a namespace with existing schemas, but trigger extraction for an empty/corrupt namespace", async () => {
            const outDir = path.join(tempDir, "schemas");
            const legacyDir = path.join(outDir, "legacy");
            const defaultDir = path.join(outDir, "default");

            // Setup valid schemas for 'legacy'
            await fs.mkdir(path.join(legacyDir, "core/course"), { recursive: true });
            await fs.writeFile(
                path.join(legacyDir, "core/course/get_courses.webservice.d.ts"),
                "export interface CoreCourseGetCoursesParams {}",
                "utf-8"
            );
            await fs.writeFile(
                path.join(legacyDir, "index.d.ts"),
                "export * from './core/course/get_courses.webservice';\n",
                "utf-8"
            );

            // Setup empty/corrupted directory for 'default' (exists, but 0 .webservice.d.ts)
            await fs.mkdir(defaultDir, { recursive: true });
            await fs.writeFile(path.join(defaultDir, "user-notes.txt"), "notes", "utf-8");

            const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
                {
                    namespace: "legacy",
                    source: { type: "local", path: path.join(tempDir, "local-moodle") },
                    webservices: ["core_course_*"],
                    outDir: "./schemas",
                },
                {
                    namespace: "default",
                    source: { type: "local", path: path.join(tempDir, "local-moodle") },
                    webservices: ["mod_assign_*"],
                    outDir: "./schemas",
                },
            ];

            vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);

            const fakeDefaultSchemas = [
                {
                    name: "mod_assign_get_assignments",
                    description: "Get assignments",
                    parameters: { kind: "parameters", keys: {} },
                    returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
                },
            ];

            vi.mocked(extractWebservice).mockResolvedValue({
                schemas: fakeDefaultSchemas as any,
                errors: [],
            });

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                await runGenerator(undefined, { silent: true });
            } finally {
                process.chdir(originalCwd);
            }

            // extractWebservice should have been called ONLY for 'default', NOT for 'legacy'
            expect(extractWebservice).toHaveBeenCalledTimes(1);
            expect(extractWebservice).toHaveBeenCalledWith(
                expect.objectContaining({ services: ["mod_assign_*"] })
            );

            // User notes in defaultDir must have been preserved during regeneration!
            expect(await fs.access(path.join(defaultDir, "user-notes.txt")).then(() => true).catch(() => false)).toBe(true);

            // 'default' namespace should now have generated schema
            const defaultWs = path.join(defaultDir, "mod/assign/get_assignments.webservice.d.ts");
            expect(await fs.access(defaultWs).then(() => true).catch(() => false)).toBe(true);

            // Master barrel in schemas/index.d.ts aggregates both namespaces
            const masterDts = await fs.readFile(path.join(outDir, "index.d.ts"), "utf-8");
            expect(masterDts).toContain("legacy: LegacyGeneratedServices;");
            expect(masterDts).toContain("default: DefaultGeneratedServices;");
        });

        it("should selectively clean and regenerate when force is true without deleting user files in outDir", async () => {
            const outDir = path.join(tempDir, "schemas");
            const legacyDir = path.join(outDir, "legacy");

            // Setup valid schemas with a user file
            await fs.mkdir(path.join(legacyDir, "core/course"), { recursive: true });
            await fs.writeFile(
                path.join(legacyDir, "core/course/old_course.webservice.d.ts"),
                "export interface OldCourseParams {}",
                "utf-8"
            );
            await fs.writeFile(path.join(legacyDir, "index.d.ts"), "export {};\n", "utf-8");

            const userFile = path.join(legacyDir, "my-custom-doc.md");
            await fs.writeFile(userFile, "# Custom Doc", "utf-8");

            const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
                {
                    namespace: "legacy",
                    source: { type: "local", path: path.join(tempDir, "local-moodle") },
                    webservices: ["core_course_*"],
                    outDir: "./schemas",
                },
            ];

            vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);

            const fakeNewSchemas = [
                {
                    name: "core_course_get_courses",
                    description: "New courses",
                    parameters: { kind: "parameters", keys: {} },
                    returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
                },
            ];

            vi.mocked(extractWebservice).mockResolvedValue({
                schemas: fakeNewSchemas as any,
                errors: [],
            });

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                await runGenerator(undefined, { silent: true, force: true });
            } finally {
                process.chdir(originalCwd);
            }

            // Old webservice was cleaned
            const oldWs = path.join(legacyDir, "core/course/old_course.webservice.d.ts");
            expect(await fs.access(oldWs).then(() => true).catch(() => false)).toBe(false);

            // User file was strictly preserved!
            expect(await fs.access(userFile).then(() => true).catch(() => false)).toBe(true);

            // New webservice was generated
            const newWs = path.join(legacyDir, "core/course/get_courses.webservice.d.ts");
            expect(await fs.access(newWs).then(() => true).catch(() => false)).toBe(true);
        });
    });

    describe("Unmanaged Folder Protection & Contrast with package.json", () => {
        it("should leave unmanaged directories in outDir completely untouched", async () => {
            const outDir = path.join(tempDir, "schemas");
            const unmanagedDir = path.join(outDir, "custom-helpers");
            await fs.mkdir(unmanagedDir, { recursive: true });

            const unmanagedFile = path.join(unmanagedDir, "my-helper.ts");
            await fs.writeFile(unmanagedFile, "export const helper = 42;", "utf-8");

            const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
                {
                    namespace: "legacy",
                    source: { type: "local", path: path.join(tempDir, "local-moodle") },
                    webservices: ["core_course_*"],
                    outDir: "./schemas",
                },
            ];

            vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);

            vi.mocked(extractWebservice).mockResolvedValue({
                schemas: [
                    {
                        name: "core_course_get_courses",
                        description: "Get courses",
                        parameters: { kind: "parameters", keys: {} },
                        returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
                    },
                ] as any,
                errors: [],
            });

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                await runGenerator(undefined, { silent: true, force: true });
            } finally {
                process.chdir(originalCwd);
            }

            // Unmanaged directory and file must remain 100% untouched
            expect(await fs.access(unmanagedFile).then(() => true).catch(() => false)).toBe(true);
            const content = await fs.readFile(unmanagedFile, "utf-8");
            expect(content).toBe("export const helper = 42;");

            // Master barrel must ONLY contain the configured namespace 'legacy'
            const masterDts = await fs.readFile(path.join(outDir, "index.d.ts"), "utf-8");
            expect(masterDts).toContain("legacy: LegacyGeneratedServices;");
            expect(masterDts).not.toContain("custom-helpers");
        });
    });

    describe("Default Schemas and Missing outDir Governance", () => {
        it("should skip generation when outDir is not defined and schemas already exist in library", async () => {
            const wsDistDir = path.join(nodeModulesDir, "dist/schemas/webservice");
            await fs.mkdir(wsDistDir, { recursive: true });
            await fs.writeFile(path.join(wsDistDir, "index.d.ts"), "export {};\n", "utf-8");
            await fs.writeFile(
                path.join(wsDistDir, "core_course_get_courses.webservice.d.ts"),
                "export interface CoreCourseGetCoursesParams {};\n",
                "utf-8"
            );

            const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
                {
                    namespace: "webservice",
                    source: { type: "moodle-official", version: "4.5" },
                    webservices: ["*"],
                    outDir: undefined,
                },
            ];

            vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);
            const extractSpy = vi.mocked(extractWebservice);
            extractSpy.mockClear();

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                await runGenerator(undefined, { silent: true, force: false });
            } finally {
                process.chdir(originalCwd);
            }

            expect(extractSpy).not.toHaveBeenCalled();
        });

        it("should re-generate when force is true even when outDir is not defined", async () => {
            const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
                {
                    namespace: "webservice",
                    source: { type: "moodle-official", version: "4.5" },
                    webservices: ["*"],
                    outDir: undefined,
                },
            ];

            vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);
            const extractSpy = vi.mocked(extractWebservice).mockResolvedValue({
                schemas: [
                    {
                        name: "core_course_get_courses",
                        description: "Get courses",
                        parameters: { kind: "parameters", keys: {} },
                        returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
                    },
                ] as any,
                errors: [],
            });

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                await runGenerator(undefined, { silent: true, force: true });
            } finally {
                process.chdir(originalCwd);
            }

            expect(extractSpy).toHaveBeenCalled();
        });

        it("should auto-inject default configuration into package.json and run without outDir", async () => {
            const wsDistDir = path.join(nodeModulesDir, "dist/schemas/webservice");
            await fs.mkdir(wsDistDir, { recursive: true });
            await fs.writeFile(path.join(wsDistDir, "index.d.ts"), "export {};\n", "utf-8");
            await fs.writeFile(
                path.join(wsDistDir, "core_course_get_courses.webservice.d.ts"),
                "export interface CoreCourseGetCoursesParams {};\n",
                "utf-8"
            );

            const pkgJsonPath = path.join(tempDir, "package.json");
            await fs.writeFile(
                pkgJsonPath,
                JSON.stringify({ name: "unconfigured-app", version: "1.0.0" }, null, 2),
                "utf-8"
            );

            const extractSpy = vi.mocked(extractWebservice);
            extractSpy.mockClear();

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                await runGenerator(undefined, { silent: true, force: false });
            } finally {
                process.chdir(originalCwd);
            }

            const updatedPkg = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            expect(updatedPkg["moodle-client"]).toBeDefined();
            expect(updatedPkg["moodle-client"]).toEqual([
                {
                    namespace: "webservice",
                    source: {
                        type: "moodle-official",
                        version: "4.5",
                    },
                    webservices: ["*"],
                },
            ]);

            expect(extractSpy).not.toHaveBeenCalled();
        });
    });
});
