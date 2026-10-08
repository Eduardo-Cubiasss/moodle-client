import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import child_process from "child_process";
import { MoodleGeneratorError } from "@didactika/moodle-client-schemas";
import {
    checkPhpEnvironment,
    checkGitEnvironment,
    validateSchemaDeclarations,
    validateOutputDirectoryNotEmpty,
    formatGeneratorError,
    createGeneratorError,
    verifyLocalMoodlePath,
} from "../../../src/generator/utils/environment-validator";
import { loadPackageConfig } from "../../../src/generator/config/config-manager";
import { cloneRepository } from "../../../src/generator/downloader/git-repository-downloader";
import { promptDeleteSchemas } from "../../../src/generator/ui/delete-schemas";
import { verifyOutDirWritable } from "../../../src/generator/runner";
import { validateLocalPathInput } from "../../../src/generator/ui/create-schemas";

describe("Usability Error Handling Suite (.idea/errors.md)", () => {
    let tempDir: string;
    let pkgJsonPath: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "moodle-error-test-"));
        pkgJsonPath = path.join(tempDir, "package.json");
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    describe("1. Schemas mal formados, con extension .webservice pero sin types exportados", () => {
        it("should throw ERR_SCHEMA_MALFORMED when .webservice.d.ts file is empty (0 bytes)", async () => {
            const schemaDir = path.join(tempDir, "schemas/corrupt");
            await fs.mkdir(schemaDir, { recursive: true });
            const corruptFile = path.join(schemaDir, "core_user.webservice.d.ts");
            await fs.writeFile(corruptFile, "", "utf-8");

            await expect(validateSchemaDeclarations(schemaDir, "corrupt")).rejects.toThrowError(
                MoodleGeneratorError
            );

            try {
                await validateSchemaDeclarations(schemaDir, "corrupt");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_SCHEMA_MALFORMED");
                expect(genErr.title).toBe("Malformed Web Service Schema");
                expect(genErr.details).toContain("is empty (0 bytes)");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });

        it("should throw ERR_SCHEMA_MALFORMED when .webservice.d.ts file has no exported types", async () => {
            const schemaDir = path.join(tempDir, "schemas/corrupt");
            await fs.mkdir(schemaDir, { recursive: true });
            const corruptFile = path.join(schemaDir, "core_course.webservice.d.ts");
            await fs.writeFile(corruptFile, "// malformed schema without exported types\nconst x = 1;\n", "utf-8");

            try {
                await validateSchemaDeclarations(schemaDir, "corrupt");
                expect.unreachable("Should have thrown ERR_SCHEMA_MALFORMED");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_SCHEMA_MALFORMED");
                expect(genErr.title).toBe("Malformed Web Service Schema");
                expect(genErr.details).toContain("does not contain exported type declarations");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });
    });

    describe("2. Carpeta outDir no existe o no tiene permisos de escritura", () => {
        it("should throw ERR_OUTPUT_DIRECTORY_NOT_WRITABLE when directory lacks write permissions", async () => {
            const readOnlyDir = path.join(tempDir, "readonly-dir");
            await fs.mkdir(readOnlyDir, { recursive: true });

            const accessSpy = vi.spyOn(fs, "access").mockImplementation(async (target, mode) => {
                if (target === readOnlyDir && mode === fs.constants.W_OK) {
                    const err = new Error("EACCES: permission denied") as NodeJS.ErrnoException;
                    err.code = "EACCES";
                    throw err;
                }
            });

            try {
                await verifyOutDirWritable(readOnlyDir);
                expect.unreachable("Should have thrown ERR_OUTPUT_DIRECTORY_NOT_WRITABLE");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_OUTPUT_DIRECTORY_NOT_WRITABLE");
                expect(genErr.title).toBe("Output Directory Not Writable");
                expect(genErr.action).toContain("chmod u+w");
            } finally {
                accessSpy.mockRestore();
            }
        });
    });

    describe("3. package.json configuraciones mal formadas", () => {
        it("should throw ERR_CONFIG_MISSING_OUTDIR_LOCAL when local mode lacks outDir", async () => {
            const pkg = {
                name: "test-app",
                "moodle-client": [
                    {
                        namespace: "localDev",
                        source: { type: "local", path: "./moodle" },
                        webservices: ["*"],
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

            try {
                await loadPackageConfig(pkgJsonPath);
                expect.unreachable("Should have thrown ERR_CONFIG_MISSING_OUTDIR_LOCAL");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_CONFIG_MISSING_OUTDIR_LOCAL");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });

        it("should throw ERR_CONFIG_MISSING_OUTDIR_REPOSITORY when repository mode lacks outDir", async () => {
            const pkg = {
                name: "test-app",
                "moodle-client": [
                    {
                        namespace: "customRepo",
                        source: { type: "repository", url: "https://github.com/my-org/moodle.git" },
                        webservices: ["*"],
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

            try {
                await loadPackageConfig(pkgJsonPath);
                expect.unreachable("Should have thrown ERR_CONFIG_MISSING_OUTDIR_REPOSITORY");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_CONFIG_MISSING_OUTDIR_REPOSITORY");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });

        it("should throw ERR_MOODLE_VERSION_UNSUPPORTED for unsupported Moodle versions (< 2.0)", async () => {
            const pkg = {
                name: "test-app",
                "moodle-client": [
                    {
                        namespace: "legacy19",
                        source: { type: "moodle", version: "1.9" },
                        webservices: ["*"],
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

            try {
                await loadPackageConfig(pkgJsonPath);
                expect.unreachable("Should have thrown ERR_MOODLE_VERSION_UNSUPPORTED");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_MOODLE_VERSION_UNSUPPORTED");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });

        it("should throw ERR_CONFIG_INVALID_SOURCE_TYPE for invalid source type", async () => {
            const pkg = {
                name: "test-app",
                "moodle-client": [
                    {
                        namespace: "badSource",
                        source: { type: "ftp" },
                        webservices: ["*"],
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

            try {
                await loadPackageConfig(pkgJsonPath);
                expect.unreachable("Should have thrown ERR_CONFIG_INVALID_SOURCE_TYPE");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_CONFIG_INVALID_SOURCE_TYPE");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });
    });

    describe("4. Outdir existe pero esta vacio y configuraciones existen", () => {
        it("should throw ERR_OUTPUT_DIRECTORY_EMPTY in delete-schemas when outDir exists but is empty", async () => {
            const emptyOutDir = path.join(tempDir, "empty-schemas");
            await fs.mkdir(emptyOutDir, { recursive: true });

            const pkg = {
                name: "test-app",
                "moodle-client": [
                    {
                        namespace: "mySchemas",
                        source: { type: "local", path: "./moodle" },
                        webservices: ["*"],
                        outDir: "empty-schemas",
                    },
                ],
            };
            await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2), "utf-8");

            try {
                await promptDeleteSchemas({
                    pkgPath: pkgJsonPath,
                    mockAnswers: ["1"],
                    baseDir: tempDir,
                });
                expect.unreachable("Should have thrown ERR_OUTPUT_DIRECTORY_EMPTY");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_OUTPUT_DIRECTORY_EMPTY");
                expect(genErr.title).toBe("Output Directory Is Empty");
                expect(genErr.details).toContain("exists but is completely empty");
                expect(genErr.action).toContain("npx moodle-generate-schemas");
            }
        });

        it("should validate that validateOutputDirectoryNotEmpty halts on empty directory", async () => {
            const emptyDir = path.join(tempDir, "empty-test");
            await fs.mkdir(emptyDir, { recursive: true });

            await expect(validateOutputDirectoryNotEmpty(emptyDir, "testNs")).rejects.toThrowError(
                /ERR_OUTPUT_DIRECTORY_EMPTY/
            );
        });
    });

    describe("5. No esta instalado php compatible", () => {
        it("should throw ERR_PHP_NOT_FOUND when PHP is not found on system PATH", async () => {
            vi.spyOn(child_process, "exec").mockImplementation(((
                _cmd: string,
                callback: (error: Error | null, stdout: string, stderr: string) => void
            ) => {
                const err = new Error("spawn php ENOENT") as NodeJS.ErrnoException;
                err.code = "ENOENT";
                callback(err, "", "php: command not found");
                return {} as child_process.ChildProcess;
            }) as any);

            try {
                await checkPhpEnvironment();
                expect.unreachable("Should have thrown ERR_PHP_NOT_FOUND");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_PHP_NOT_FOUND");
                expect(genErr.title).toBe("PHP CLI Not Found");
                expect(genErr.action).toContain("Install PHP 7.4 or higher");
            }
        });

        it("should throw ERR_PHP_VERSION_UNSUPPORTED when PHP version is < 7.4", async () => {
            vi.spyOn(child_process, "exec").mockImplementation(((
                _cmd: string,
                callback: (error: Error | null, stdout: string, stderr: string) => void
            ) => {
                callback(null, "PHP 7.2.24-0ubuntu0.18.04.17 (cli) (built: ...)", "");
                return {} as child_process.ChildProcess;
            }) as any);

            try {
                await checkPhpEnvironment();
                expect.unreachable("Should have thrown ERR_PHP_VERSION_UNSUPPORTED");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_PHP_VERSION_UNSUPPORTED");
                expect(genErr.title).toBe("Unsupported PHP Version");
                expect(genErr.details).toContain("PHP 7.2");
                expect(genErr.action).toContain("Upgrade your PHP CLI installation");
            }
        });
    });

    describe("6. No esta instalado git", () => {
        it("should throw ERR_GIT_NOT_FOUND when Git is not installed on system PATH", async () => {
            vi.spyOn(child_process, "exec").mockImplementation(((
                _cmd: string,
                callback: (error: Error | null, stdout: string, stderr: string) => void
            ) => {
                const err = new Error("spawn git ENOENT") as NodeJS.ErrnoException;
                err.code = "ENOENT";
                callback(err, "", "git: not found");
                return {} as child_process.ChildProcess;
            }) as any);

            try {
                await checkGitEnvironment();
                expect.unreachable("Should have thrown ERR_GIT_NOT_FOUND");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_GIT_NOT_FOUND");
                expect(genErr.title).toBe("Git Executable Not Found");
                expect(genErr.action).toContain("Install Git");
            }
        });

        it("should throw ERR_GIT_NOT_FOUND in cloneRepository when git clone reports ENOENT", async () => {
            const fakeGit = {
                clone: vi.fn().mockRejectedValue(new Error("spawn git ENOENT")),
            } as any;

            try {
                await cloneRepository({
                    repoUrl: "https://github.com/my-org/moodle.git",
                    targetPath: path.join(tempDir, "clone-target"),
                    gitInstance: fakeGit,
                });
                expect.unreachable("Should have thrown ERR_GIT_NOT_FOUND");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_GIT_NOT_FOUND");
            }
        });
    });

    describe("7. Repositorio remoto no existe o no es accesible (404/not found)", () => {
        it("should throw ERR_REPOSITORY_NOT_FOUND when remote repository is 404/not found", async () => {
            const fakeGit = {
                clone: vi.fn().mockRejectedValue(
                    new Error("fatal: repository 'https://github.com/my-org/nonexistent.git' not found")
                ),
            } as any;

            try {
                await cloneRepository({
                    repoUrl: "https://github.com/my-org/nonexistent.git",
                    targetPath: path.join(tempDir, "clone-target"),
                    gitInstance: fakeGit,
                });
                expect.unreachable("Should have thrown ERR_REPOSITORY_NOT_FOUND");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_REPOSITORY_NOT_FOUND");
                expect(genErr.title).toBe("Remote Repository Not Found");
                expect(genErr.details).toContain("404 Not Found");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });
    });

    describe("8. Credenciales para repositorio remoto no son validas (401/403)", () => {
        it("should throw ERR_REPOSITORY_AUTH_FAILED on HTTP 401/403 authentication failure", async () => {
            const fakeGit = {
                clone: vi.fn().mockRejectedValue(
                    new Error("fatal: Authentication failed for 'https://github.com/my-org/private.git'")
                ),
            } as any;

            try {
                await cloneRepository({
                    repoUrl: "https://github.com/my-org/private.git",
                    targetPath: path.join(tempDir, "clone-target"),
                    gitInstance: fakeGit,
                    token: "invalid-token-123",
                });
                expect.unreachable("Should have thrown ERR_REPOSITORY_AUTH_FAILED");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_REPOSITORY_AUTH_FAILED");
                expect(genErr.title).toBe("Repository Authentication Failed");
                expect(genErr.details).toContain("HTTP 401/403");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            }
        });
    });

    describe("9. Problemas de conexion a internet", () => {
        it("should throw ERR_NETWORK_DISCONNECTED when DNS resolution or network fails during git clone", async () => {
            const fakeGit = {
                clone: vi.fn().mockRejectedValue(
                    new Error("fatal: unable to access 'https://github.com/my-org/moodle.git': Could not resolve host: github.com")
                ),
            } as any;

            try {
                await cloneRepository({
                    repoUrl: "https://github.com/my-org/moodle.git",
                    targetPath: path.join(tempDir, "clone-target"),
                    gitInstance: fakeGit,
                });
                expect.unreachable("Should have thrown ERR_NETWORK_DISCONNECTED");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_NETWORK_DISCONNECTED");
                expect(genErr.title).toBe("Network Connection Failed");
                expect(genErr.details).toContain("network connection is unavailable or timed out");
                expect(genErr.action).toContain("internet connection");
            }
        });
    });

    describe("10. moodlePath existe pero no tiene permisos de lectura", () => {
        it("should throw ERR_MOODLE_PATH_PERMISSION_DENIED when local moodlePath exists but lacks read permissions", async () => {
            const moodleDir = path.join(tempDir, "moodle-unreadable");
            await fs.mkdir(moodleDir, { recursive: true });

            const accessSpy = vi.spyOn(fs, "access").mockImplementation(async (target, mode) => {
                if (target === moodleDir && mode === fs.constants.R_OK) {
                    const err = new Error("EACCES: permission denied") as NodeJS.ErrnoException;
                    err.code = "EACCES";
                    throw err;
                }
            });

            try {
                await verifyLocalMoodlePath(moodleDir);
                expect.unreachable("Should have thrown ERR_MOODLE_PATH_PERMISSION_DENIED");
            } catch (err: unknown) {
                const genErr = err as MoodleGeneratorError;
                expect(genErr.code).toBe("ERR_MOODLE_PATH_PERMISSION_DENIED");
                expect(genErr.title).toBe("Moodle Path Permission Denied");
                expect(genErr.details).toContain("Permission denied when accessing Moodle codebase");
                expect(genErr.action).toContain("chmod u+rx");
                expect(genErr.action).toContain("npx moodle-delete-schemas");
                expect(genErr.action).toContain("npx moodle-create-schemas");
            } finally {
                accessSpy.mockRestore();
            }
        });

        it("should throw error in validateLocalPathInput when directory lacks read permissions", async () => {
            const moodleDir = path.join(tempDir, "moodle-input-unreadable");
            await fs.mkdir(moodleDir, { recursive: true });
            await fs.chmod(moodleDir, 0);

            try {
                expect(() => validateLocalPathInput(moodleDir)).toThrowError(
                    /Permission denied: Cannot read directory/
                );
            } finally {
                await fs.chmod(moodleDir, 0o755);
            }
        });
    });

    describe("Uniform Error Output & Color Formatting", () => {
        it("should format MoodleGeneratorError with uniform CLI structure and colors", () => {
            const err = createGeneratorError({
                code: "ERR_SCHEMA_MALFORMED",
                title: "Malformed Web Service Schema",
                details: "Schema is empty.",
                action: "Run 'npx moodle-delete-schemas' and 'npx moodle-create-schemas'.",
            });

            const formatted = formatGeneratorError(err, true);
            expect(formatted).toContain("[moodle-client] ERROR:");
            expect(formatted).toContain("Malformed Web Service Schema");
            expect(formatted).toContain("(ERR_SCHEMA_MALFORMED)");
            expect(formatted).toContain("Details:");
            expect(formatted).toContain("Action:");

            const plain = formatGeneratorError(err, false);
            expect(plain).toBe(
                "[moodle-client] ERROR: Malformed Web Service Schema (ERR_SCHEMA_MALFORMED)\nDetails: Schema is empty.\nAction:  Run 'npx moodle-delete-schemas' and 'npx moodle-create-schemas'."
            );
        });

        it("should format generic unknown errors uniformly", () => {
            const genericErr = new Error("Unexpected disk failure");
            const plain = formatGeneratorError(genericErr, false);
            expect(plain).toContain("[moodle-client] ERROR: Operation Failed (ERR_UNKNOWN)");
            expect(plain).toContain("Unexpected disk failure");
            expect(plain).toContain("Verify your configuration and system environment.");
        });
    });
});
