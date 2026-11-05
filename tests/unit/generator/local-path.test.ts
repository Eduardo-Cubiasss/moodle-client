import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { resolveLocalPath, absoluteLocalPath } from "../../../src/generator/config/local-path";
import {
    getLocalPathExample,
    getDefaultLocalPathExample,
    isMoodleDirectory,
    findCandidateMoodleDirectory,
} from "../../../src/generator/ui/local-path-prompt";
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

    it("should expand cross-platform home paths in absoluteLocalPath", () => {
        const home = os.homedir();
        expect(absoluteLocalPath("~")).toBe(home);
        expect(absoluteLocalPath("~/projects/moodle")).toBe(path.join(home, "projects/moodle"));
        expect(absoluteLocalPath("~\\projects\\moodle")).toBe(path.join(home, "projects\\moodle"));
    });

    it("should return platform-specific example paths", () => {
        expect(getDefaultLocalPathExample("win32")).toBe("C:\\xampp\\htdocs\\moodle");
        expect(getDefaultLocalPathExample("darwin")).toBe("/Applications/MAMP/htdocs/moodle");
        expect(getDefaultLocalPathExample("linux")).toBe("/var/www/html/moodle");
        expect(getDefaultLocalPathExample("aix")).toBe("/var/www/html/moodle");
    });

    it("should detect Moodle directories with version.php or public/version.php", async () => {
        const rootMoodle = path.join(tempDir, "root-moodle");
        await fs.mkdir(rootMoodle, { recursive: true });
        await fs.writeFile(path.join(rootMoodle, "version.php"), "<?php\n// Moodle version\n$version = 2024042200;\n");
        expect(isMoodleDirectory(rootMoodle)).toBe(true);

        const publicMoodle = path.join(tempDir, "public-moodle");
        await fs.mkdir(path.join(publicMoodle, "public"), { recursive: true });
        await fs.writeFile(path.join(publicMoodle, "public", "version.php"), "<?php\n$version = 2025101000;\n");
        expect(isMoodleDirectory(publicMoodle)).toBe(true);

        const emptyDir = path.join(tempDir, "empty");
        await fs.mkdir(emptyDir, { recursive: true });
        expect(isMoodleDirectory(emptyDir)).toBe(false);

        const nonMoodle = path.join(tempDir, "non-moodle");
        await fs.mkdir(nonMoodle, { recursive: true });
        await fs.writeFile(path.join(nonMoodle, "version.php"), "<?php\n// Other app\n$app_version = 1.0;\n");
        expect(isMoodleDirectory(nonMoodle)).toBe(false);
    });

    it("should discover candidate Moodle directory from cwd or siblings", async () => {
        const subWorkspace = path.join(tempDir, "workspace");
        const clientDir = path.join(subWorkspace, "my-client");
        const moodleDir = path.join(subWorkspace, "moodle-5.3");
        await fs.mkdir(clientDir, { recursive: true });
        await fs.mkdir(path.join(moodleDir, "public"), { recursive: true });
        await fs.writeFile(path.join(moodleDir, "public", "version.php"), "<?php\n// Moodle\n$version = 2025101000;\n");

        const found = findCandidateMoodleDirectory({ cwd: clientDir });
        expect(found).toBe(moodleDir);

        const example = getLocalPathExample({ cwd: clientDir });
        expect(example).toBe(moodleDir);
        expect(path.isAbsolute(example)).toBe(true);
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
