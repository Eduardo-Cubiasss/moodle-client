import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    loadOrCreateConfig,
    normalizeMoodleVersion,
    DEFAULT_CONFIG_FILENAME,
} from "../../../src/generator/config/config-manager";

describe("Config Manager", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-config-test-"));
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    describe("normalizeMoodleVersion", () => {
        it("should extract major.minor and ignore patch versions", () => {
            expect(normalizeMoodleVersion("4.5.2")).toBe("4.5");
            expect(normalizeMoodleVersion("4.1.0")).toBe("4.1");
            expect(normalizeMoodleVersion("5.0")).toBe("5.0");
            expect(normalizeMoodleVersion("3.11.18")).toBe("3.11");
        });
    });

    describe("loadOrCreateConfig", () => {
        it("should create default config file if it does not exist", async () => {
            const configFilePath = path.join(tempDir, DEFAULT_CONFIG_FILENAME);
            const existsBefore = await fs.access(configFilePath).then(() => true).catch(() => false);
            expect(existsBefore).toBe(false);

            const config = await loadOrCreateConfig(configFilePath);

            expect(config.version).toBeDefined();
            expect(config.webservices).toEqual(["*"]);
            expect(config.outDir).toBe("./moodle-schemas");
            expect(config.moodlePath).toBeUndefined();
            expect(config.isLocal).toBe(false);

            // Verificamos que se haya escrito en disco
            const existsAfter = await fs.access(configFilePath).then(() => true).catch(() => false);
            expect(existsAfter).toBe(true);

            const rawContent = await fs.readFile(configFilePath, "utf-8");
            const parsed = JSON.parse(rawContent);
            expect(parsed.webservices).toEqual(["*"]);
        });

        it("should load existing config and correctly infer isLocal = true when moodlePath is present", async () => {
            const configFilePath = path.join(tempDir, DEFAULT_CONFIG_FILENAME);
            const customConfig = {
                version: "4.4.1",
                moodlePath: "/var/www/local-moodle",
                webservices: ["core_course_*", "local_custom_*"],
                outDir: "./custom-schemas"
            };

            await fs.writeFile(configFilePath, JSON.stringify(customConfig, null, 2), "utf-8");

            const loaded = await loadOrCreateConfig(configFilePath);

            expect(loaded.version).toBe("4.4"); // normalizado
            expect(loaded.moodlePath).toBe("/var/www/local-moodle");
            expect(loaded.isLocal).toBe(true);
            expect(loaded.webservices).toEqual(["core_course_*", "local_custom_*"]);
            expect(loaded.outDir).toBe("./custom-schemas");
        });

        it("should load existing config without moodlePath and infer isLocal = false", async () => {
            const configFilePath = path.join(tempDir, DEFAULT_CONFIG_FILENAME);
            const customConfig = {
                version: "4.5",
                webservices: ["core_webservice_get_site_info"]
            };

            await fs.writeFile(configFilePath, JSON.stringify(customConfig, null, 2), "utf-8");

            const loaded = await loadOrCreateConfig(configFilePath);

            expect(loaded.version).toBe("4.5");
            expect(loaded.moodlePath).toBeUndefined();
            expect(loaded.isLocal).toBe(false);
            expect(loaded.webservices).toEqual(["core_webservice_get_site_info"]);
            expect(loaded.outDir).toBe("./moodle-schemas"); // default fallback
        });
    });
});
