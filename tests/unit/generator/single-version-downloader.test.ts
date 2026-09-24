import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import child_process from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    cloneMoodleVersion,
    cleanupMoodleDirectory,
    resolveLatestRemoteVersion,
} from "../../../src/generator/downloader/single-version-downloader";

describe("Single Version Downloader", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-downloader-test-"));
        vi.restoreAllMocks();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("should execute shallow git clone for the exact version tag", async () => {
        const execMock = vi.spyOn(child_process, "exec").mockImplementation((cmd, options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            if (cb) (cb as any)(null, "", "");
            return {} as any;
        });

        const targetDir = path.join(tempDir, "cloned-moodle");
        const clonedPath = await cloneMoodleVersion("4.5", targetDir);

        expect(clonedPath).toBe(targetDir);
        expect(execMock).toHaveBeenCalledTimes(1);
        const commandRun = execMock.mock.calls[0]?.[0];
        expect(commandRun).toBeDefined();
        expect(commandRun).toContain("git clone --depth 1");
        expect(commandRun).toContain("--branch v4.5.0");
        expect(commandRun).toContain("https://github.com/moodle/moodle.git");
    });

    it("should safely clean up downloaded directory from disk", async () => {
        const dummyDir = path.join(tempDir, "to-clean");
        await fs.mkdir(dummyDir, { recursive: true });
        await fs.writeFile(path.join(dummyDir, "test.txt"), "hello", "utf-8");

        expect(await fs.access(dummyDir).then(() => true).catch(() => false)).toBe(true);

        await cleanupMoodleDirectory(dummyDir);

        expect(await fs.access(dummyDir).then(() => true).catch(() => false)).toBe(false);
    });

    it("should parse git ls-remote tags and resolve the latest remote version", async () => {
        const dummyTags = [
            "refs/tags/v3.9.0",
            "refs/tags/v4.1.0",
            "refs/tags/v4.4.0",
            "refs/tags/v4.5.0",
            "refs/tags/v4.5.1",
        ]
            .map((tag) => `abc123\t${tag}`)
            .join("\n");

        vi.spyOn(child_process, "exec").mockImplementation((cmd, options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            if (cb) (cb as any)(null, dummyTags, "");
            return {} as any;
        });

        const latest = await resolveLatestRemoteVersion();
        expect(latest).toBe("4.5");
    });
});
