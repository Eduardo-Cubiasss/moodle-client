import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    hasExistingSchemas,
    syncSchemas,
    findPackageDir,
    resolveInternalPackageSchemasDir,
} from "../../../src/generator/syncer/schema-syncer";

describe("Schema Syncer Utility", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "syncer-test-"));
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("hasExistingSchemas should return false for nonexistent directory", async () => {
        const result = await hasExistingSchemas(path.join(tempDir, "nonexistent"));
        expect(result).toBe(false);
    });

    it("hasExistingSchemas should return false for empty directory", async () => {
        const emptyDir = path.join(tempDir, "empty");
        await fs.mkdir(emptyDir, { recursive: true });
        const result = await hasExistingSchemas(emptyDir);
        expect(result).toBe(false);
    });

    it("hasExistingSchemas should return true if index.ts exists", async () => {
        const schemaDir = path.join(tempDir, "schemas");
        await fs.mkdir(schemaDir, { recursive: true });
        await fs.writeFile(path.join(schemaDir, "index.ts"), "export * from './test';", "utf-8");

        const result = await hasExistingSchemas(schemaDir);
        expect(result).toBe(true);
    });

    it("hasExistingSchemas should return true if any .webservice-client.ts exists", async () => {
        const schemaDir = path.join(tempDir, "schemas");
        await fs.mkdir(schemaDir, { recursive: true });
        await fs.writeFile(path.join(schemaDir, "custom.webservice-client.ts"), "export interface Custom {}", "utf-8");

        const result = await hasExistingSchemas(schemaDir);
        expect(result).toBe(true);
    });

    it("findPackageDir should locate package from mock node_modules", async () => {
        const mockConsumer = path.join(tempDir, "consumer");
        const mockPkgDir = path.join(mockConsumer, "node_modules/@didactika/moodle-client");
        await fs.mkdir(mockPkgDir, { recursive: true });
        await fs.writeFile(
            path.join(mockPkgDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client", version: "2.1.0" }),
            "utf-8"
        );

        const found = findPackageDir(mockConsumer);
        expect(found).toBe(mockPkgDir);
    });

    it("syncSchemas should copy schema files and create .d.ts files in destination", async () => {
        const mockConsumer = path.join(tempDir, "consumer");
        const mockPkgDir = path.join(mockConsumer, "node_modules/@didactika/moodle-client");
        const mockPkgDist = path.join(mockPkgDir, "dist");
        await fs.mkdir(mockPkgDist, { recursive: true });
        await fs.writeFile(
            path.join(mockPkgDir, "package.json"),
            JSON.stringify({ name: "@didactika/moodle-client", version: "2.1.0" }),
            "utf-8"
        );
        await fs.writeFile(path.join(mockPkgDist, "index.d.ts"), "// initial dts\n", "utf-8");

        const sourceDir = path.join(mockConsumer, "my-schemas");
        const subDir = path.join(sourceDir, "core/user");
        await fs.mkdir(subDir, { recursive: true });
        await fs.writeFile(path.join(sourceDir, "index.ts"), "export * from './core/user/get_users';", "utf-8");
        await fs.writeFile(path.join(subDir, "get_users.webservice-client.ts"), "export interface GetUsersParams {}", "utf-8");

        const { syncedCount, targets } = await syncSchemas(sourceDir, mockConsumer);

        expect(syncedCount).toBeGreaterThanOrEqual(2);
        const distSchemas = path.join(mockPkgDir, "dist/schemas");
        expect(targets).toContain(distSchemas);

        // Verify both .ts and .d.ts were created
        expect(await fs.access(path.join(distSchemas, "index.ts")).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(path.join(distSchemas, "index.d.ts")).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(path.join(distSchemas, "core/user/get_users.webservice-client.ts")).then(() => true).catch(() => false)).toBe(true);
        expect(await fs.access(path.join(distSchemas, "core/user/get_users.webservice-client.d.ts")).then(() => true).catch(() => false)).toBe(true);

        // Verify index.d.ts was augmented with export * from "./schemas/index"
        const updatedDts = await fs.readFile(path.join(mockPkgDist, "index.d.ts"), "utf-8");
        expect(updatedDts).toContain('export * from "./schemas/index"');
    });

    it("resolveInternalPackageSchemasDir should return dist/schemas when dist directory exists", () => {
        const mockConsumer = path.join(tempDir, "consumer");
        const resolved = resolveInternalPackageSchemasDir(mockConsumer);
        expect(resolved).toContain("schemas");
    });
});
