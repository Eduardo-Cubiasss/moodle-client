import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import * as configManager from "../../../src/generator/config/config-manager";
import * as downloader from "../../../src/generator/downloader/moodle-downloader";
import { extractWebservice } from "@didactika/moodle-client-schemas";
import { runGenerator } from "../../../src/generator/runner";

vi.mock("@didactika/moodle-client-schemas", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@didactika/moodle-client-schemas")>();
    return {
        ...actual,
        extractWebservice: vi.fn(),
    };
});

describe("Runner Multi-Schema Orchestration (p-limit: 2)", () => {
    let tempDir: string;
    let mockPkgDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-multi-runner-test-"));
        mockPkgDir = path.join(tempDir, "pkg");
        await fs.mkdir(path.join(mockPkgDir, "dist"), { recursive: true });
        await fs.writeFile(
            path.join(mockPkgDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client", version: "2.2.5" }),
            "utf-8"
        );
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("should process multiple schemas concurrently with p-limit(2) and generate per-schema directories and master barrel", async () => {
        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "legacy",
                source: {
                    type: "local",
                    path: path.join(tempDir, "local-moodle"),
                },
                webservices: ["core_course_*"],
                outDir: "./schemas/local",
            },
            {
                namespace: "default",
                source: {
                    type: "moodle-official",
                    version: "4.4",
                },
                webservices: ["core_user_*"],
                outDir: "./schemas/v4.4",
            },
        ];

        vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);
        const cloneSpy = vi
            .spyOn(downloader, "cloneMoodleVersion")
            .mockResolvedValue(path.join(tempDir, "cloned-moodle"));
        const cleanupSpy = vi.spyOn(downloader, "cleanupMoodleDirectory").mockResolvedValue();

        const fakeCourseSchemas = [
            {
                name: "core_course_get_courses",
                description: "Get courses",
                parameters: { kind: "parameters", keys: {} },
                returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
            },
        ];

        const fakeUserSchemas = [
            {
                name: "core_user_get_users",
                description: "Get users",
                parameters: { kind: "parameters", keys: {} },
                returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
            },
        ];

        vi.mocked(extractWebservice).mockImplementation(async (opts) => {
            if (opts.services && opts.services[0] === "core_course_*") {
                return { schemas: fakeCourseSchemas as any, errors: [] };
            }
            return { schemas: fakeUserSchemas as any, errors: [] };
        });

        // Setup mock node_modules/@didactika/moodle-client
        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        await fs.mkdir(path.join(nodeModulesDir, "dist"), { recursive: true });
        await fs.writeFile(
            path.join(nodeModulesDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client" }),
            "utf-8"
        );
        await fs.writeFile(path.join(nodeModulesDir, "dist/index.d.ts"), "// index\n", "utf-8");

        const originalCwd = process.cwd();
        try {
            process.chdir(tempDir);
            await runGenerator(undefined, { silent: true });
        } finally {
            process.chdir(originalCwd);
        }

        // Verify clone was only called for official source, not local
        expect(cloneSpy).toHaveBeenCalledTimes(1);
        expect(cloneSpy).toHaveBeenCalledWith("4.4", expect.any(String));
        expect(cleanupSpy).toHaveBeenCalledTimes(1);

        // Verify extraction called for both configurations
        expect(extractWebservice).toHaveBeenCalledTimes(2);

        // Verify output directories inside node_modules/@didactika/moodle-client/dist/schemas/{name}/
        const targetSchemasDir = path.join(nodeModulesDir, "dist/schemas");
        const legacyIndex = path.join(targetSchemasDir, "legacy/index.d.ts");
        const defaultIndex = path.join(targetSchemasDir, "default/index.d.ts");
        expect(await fs.access(legacyIndex).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(defaultIndex).then(() => true).catch(() => false)).toBe(true);

        // Verify master barrel inside dist/schemas/index.d.ts exports namespaces with JSDocs
        const masterBarrel = await fs.readFile(path.join(targetSchemasDir, "index.d.ts"), "utf-8");
        expect(masterBarrel).toContain("legacy:");
        expect(masterBarrel).toContain("default:");
        expect(masterBarrel).toContain("export interface GeneratedMoodleServices");
        expect(masterBarrel).toContain("Moodle web services namespace 'legacy'.");
        expect(masterBarrel).toContain("Moodle web services namespace 'default'.");
        expect(masterBarrel).toContain("LegacyGeneratedServices");
        expect(masterBarrel).toContain("DefaultGeneratedServices");

        // Verify index.d.mts exists in master barrel and in sub-barrels
        const masterBarrelMts = path.join(targetSchemasDir, "index.d.mts");
        expect(await fs.access(masterBarrelMts).then(() => true).catch(() => false)).toBe(true);
        const legacyMts = path.join(targetSchemasDir, "legacy/index.d.mts");
        expect(await fs.access(legacyMts).then(() => true).catch(() => false)).toBe(true);

        // Verify sub-barrels do NOT contain direct MoodleClient module augmentation
        const legacyContent = await fs.readFile(legacyIndex, "utf-8");
        expect(legacyContent).not.toContain('declare module "@didactika/moodle-client"');

        // Verify output directories in project outDir/[name]/
        const outDirLegacy = path.join(tempDir, "schemas/local/legacy/index.d.ts");
        const outDirDefault = path.join(tempDir, "schemas/v4.4/default/index.d.ts");
        expect(await fs.access(outDirLegacy).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(outDirDefault).then(() => true).catch(() => false)).toBe(true);

        // Verify outDir root master barrel
        const outDirMasterDts = path.join(tempDir, "schemas/local/index.d.ts");
        const outDirMasterTs = path.join(tempDir, "schemas/local/index.ts");
        expect(await fs.access(outDirMasterDts).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(outDirMasterTs).then(() => true).catch(() => false)).toBe(true);
    });

    it("should skip extraction and sync existing schemas when outDir/[name] already contains schemas and force is false", async () => {
        const outDir = path.join(tempDir, "schemas/local/legacy");
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.d.ts"), "export const cached = true;\n", "utf-8");

        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "legacy",
                source: {
                    type: "local",
                    path: path.join(tempDir, "local-moodle"),
                },
                webservices: ["*"],
                outDir: "./schemas/local",
            },
        ];

        vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);

        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        await fs.mkdir(path.join(nodeModulesDir, "dist"), { recursive: true });
        await fs.writeFile(
            path.join(nodeModulesDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client" }),
            "utf-8"
        );
        await fs.writeFile(path.join(nodeModulesDir, "dist/index.d.ts"), "// index\n", "utf-8");

        const originalCwd = process.cwd();
        try {
            process.chdir(tempDir);
            await runGenerator(undefined, { silent: true, force: false });
        } finally {
            process.chdir(originalCwd);
        }

        expect(extractWebservice).not.toHaveBeenCalled();

        const targetSchemasDir = path.join(nodeModulesDir, "dist/schemas/legacy");
        const syncedIndex = path.join(targetSchemasDir, "index.d.ts");
        expect(await fs.access(syncedIndex).then(() => true).catch(() => false)).toBe(true);
    });

    it("should bypass outDir cache and regenerate when force is true", async () => {
        const outDir = path.join(tempDir, "schemas/local/legacy");
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.d.ts"), "export const old = true;\n", "utf-8");

        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "legacy",
                source: {
                    type: "local",
                    path: path.join(tempDir, "local-moodle"),
                },
                webservices: ["core_course_*"],
                outDir: "./schemas/local",
            },
        ];

        vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);

        const fakeCourseSchemas = [
            {
                name: "core_course_get_courses",
                description: "Get courses",
                parameters: { kind: "parameters", keys: {} },
                returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
            },
        ];

        vi.mocked(extractWebservice).mockResolvedValue({
            schemas: fakeCourseSchemas as any,
            errors: [],
        });

        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        await fs.mkdir(path.join(nodeModulesDir, "dist"), { recursive: true });
        await fs.writeFile(
            path.join(nodeModulesDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client" }),
            "utf-8"
        );
        await fs.writeFile(path.join(nodeModulesDir, "dist/index.d.ts"), "// index\n", "utf-8");

        const originalCwd = process.cwd();
        try {
            process.chdir(tempDir);
            await runGenerator(undefined, { silent: true, force: true });
        } finally {
            process.chdir(originalCwd);
        }

        expect(extractWebservice).toHaveBeenCalled();

        const targetSchemasDir = path.join(nodeModulesDir, "dist/schemas/legacy");
        const courseDir = path.join(targetSchemasDir, "core/course");
        const generatedFiles = await fs.readdir(courseDir);
        expect(generatedFiles.some((f) => f.startsWith("get_courses.webservice"))).toBe(true);
    });
});
