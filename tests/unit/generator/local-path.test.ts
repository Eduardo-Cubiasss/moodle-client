import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { localPathEnvVar, resolveLocalPath } from "../../../src/generator/config/local-path";
import { makeMoodleDir } from "./helpers/moodle";

describe("Local Moodle paths", () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-local-path-test-"));
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("should name the environment variable after the namespace", () => {
        expect(localPathEnvVar("local5")).toBe("MOODLE_LOCAL5_PATH");
        expect(localPathEnvVar("localDev")).toBe("MOODLE_LOCALDEV_PATH");
        expect(localPathEnvVar("my$ns")).toBe("MOODLE_MY_NS_PATH");
    });

    it("should prefer --source.path, then the environment variable, then the prompt", async () => {
        const fromFlag = await makeMoodleDir(tempDir, "flag");
        const fromEnv = await makeMoodleDir(tempDir, "env");
        const fromPrompt = await makeMoodleDir(tempDir, "prompt");
        const ask = vi.fn().mockResolvedValue(fromPrompt);
        const env = { MOODLE_DEV_PATH: fromEnv };

        expect(await resolveLocalPath("dev", { flagPath: fromFlag, env, ask })).toBe(fromFlag);
        expect(await resolveLocalPath("dev", { env, ask })).toBe(fromEnv);
        expect(await resolveLocalPath("dev", { env: {}, ask })).toBe(fromPrompt);
        expect(ask).toHaveBeenCalledTimes(1);
    });

    it("should ignore an empty environment variable", async () => {
        const fromPrompt = await makeMoodleDir(tempDir, "prompt");
        expect(await resolveLocalPath("dev", { env: { MOODLE_DEV_PATH: "  " }, ask: async () => fromPrompt })).toBe(fromPrompt);
    });

    it("should expand ~/ and return an absolute path", async () => {
        const home = os.homedir();
        const relative = path.relative(home, await makeMoodleDir(tempDir, "home-relative"));
        if (relative.startsWith("..")) {
            return; // tmpdir outside the home directory: nothing to expand
        }
        expect(await resolveLocalPath("dev", { flagPath: `~/${relative}` })).toBe(path.join(home, relative));
    });

    it("should fail with ERR_LOCAL_PATH_REQUIRED naming the variable when it cannot ask", async () => {
        await expect(resolveLocalPath("dev", { env: {} })).rejects.toMatchObject({
            code: "ERR_LOCAL_PATH_REQUIRED",
            action: expect.stringContaining("MOODLE_DEV_PATH"),
        });
    });

    it("should reject a path that does not exist, naming where it came from", async () => {
        const missing = path.join(tempDir, "missing");
        await expect(resolveLocalPath("dev", { flagPath: missing })).rejects.toMatchObject({ details: expect.stringContaining("--source.path") });
        await expect(resolveLocalPath("dev", { env: { MOODLE_DEV_PATH: missing } })).rejects.toMatchObject({ details: expect.stringContaining("MOODLE_DEV_PATH") });
    });
});
