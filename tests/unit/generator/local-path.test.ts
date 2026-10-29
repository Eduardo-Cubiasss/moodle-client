import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { resolveLocalPath } from "../../../src/generator/config/local-path";
import { makeMoodleDir } from "./helpers/moodle";

describe("Local Moodle paths", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-local-path-test-"));
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("should prefer --source.path, then the prompt", async () => {
        const fromFlag = await makeMoodleDir(tempDir, "flag");
        const fromPrompt = await makeMoodleDir(tempDir, "prompt");
        const ask = vi.fn().mockResolvedValue(fromPrompt);

        expect(await resolveLocalPath("dev", { flagPath: fromFlag, ask })).toBe(fromFlag);
        expect(ask).not.toHaveBeenCalled();
        expect(await resolveLocalPath("dev", { ask })).toBe(fromPrompt);
        expect(ask).toHaveBeenCalledWith("dev");
    });

    it("should never read the path from the environment", async () => {
        const ask = vi.fn().mockResolvedValue(await makeMoodleDir(tempDir, "prompt"));
        vi.stubEnv("MOODLE_DEV_PATH", await makeMoodleDir(tempDir, "env"));
        try {
            expect(await resolveLocalPath("dev", { ask })).toBe(path.join(tempDir, "prompt"));
        } finally {
            vi.unstubAllEnvs();
        }
    });

    it("should expand ~/ and return an absolute path", async () => {
        const home = os.homedir();
        const relative = path.relative(home, await makeMoodleDir(tempDir, "home-relative"));
        if (relative.startsWith("..")) {
            return; // tmpdir outside the home directory: nothing to expand
        }
        expect(await resolveLocalPath("dev", { flagPath: `~/${relative}` })).toBe(path.join(home, relative));
    });

    it("should fail with ERR_LOCAL_PATH_REQUIRED when it cannot ask", async () => {
        await expect(resolveLocalPath("dev", {})).rejects.toMatchObject({
            code: "ERR_LOCAL_PATH_REQUIRED",
            action: expect.stringContaining("Run the command in a terminal"),
        });
    });

    it("should reject a --source.path that does not exist", async () => {
        await expect(resolveLocalPath("dev", { flagPath: path.join(tempDir, "missing") })).rejects.toMatchObject({
            code: "ERR_CLI_INVALID_OPTION",
            details: expect.stringContaining("--source.path"),
        });
    });
});
