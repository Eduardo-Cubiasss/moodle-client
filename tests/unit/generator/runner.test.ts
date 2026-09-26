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

describe("Runner Orchestration", () => {
    let tempDir: string;
    let mockPkgDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-runner-test-"));
        mockPkgDir = path.join(tempDir, "pkg");
        await fs.mkdir(path.join(mockPkgDir, "dist"), { recursive: true });
        await fs.writeFile(
            path.join(mockPkgDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client", version: "2.1.0" }),
            "utf-8"
        );
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("should coordinate download, extraction, and generation directly into client package", async () => {
        const fakeConfig: configManager.MoodleClientConfig = {
            version: "4.5",
            webservices: ["core_course_get_courses"],
            isLocal: false,
        };

        vi.spyOn(configManager, "loadOrCreateConfig").mockResolvedValue(fakeConfig);
        const cloneSpy = vi
            .spyOn(downloader, "cloneMoodleVersion")
            .mockResolvedValue(path.join(tempDir, "fake-moodle"));
        const cleanupSpy = vi.spyOn(downloader, "cleanupMoodleDirectory").mockResolvedValue();

        const fakeSchemas = [
            {
                name: "core_course_get_courses",
                description: "Get courses",
                parameters: { kind: "parameters", keys: {} },
                returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
            },
        ];

        vi.mocked(extractWebservice).mockResolvedValue({
            schemas: fakeSchemas as any,
            errors: [],
        });

        // Set cwd to tempDir where node_modules has the mock package
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

        expect(cloneSpy).toHaveBeenCalledWith("4.5", expect.any(String));
        expect(extractWebservice).toHaveBeenCalledWith(
            expect.objectContaining({
                services: ["core_course_get_courses"],
            })
        );
        expect(cleanupSpy).toHaveBeenCalled();

        // Verify schemas were generated inside node_modules/@didactika/moodle-client/dist/schemas
        const targetSchemasDir = path.join(nodeModulesDir, "dist/schemas");
        const courseFile = path.join(targetSchemasDir, "core/course/get_courses.webservice-client.d.ts");
        const indexFile = path.join(targetSchemasDir, "index.d.ts");
        expect(await fs.access(courseFile).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(indexFile).then(() => true).catch(() => false)).toBe(true);

        // Verify declaration exports were ensured in dist/index.d.ts
        const indexDtsContent = await fs.readFile(path.join(nodeModulesDir, "dist/index.d.ts"), "utf-8");
        expect(indexDtsContent).toContain('export * from "./schemas/index"');
    });

    it("should skip extraction and copy schemas to targetSchemasDir when outDir already has schemas and force is false", async () => {
        const outDir = path.join(tempDir, "existing-schemas");
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.d.ts"), "export const cached = true;\n", "utf-8");
        await fs.writeFile(path.join(outDir, "test.webservice-client.d.ts"), "export interface Test {}\n", "utf-8");

        const fakeConfig: configManager.MoodleClientConfig = {
            version: "4.5",
            webservices: ["*"],
            outDir: "./existing-schemas",
            isLocal: false,
        };

        vi.spyOn(configManager, "loadOrCreateConfig").mockResolvedValue(fakeConfig);
        const cloneSpy = vi.spyOn(downloader, "cloneMoodleVersion");

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

        expect(cloneSpy).not.toHaveBeenCalled();
        expect(extractWebservice).not.toHaveBeenCalled();

        const targetSchemasDir = path.join(nodeModulesDir, "dist/schemas");
        const syncedIndex = path.join(targetSchemasDir, "index.d.ts");
        const syncedTest = path.join(targetSchemasDir, "test.webservice-client.d.ts");
        expect(await fs.access(syncedIndex).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(syncedTest).then(() => true).catch(() => false)).toBe(true);
    });

    it("should bypass outDir cache and regenerate both in outDir and node_modules when force is true", async () => {
        const outDir = path.join(tempDir, "existing-schemas");
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, "index.d.ts"), "export const old = true;\n", "utf-8");

        const fakeConfig: configManager.MoodleClientConfig = {
            version: "4.5",
            webservices: ["core_course_get_courses"],
            outDir: "./existing-schemas",
            isLocal: false,
        };

        vi.spyOn(configManager, "loadOrCreateConfig").mockResolvedValue(fakeConfig);
        const cloneSpy = vi
            .spyOn(downloader, "cloneMoodleVersion")
            .mockResolvedValue(path.join(tempDir, "fake-moodle"));
        vi.spyOn(downloader, "cleanupMoodleDirectory").mockResolvedValue();

        const fakeSchemas = [
            {
                name: "core_course_get_courses",
                description: "Get courses",
                parameters: { kind: "parameters", keys: {} },
                returns: { kind: "value", type: "PARAM_INT", primitiveType: "number" },
            },
        ];

        vi.mocked(extractWebservice).mockResolvedValue({
            schemas: fakeSchemas as any,
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

        expect(cloneSpy).toHaveBeenCalled();
        expect(extractWebservice).toHaveBeenCalled();

        // Check that outDir has new generated files
        const outDirGeneratedFile = path.join(outDir, "core/course/get_courses.webservice-client.d.ts");
        expect(await fs.access(outDirGeneratedFile).then(() => true).catch(() => false)).toBe(true);

        // Check that node_modules has new generated files
        const targetSchemasDir = path.join(nodeModulesDir, "dist/schemas");
        const nodeModulesGeneratedFile = path.join(targetSchemasDir, "core/course/get_courses.webservice-client.d.ts");
        expect(await fs.access(nodeModulesGeneratedFile).then(() => true).catch(() => false)).toBe(true);
    });
});
