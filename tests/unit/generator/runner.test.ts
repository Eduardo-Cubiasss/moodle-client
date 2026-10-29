import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import * as configManager from "../../../src/generator/config/config-manager";
import * as downloader from "../../../src/generator/downloader/moodle-downloader";
import { extractWebservice } from "@didactika/moodle-client-schemas";
import { runGenerator, generateMasterBarrel, planExtraction } from "../../../src/generator/runner";

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
                    type: "moodle-local",
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
        expect(masterBarrel).toContain('export type * as legacy from "./legacy/index";');
        expect(masterBarrel).toContain('export type * as default from "./default/index";');

        // Verify index.d.mts exists in master barrel and in sub-barrels
        const masterBarrelMts = path.join(targetSchemasDir, "index.d.mts");
        expect(await fs.access(masterBarrelMts).then(() => true).catch(() => false)).toBe(true);
        const legacyMts = path.join(targetSchemasDir, "legacy/index.d.mts");
        expect(await fs.access(legacyMts).then(() => true).catch(() => false)).toBe(true);

        // Verify sub-barrels do NOT contain direct MoodleClient module augmentation
        const legacyContent = await fs.readFile(legacyIndex, "utf-8");
        expect(legacyContent).not.toContain('declare module "@didactika/moodle-client"');

        // Verify output directories in project outDir/[name]/ (only index.d.ts, no index.d.mts)
        const outDirLegacy = path.join(tempDir, "schemas/local/legacy/index.d.ts");
        const outDirLegacyMts = path.join(tempDir, "schemas/local/legacy/index.d.mts");
        const outDirDefault = path.join(tempDir, "schemas/v4.4/default/index.d.ts");
        expect(await fs.access(outDirLegacy).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(outDirLegacyMts).then(() => true).catch(() => false)).toBe(false);
        expect(await fs.access(outDirDefault).then(() => true).catch(() => false)).toBe(true);

        // Verify outDir root master barrel (only index.d.ts, no .ts and no .d.mts)
        const outDirMasterDts = path.join(tempDir, "schemas/local/index.d.ts");
        const outDirMasterMts = path.join(tempDir, "schemas/local/index.d.mts");
        const outDirMasterTs = path.join(tempDir, "schemas/local/index.ts");
        expect(await fs.access(outDirMasterDts).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(outDirMasterMts).then(() => true).catch(() => false)).toBe(false);
        expect(await fs.access(outDirMasterTs).then(() => true).catch(() => false)).toBe(false);
    });

    it("should skip extraction and sync existing schemas when outDir/[name] already contains schemas and force is false", async () => {
        const outDir = path.join(tempDir, "schemas/local/legacy");
        await fs.mkdir(path.join(outDir, "core/course"), { recursive: true });
        await fs.writeFile(
            path.join(outDir, "core/course/get_courses.webservice.d.ts"),
            "export interface CoreCourseGetCourses { id: number; }\n",
            "utf-8"
        );
        await fs.writeFile(path.join(outDir, "index.d.ts"), "export const cached = true;\n", "utf-8");

        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "legacy",
                source: {
                    type: "moodle-local",
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

    it("should strip the direct MoodleClient augmentation left in outDir caches by pre-release moodle-client-schemas builds", async () => {
        const outDir = path.join(tempDir, "schemas/local/legacy");
        await fs.mkdir(path.join(outDir, "core/course"), { recursive: true });
        await fs.writeFile(
            path.join(outDir, "core/course/get_courses.webservice.d.ts"),
            "export interface CoreCourseGetCoursesParams {}\nexport type CoreCourseGetCoursesReturns = unknown;\n",
            "utf-8"
        );
        await fs.writeFile(
            path.join(outDir, "index.d.ts"),
            'export interface GeneratedMoodleServices {\n}\n\ndeclare module "@didactika/moodle-client" {\n    interface MoodleClient extends GeneratedMoodleServices {}\n}\n',
            "utf-8"
        );

        vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue([
            {
                namespace: "legacy",
                source: { type: "moodle-local", path: path.join(tempDir, "local-moodle") },
                webservices: ["*"],
                outDir: "./schemas/local",
            },
        ]);

        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        await fs.mkdir(path.join(nodeModulesDir, "dist"), { recursive: true });
        await fs.writeFile(path.join(nodeModulesDir, "package.json"), JSON.stringify({ name: "@didactika/moodle-client" }), "utf-8");
        await fs.writeFile(path.join(nodeModulesDir, "dist/index.d.ts"), "// index\n", "utf-8");

        const originalCwd = process.cwd();
        try {
            process.chdir(tempDir);
            await runGenerator(undefined, { silent: true, force: false });
        } finally {
            process.chdir(originalCwd);
        }

        const synced = await fs.readFile(path.join(nodeModulesDir, "dist/schemas/legacy/index.d.ts"), "utf-8");
        expect(synced).toContain("export interface GeneratedMoodleServices");
        expect(synced).not.toContain("declare module");
    });

    describe("invalid entries of other namespaces", () => {
        const writeConfig = async (entries: unknown[]) => {
            const pkgPath = path.join(tempDir, "package.json");
            await fs.writeFile(pkgPath, JSON.stringify({ name: "app", "moodle-client": entries }, null, 2), "utf-8");
            return pkgPath;
        };
        const valid = () => ({ namespace: "good", source: { type: "moodle-local", path: path.join(tempDir, "local-moodle") }, webservices: ["*"], outDir: "./schemas/local" });
        const legacy = { namespace: "old", source: { type: "repository", url: "https://a/b.git" }, webservices: ["*"], outDir: "./schemas/local" };

        it("should fail a full run on any invalid entry", async () => {
            const pkgPath = await writeConfig([valid(), legacy]);
            await expect(runGenerator(pkgPath, { silent: true })).rejects.toMatchObject({ code: "ERR_CONFIG_INVALID_SOURCE_TYPE" });
        });

        it("should skip them in a targeted run, keeping their installed schemas, and process the target", async () => {
            const pkgPath = await writeConfig([valid(), legacy]);
            vi.mocked(extractWebservice).mockResolvedValue({ schemas: [], errors: [] });
            const loadSpy = vi.spyOn(configManager, "loadPackageConfig");

            const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
            const oldDist = path.join(nodeModulesDir, "dist/schemas/old/core/user");
            await fs.mkdir(oldDist, { recursive: true });
            await fs.writeFile(path.join(oldDist, "get_users.webservice.d.ts"), "export interface Kept {}\n", "utf-8");
            await fs.writeFile(path.join(nodeModulesDir, "dist/schemas/old/index.d.ts"), "export interface GeneratedMoodleServices {}\n", "utf-8");
            await fs.writeFile(path.join(nodeModulesDir, "package.json"), JSON.stringify({ name: "@didactika/moodle-client" }), "utf-8");
            await fs.mkdir(path.join(tempDir, "local-moodle"), { recursive: true });
            await fs.writeFile(path.join(tempDir, "local-moodle/version.php"), "<?php\n", "utf-8");

            const originalCwd = process.cwd();
            let result;
            try {
                process.chdir(tempDir);
                result = await runGenerator(pkgPath, {
                    silent: true,
                    forceNamespaces: ["good"],
                    sources: { good: { type: "moodle-local", path: path.join(tempDir, "local-moodle") } },
                });
            } finally {
                process.chdir(originalCwd);
            }

            expect(loadSpy).not.toHaveBeenCalled();
            expect(result.skipped).toEqual([{ namespace: "old", reason: expect.stringContaining("Use 'moodle-repository' instead") }]);
            expect(await fs.readFile(path.join(oldDist, "get_users.webservice.d.ts"), "utf-8")).toBe("export interface Kept {}\n");
            const master = await fs.readFile(path.join(nodeModulesDir, "dist/schemas/index.d.ts"), "utf-8");
            expect(master).toContain("good:");
            expect(master).toContain("old:");
        });

        it("should still fail when the targeted namespace itself is invalid", async () => {
            const pkgPath = await writeConfig([valid(), legacy]);
            await expect(runGenerator(pkgPath, { silent: true, forceNamespaces: ["old"] })).rejects.toMatchObject({
                code: "ERR_CONFIG_INVALID_SOURCE_TYPE",
            });
        });
    });

    describe("bundled namespace", () => {
        async function setupPackage(): Promise<string> {
            const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
            const bundledDir = path.join(nodeModulesDir, "dist/schemas/webservice/core/user");
            await fs.mkdir(bundledDir, { recursive: true });
            await fs.writeFile(path.join(bundledDir, "get_users.webservice.d.ts"), "export interface Bundled {}\n", "utf-8");
            await fs.writeFile(path.join(nodeModulesDir, "dist/schemas/webservice/index.d.ts"), "export interface GeneratedMoodleServices {}\n", "utf-8");
            await fs.writeFile(path.join(nodeModulesDir, "package.json"), JSON.stringify({ name: "@didactika/moodle-client" }), "utf-8");
            return nodeModulesDir;
        }

        it("should keep the bundled schemas and expose them in the master barrel with no configuration", async () => {
            const nodeModulesDir = await setupPackage();
            const pkgPath = path.join(tempDir, "package.json");
            await fs.writeFile(pkgPath, JSON.stringify({ name: "app" }), "utf-8");

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                await runGenerator(pkgPath, { silent: true });
            } finally {
                process.chdir(originalCwd);
            }

            expect(await fs.readFile(path.join(nodeModulesDir, "dist/schemas/webservice/core/user/get_users.webservice.d.ts"), "utf-8")).toBe("export interface Bundled {}\n");
            const master = await fs.readFile(path.join(nodeModulesDir, "dist/schemas/index.d.ts"), "utf-8");
            expect(master).toContain("webservice: WebserviceGeneratedServices;");
            expect(master).toContain("Source: bundled with @didactika/moodle-client (Moodle 4.5)");
            expect(extractWebservice).not.toHaveBeenCalled();
        });

        it.each([
            ["a full run", undefined],
            ["a run targeting another namespace", ["good"]],
        ])("should fail %s when package.json declares 'webservice', recommending its removal", async (_label, forceNamespaces) => {
            const pkgPath = path.join(tempDir, "package.json");
            await fs.writeFile(
                pkgPath,
                JSON.stringify({
                    name: "app",
                    "moodle-client": [
                        { namespace: "good", source: { type: "moodle-local", path: tempDir }, webservices: ["*"], outDir: "./out" },
                        { namespace: "webservice", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"] },
                    ],
                }),
                "utf-8"
            );
            await expect(runGenerator(pkgPath, { silent: true, forceNamespaces })).rejects.toMatchObject({
                code: "ERR_CONFIG_RESERVED_NAMESPACE",
                action: expect.stringContaining("Remove the 'webservice' entry"),
            });
            expect(extractWebservice).not.toHaveBeenCalled();
        });

        it("should refuse to regenerate the bundled namespace", async () => {
            await expect(runGenerator(undefined, { silent: true, forceNamespaces: ["webservice"] })).rejects.toMatchObject({
                code: "ERR_CONFIG_RESERVED_NAMESPACE",
            });
        });

        it("should give each outDir a barrel with only the namespaces that live in it", async () => {
            const nodeModulesDir = await setupPackage();
            vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue([
                { namespace: "inA", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"], outDir: "./a" },
                { namespace: "inB", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"], outDir: "./b" },
            ]);
            await generateMasterBarrel(path.join(nodeModulesDir, "dist/schemas"), await configManager.loadPackageConfig(), nodeModulesDir, tempDir);

            const barrelA = await fs.readFile(path.join(tempDir, "a/index.d.ts"), "utf-8");
            expect(barrelA).toContain('from "./inA/index"');
            expect(barrelA).not.toContain("inB");
            expect(barrelA).not.toContain("webservice");
            const master = await fs.readFile(path.join(nodeModulesDir, "dist/schemas/index.d.ts"), "utf-8");
            expect(master).toContain("webservice:");
            expect(master).toContain("inA:");
            expect(master).toContain("inB:");
        });
    });

    it("should fail with ERR_NAMESPACE_NOT_FOUND when --namespace names an unconfigured namespace", async () => {
        vi.spyOn(configManager, "loadPackageConfigDetailed").mockResolvedValue({
            configs: [{ namespace: "legacy", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"] }],
            invalid: [],
        });

        await expect(runGenerator(undefined, { silent: true, forceNamespaces: ["legacy", "ghost"] })).rejects.toMatchObject({
            code: "ERR_NAMESPACE_NOT_FOUND",
            details: expect.stringContaining("Namespace 'ghost' is not configured"),
        });
        expect(extractWebservice).not.toHaveBeenCalled();
    });

    it("should bypass outDir cache and regenerate when force is true", async () => {
        const outDir = path.join(tempDir, "schemas/local/legacy");
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.d.ts"), "export const old = true;\n", "utf-8");

        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "legacy",
                source: {
                    type: "moodle-local",
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

    it("should prune orphaned schema namespaces in dist/schemas that are not configured in package.json", async () => {
        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "activeNs",
                source: {
                    type: "moodle-official",
                    version: "4.4",
                },
                webservices: ["core_user_*"],
            },
        ];

        vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue(fakeConfigs);
        vi.spyOn(downloader, "cloneMoodleVersion").mockResolvedValue(path.join(tempDir, "cloned-moodle"));
        vi.spyOn(downloader, "cleanupMoodleDirectory").mockResolvedValue();
        vi.mocked(extractWebservice).mockResolvedValue({ schemas: [], errors: [] });

        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        const distSchemasDir = path.join(nodeModulesDir, "dist/schemas");
        const orphanDir = path.join(distSchemasDir, "orphanedOldNs");
        await fs.mkdir(orphanDir, { recursive: true });
        await fs.writeFile(path.join(orphanDir, "stale.d.ts"), "// stale schema", "utf-8");

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

        const orphanExists = await fs.access(orphanDir).then(() => true).catch(() => false);
        expect(orphanExists).toBe(false);
    });

    it("should reset nsDistDir before generating to eliminate zombie files from prior configurations", async () => {
        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "myNs",
                source: {
                    type: "moodle-local",
                    path: path.join(tempDir, "local-moodle"),
                },
                webservices: ["core_course_*"],
                outDir: "./schemas/local",
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

        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        const nsDistDir = path.join(nodeModulesDir, "dist/schemas/myNs");
        await fs.mkdir(nsDistDir, { recursive: true });
        // Create a zombie file from an old generation that is not in the new generation
        await fs.writeFile(path.join(nsDistDir, "zombie_old_service.webservice.d.ts"), "// zombie", "utf-8");

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

        // Zombie file must be gone
        const zombieExists = await fs
            .access(path.join(nsDistDir, "zombie_old_service.webservice.d.ts"))
            .then(() => true)
            .catch(() => false);
        expect(zombieExists).toBe(false);

        // New service must exist
        const courseDir = path.join(nsDistDir, "core/course");
        const generatedFiles = await fs.readdir(courseDir);
        expect(generatedFiles.some((f) => f.startsWith("get_courses.webservice"))).toBe(true);
    });

    it("should bypass cache for namespaces specified in forceNamespaces", async () => {
        const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
        const nsDistDir = path.join(nodeModulesDir, "dist/schemas/cachedNs");
        await fs.mkdir(nsDistDir, { recursive: true });
        await fs.writeFile(path.join(nsDistDir, "index.d.ts"), "// cached", "utf-8");
        await fs.writeFile(path.join(nsDistDir, "test.webservice.d.ts"), "// cached", "utf-8");

        const fakeConfigs: configManager.MoodleSchemaConfigEntry[] = [
            {
                namespace: "cachedNs",
                source: {
                    type: "moodle-official",
                    version: "4.4",
                },
                webservices: ["core_user_*"],
            },
        ];

        vi.spyOn(configManager, "loadPackageConfigDetailed").mockResolvedValue({ configs: fakeConfigs, invalid: [] });
        vi.spyOn(downloader, "cloneMoodleVersion").mockResolvedValue(path.join(tempDir, "cloned-moodle"));
        vi.spyOn(downloader, "cleanupMoodleDirectory").mockResolvedValue();
        vi.mocked(extractWebservice).mockResolvedValue({ schemas: [], errors: [] });

        await fs.writeFile(
            path.join(nodeModulesDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client" }),
            "utf-8"
        );
        await fs.writeFile(path.join(nodeModulesDir, "dist/index.d.ts"), "// index\n", "utf-8");

        const originalCwd = process.cwd();
        try {
            process.chdir(tempDir);
            await runGenerator(undefined, { silent: true, forceNamespaces: ["cachedNs"] });
        } finally {
            process.chdir(originalCwd);
        }

        // extractWebservice must have been called because forceNamespaces bypassed cache
        expect(extractWebservice).toHaveBeenCalled();
    });

    describe("local paths", () => {
        it("should fail with ERR_LOCAL_PATH_REQUIRED when a local namespace must be regenerated without a path", async () => {
            vi.spyOn(configManager, "loadPackageConfig").mockResolvedValue([
                { namespace: "dev", source: { type: "moodle-local" }, webservices: ["*"], outDir: "./schemas" },
            ]);
            await expect(runGenerator(undefined, { silent: true, force: true })).rejects.toMatchObject({
                code: "ERR_LOCAL_PATH_REQUIRED",
                action: expect.stringContaining("MOODLE_DEV_PATH"),
            });
            expect(extractWebservice).not.toHaveBeenCalled();
        });

        it("should never write a local path in the barrels, which are committed", async () => {
            const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
            await fs.mkdir(path.join(nodeModulesDir, "dist"), { recursive: true });
            const configs = [{ namespace: "dev", source: { type: "moodle-local" as const, path: "/home/someone/moodle" }, webservices: ["*"], outDir: "./schemas" }];
            await generateMasterBarrel(path.join(nodeModulesDir, "dist/schemas"), configs, nodeModulesDir, tempDir);

            const barrel = await fs.readFile(path.join(tempDir, "schemas/index.d.ts"), "utf-8");
            expect(barrel).toContain("Source: local");
            expect(barrel).not.toContain("/home/someone/moodle");
        });

        it("should plan the extraction of forced namespaces and of the ones without schemas, not of synchronized ones", async () => {
            const nodeModulesDir = path.join(tempDir, "node_modules/@didactika/moodle-client");
            await fs.mkdir(nodeModulesDir, { recursive: true });
            await fs.writeFile(path.join(nodeModulesDir, "package.json"), JSON.stringify({ name: "@didactika/moodle-client" }), "utf-8");
            for (const ns of ["synced", "forced"]) {
                await fs.mkdir(path.join(tempDir, "schemas", ns), { recursive: true });
                await fs.writeFile(path.join(tempDir, `schemas/${ns}/index.d.ts`), "export interface GeneratedMoodleServices {}\n", "utf-8");
                await fs.writeFile(path.join(tempDir, `schemas/${ns}/a.webservice.d.ts`), "export interface A {}\n", "utf-8");
            }
            const entry = (namespace: string) => ({ namespace, source: { type: "moodle-local" as const }, webservices: ["*"], outDir: "./schemas" });
            vi.spyOn(configManager, "loadPackageConfigDetailed").mockResolvedValue({ configs: [entry("synced"), entry("empty"), entry("forced")], invalid: [] });

            const originalCwd = process.cwd();
            try {
                process.chdir(tempDir);
                const planned = await planExtraction(path.join(tempDir, "package.json"), { forceNamespaces: ["forced"] });
                expect(planned.map((e) => e.namespace).sort()).toEqual(["empty", "forced"]);
            } finally {
                process.chdir(originalCwd);
            }
        });
    });
});
