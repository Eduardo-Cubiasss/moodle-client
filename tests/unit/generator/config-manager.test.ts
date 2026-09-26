import { describe, expect, it, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    loadOrCreateConfig,
    normalizeMoodleVersion,
    isMoodleVersionSupported,
    DEFAULT_CONFIG_FILENAME,
} from "../../../src/generator/config/config-manager";

describe("ConfigManager", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-config-test-"));
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

    it("should create default config when file does not exist", async () => {
        const configPath = path.join(tempDir, DEFAULT_CONFIG_FILENAME);
        const config = await loadOrCreateConfig(configPath, "4.5");

        expect(config.version).toBe("4.5");
        expect(config.webservices).toEqual(["*"]);
        expect(config.isLocal).toBe(false);
        expect(config.moodlePath).toBeUndefined();

        const fileContent = JSON.parse(await fs.readFile(configPath, "utf-8"));
        expect(fileContent.version).toBe("4.5");
        expect(fileContent.webservices).toEqual(["*"]);
    });

    it("should load existing config without demanding outDir in local mode", async () => {
        const configPath = path.join(tempDir, DEFAULT_CONFIG_FILENAME);
        const mockLocalMoodle = path.join(tempDir, "local-moodle");
        await fs.mkdir(mockLocalMoodle, { recursive: true });

        const customConfig = {
            version: "4.4",
            moodlePath: mockLocalMoodle,
            webservices: ["core_course_get_courses"],
        };
        await fs.writeFile(configPath, JSON.stringify(customConfig), "utf-8");

        const loaded = await loadOrCreateConfig(configPath);
        expect(loaded.version).toBe("4.4");
        expect(loaded.isLocal).toBe(true);
        expect(loaded.moodlePath).toBe(mockLocalMoodle);
        expect(loaded.webservices).toEqual(["core_course_get_courses"]);
    });

    it("should throw on invalid JSON", async () => {
        const configPath = path.join(tempDir, DEFAULT_CONFIG_FILENAME);
        await fs.writeFile(configPath, "{ invalid json", "utf-8");

        await expect(loadOrCreateConfig(configPath)).rejects.toThrow();
    });
});
