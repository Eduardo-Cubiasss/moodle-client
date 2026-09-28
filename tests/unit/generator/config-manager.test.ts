import { describe, expect, it, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    loadPackageConfig,
    normalizeMoodleVersion,
    isMoodleVersionSupported,
} from "../../../src/generator/config/config-manager";

describe("ConfigManager - package.json Configuration", () => {
    let tempDir: string;
    let pkgJsonPath: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-pkg-config-test-"));
        pkgJsonPath = path.join(tempDir, "package.json");
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("should normalize Moodle versions correctly", () => {
        expect(normalizeMoodleVersion("4.5.2")).toBe("4.5");
        expect(normalizeMoodleVersion("v4.5.2")).toBe("4.5");
        expect(normalizeMoodleVersion("4.1")).toBe("4.1");
        expect(normalizeMoodleVersion("5.0")).toBe("5.0");
    });

    it("should validate supported Moodle versions (>= 2.0)", () => {
        expect(isMoodleVersionSupported("4.5")).toBe(true);
        expect(isMoodleVersionSupported("2.0")).toBe(true);
        expect(isMoodleVersionSupported("1.9")).toBe(false);
    });

    it("should load valid multi-schema configuration from package.json", async () => {
        const pkgContent = {
            name: "test-app",
            version: "1.0.0",
            "moodle-client": [
                {
                    namespace: "legacy",
                    source: {
                        type: "local",
                        path: "/var/www/moodle",
                    },
                    webservices: ["core_*"],
                    outDir: "./schemas/local",
                },
                {
                    namespace: "default",
                    source: {
                        type: "moodle",
                        version: "4.4",
                    },
                    webservices: ["core_course_*", "mod_assign_*"],
                    outDir: "./schemas/v4.4",
                },
            ],
        };
        await fs.writeFile(pkgJsonPath, JSON.stringify(pkgContent, null, 2), "utf-8");

        const configs = await loadPackageConfig(pkgJsonPath);
        expect(configs).toHaveLength(2);

        expect(configs[0].namespace).toBe("legacy");
        expect(configs[0].source.type).toBe("local");
        expect((configs[0].source as any).path).toBe("/var/www/moodle");
        expect(configs[0].outDir).toBe("./schemas/local");
        expect(configs[0].webservices).toEqual(["core_*"]);

        expect(configs[1].namespace).toBe("default");
        expect(configs[1].source.type).toBe("moodle");
        expect((configs[1].source as any).version).toBe("4.4");
        expect(configs[1].outDir).toBe("./schemas/v4.4");
        expect(configs[1].webservices).toEqual(["core_course_*", "mod_assign_*"]);
    });

    it("should allow moodle source without outDir (optional in remote mode)", async () => {
        const pkgContent = {
            name: "test-app",
            "moodle-client": [
                {
                    namespace: "default",
                    source: {
                        type: "moodle",
                        version: "4.5",
                    },
                    webservices: ["*"],
                },
            ],
        };
        await fs.writeFile(pkgJsonPath, JSON.stringify(pkgContent, null, 2), "utf-8");

        const configs = await loadPackageConfig(pkgJsonPath);
        expect(configs).toHaveLength(1);
        expect(configs[0].outDir).toBeUndefined();
    });

    it("should throw ERR_CONFIG_MISSING_OUTDIR_LOCAL when local source has no outDir", async () => {
        const pkgContent = {
            name: "test-app",
            "moodle-client": [
                {
                    namespace: "legacy",
                    source: {
                        type: "local",
                        path: "/var/www/moodle",
                    },
                    webservices: ["core_*"],
                },
            ],
        };
        await fs.writeFile(pkgJsonPath, JSON.stringify(pkgContent, null, 2), "utf-8");

        await expect(loadPackageConfig(pkgJsonPath)).rejects.toThrowError(
            /Missing outDir in Local Mode/
        );
    });

    it("should throw ERR_CONFIG_DUPLICATE_NAMESPACE when two configurations share the same namespace", async () => {
        const pkgContent = {
            name: "test-app",
            "moodle-client": [
                {
                    namespace: "default",
                    source: {
                        type: "moodle",
                        version: "4.5",
                    },
                    webservices: ["*"],
                },
                {
                    namespace: "default",
                    source: {
                        type: "moodle",
                        version: "4.4",
                    },
                    webservices: ["*"],
                },
            ],
        };
        await fs.writeFile(pkgJsonPath, JSON.stringify(pkgContent, null, 2), "utf-8");

        await expect(loadPackageConfig(pkgJsonPath)).rejects.toThrowError(
            /Duplicate configuration namespace/
        );
    });

    it("should auto-generate default configuration in package.json when moodle-client is missing", async () => {
        const pkgContent = {
            name: "test-app",
            version: "1.0.0",
        };
        await fs.writeFile(pkgJsonPath, JSON.stringify(pkgContent, null, 2), "utf-8");

        const configs = await loadPackageConfig(pkgJsonPath);
        expect(configs).toHaveLength(1);
        expect(configs[0].namespace).toBe("webservice");
        expect(configs[0].source.type).toBe("moodle");
        expect((configs[0].source as any).version).toBe("4.5");
        expect(configs[0].webservices).toEqual(["*"]);
        expect(configs[0].outDir).toBeUndefined();

        const writtenContent = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
        expect(writtenContent["moodle-client"]).toBeDefined();
        expect(writtenContent["moodle-client"]).toEqual([
            {
                namespace: "webservice",
                source: {
                    type: "moodle",
                    version: "4.5",
                },
                webservices: ["*"],
            },
        ]);
    });

    it("should auto-generate default configuration in package.json when moodle-client array is empty", async () => {
        const pkgContent = {
            name: "test-app",
            "moodle-client": [],
        };
        await fs.writeFile(pkgJsonPath, JSON.stringify(pkgContent, null, 2), "utf-8");

        const configs = await loadPackageConfig(pkgJsonPath);
        expect(configs).toHaveLength(1);
        expect(configs[0].namespace).toBe("webservice");
        expect(configs[0].outDir).toBeUndefined();

        const writtenContent = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
        expect(writtenContent["moodle-client"]).toHaveLength(1);
        expect(writtenContent["moodle-client"][0].namespace).toBe("webservice");
    });

    it("should throw on invalid JSON syntax in package.json", async () => {
        await fs.writeFile(pkgJsonPath, "{ not valid json", "utf-8");

        await expect(loadPackageConfig(pkgJsonPath)).rejects.toThrow();
    });
});
