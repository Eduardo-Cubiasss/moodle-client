import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
    validateSourceOption,
    validateRepositoryUrlInput,
    validateBranchInput,
    promptCreateSchemas,
} from "../../../src/generator/interactive/create-schemas";
import {
    syncSubmodulesResilient,
    cloneRepository,
    cleanupRepository,
} from "../../../src/generator/downloader/git-repository-downloader";
import { sanitizeGitError } from "../../../src/generator/auth/credential-manager";
import { loadPackageConfig } from "../../../src/generator/config/config-manager";

describe("Remote Repository & Submodules Suite (Punto 5)", () => {
    let tempDir: string;
    let pkgJsonPath: string;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "repo-test-"));
        pkgJsonPath = path.join(tempDir, "package.json");
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    describe("1. Validacion y Parsers de Repositorio", () => {
        it("VAL-01: debe permitir la opcion '3' y retornar 'repository'", () => {
            expect(validateSourceOption("3")).toBe("repository");
            expect(validateSourceOption("  3  ")).toBe("repository");
        });

        it("VAL-02: debe validar URLs de repositorio validas", () => {
            expect(validateRepositoryUrlInput("https://github.com/my-org/moodle.git")).toBe(
                "https://github.com/my-org/moodle.git"
            );
            expect(validateRepositoryUrlInput("http://gitlab.internal/moodle.git")).toBe(
                "http://gitlab.internal/moodle.git"
            );
            expect(validateRepositoryUrlInput("git@github.com:my-org/moodle.git")).toBe(
                "git@github.com:my-org/moodle.git"
            );
            expect(validateRepositoryUrlInput("ssh://git@gitlab.com/org/repo.git")).toBe(
                "ssh://git@gitlab.com/org/repo.git"
            );
        });

        it("VAL-03: debe rechazar URLs vacias o con protocolos invalidos", () => {
            expect(() => validateRepositoryUrlInput("")).toThrow(/empty/i);
            expect(() => validateRepositoryUrlInput("   ")).toThrow(/empty/i);
            expect(() => validateRepositoryUrlInput("ftp://ftp.example.com/moodle")).toThrow(/invalid/i);
            expect(() => validateRepositoryUrlInput("invalid-plain-text")).toThrow(/invalid/i);
        });

        it("VAL-04: debe normalizar ramas y aplicar fallback 'main'", () => {
            expect(validateBranchInput("MOODLE_405_STABLE")).toBe("MOODLE_405_STABLE");
            expect(validateBranchInput("v5.3.0")).toBe("v5.3.0");
            expect(validateBranchInput("")).toBe("main");
            expect(validateBranchInput("   ")).toBe("main");
        });

        it("VAL-05: loadPackageConfig debe procesar correctamente source tipo repository con outDir obligatorio", async () => {
            await fs.writeFile(
                pkgJsonPath,
                JSON.stringify({
                    name: "test-app",
                    version: "1.0.0",
                    "moodle-client": [
                        {
                            namespace: "custom-repo",
                            source: {
                                type: "repository",
                                url: "https://gitlab.myorg.com/moodle.git",
                                branch: "UEA_MASTER",
                            },
                            webservices: ["core_user_*"],
                            outDir: "src/schemas",
                        },
                    ],
                }),
                "utf-8"
            );

            const configs = await loadPackageConfig(pkgJsonPath);
            expect(configs).toHaveLength(1);
            expect(configs[0].namespace).toBe("custom-repo");
            expect(configs[0].source.type).toBe("repository");
            expect((configs[0].source as any).url).toBe("https://gitlab.myorg.com/moodle.git");
            expect((configs[0].source as any).branch).toBe("UEA_MASTER");
            expect(configs[0].outDir).toBe("src/schemas");
        });

        it("VAL-06: loadPackageConfig debe fallar si outDir no esta presente en tipo repository", async () => {
            await fs.writeFile(
                pkgJsonPath,
                JSON.stringify({
                    name: "test-app",
                    version: "1.0.0",
                    "moodle-client": [
                        {
                            namespace: "custom-repo",
                            source: {
                                type: "repository",
                                url: "https://gitlab.myorg.com/moodle.git",
                            },
                            webservices: ["*"],
                        },
                    ],
                }),
                "utf-8"
            );

            await expect(loadPackageConfig(pkgJsonPath)).rejects.toThrow(
                /Missing outDir in Repository Mode/i
            );
        });

        it("VAL-07: loadPackageConfig debe fallar si source.url no esta presente en tipo repository", async () => {
            await fs.writeFile(
                pkgJsonPath,
                JSON.stringify({
                    name: "test-app",
                    version: "1.0.0",
                    "moodle-client": [
                        {
                            namespace: "custom-repo",
                            source: {
                                type: "repository",
                            },
                            webservices: ["*"],
                            outDir: "src/schemas",
                        },
                    ],
                }),
                "utf-8"
            );

            await expect(loadPackageConfig(pkgJsonPath)).rejects.toThrow(
                /Missing Repository URL/i
            );
        });
    });

    describe("2. Flujo Interactivo y Seguridad de Credenciales (SEC-01)", () => {
        it("SEC-01: debe persistir en package.json con outDir obligatorio sin almacenar tokens ni contrasenas", async () => {
            const mockAnswers = [
                "campus-remote",                       // 1. Namespace
                "3",                                   // 2. Option: Repository
                "https://gitlab.myorg.com/moodle.git", // 3. URL
                "MOODLE_405_STABLE",                   // 4. Branch
                "core_user_*, local_custom_*",         // 5. Webservices
                "src/moodleSchemas",                   // 6. OutDir (obligatorio)
                "n",                                   // 7. Create another: no
            ];

            const runnerMock = vi.fn().mockResolvedValue(undefined);
            const created = await promptCreateSchemas({
                pkgPath: pkgJsonPath,
                mockAnswers,
                generatorRunner: runnerMock,
            });

            expect(created).toHaveLength(1);
            expect(created[0].namespace).toBe("campus-remote");
            expect(created[0].source.type).toBe("repository");
            expect(created[0].outDir).toBe("src/moodleSchemas");

            const content = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"));
            const entry = content["moodle-client"][0];

            expect(entry.namespace).toBe("campus-remote");
            expect(entry.source.type).toBe("repository");
            expect(entry.source.url).toBe("https://gitlab.myorg.com/moodle.git");
            expect(entry.source.branch).toBe("MOODLE_405_STABLE");
            expect(entry.webservices).toEqual(["core_user_*", "local_custom_*"]);
            expect(entry.outDir).toBe("src/moodleSchemas");

            // Verificacion critica de seguridad: NINGUNA credencial en disco
            expect((entry.source as any).token).toBeUndefined();
            expect((entry.source as any).password).toBeUndefined();
            expect(entry.source.url).not.toContain("@");
        });

        it("SEC-02: debe redactar secretos de mensajes de error de Git", () => {
            const secret = "glpat-secret-token-99999";
            const rawError = `fatal: Authentication failed for 'https://user:${secret}@gitlab.com/repo.git'`;
            const sanitized = sanitizeGitError(rawError, secret);

            expect(sanitized).not.toContain(secret);
            expect(sanitized).toContain("[REDACTED]");
        });
    });

    describe("3. Forzado de Errores y Resiliencia en Submodulos (SUB-01 a SUB-04)", () => {
        it("SUB-01: debe ignorar repositorios sin .gitmodules sin lanzar error", async () => {
            const fakeGit = {
                submoduleUpdate: vi.fn(),
                raw: vi.fn(),
            } as any;

            const res = await syncSubmodulesResilient(fakeGit, tempDir, true);
            expect(res.total).toBe(0);
            expect(res.successful).toBe(0);
            expect(res.failed).toHaveLength(0);
            expect(fakeGit.submoduleUpdate).not.toHaveBeenCalled();
        });

        it("SUB-02: debe realizar sincronizacion rapida en lote con --jobs 8 si todo es accesible", async () => {
            await fs.writeFile(path.join(tempDir, ".gitmodules"), "[submodule] path=local/foo\n", "utf-8");
            const fakeGit = {
                submoduleUpdate: vi.fn().mockResolvedValue(undefined),
            } as any;

            const res = await syncSubmodulesResilient(fakeGit, tempDir, true);
            expect(res.successful).toBe(1);
            expect(res.failed).toHaveLength(0);
            expect(fakeGit.submoduleUpdate).toHaveBeenCalledWith([
                "--init",
                "--recursive",
                "--depth",
                "1",
                "--shallow-submodules",
                "--jobs",
                "8",
            ]);
        });

        it("SUB-03/04: cuando un submodulo es inaccesible (403/404), debe recuperarse y no cancelar el proceso", async () => {
            await fs.writeFile(path.join(tempDir, ".gitmodules"), "dummy-content", "utf-8");

            const fakeGit = {
                submoduleUpdate: vi
                    .fn()
                    // 1. Falla el intento por lote
                    .mockRejectedValueOnce(new Error("fatal: clone of 'https://gitlab.com/404.git' into submodule path 'theme/broken' failed"))
                    // 2. Fallback individual: 'local/plugin1' descarga con exito
                    .mockResolvedValueOnce(undefined)
                    // 3. Fallback individual: 'local/secret' falla (403)
                    .mockRejectedValueOnce(new Error("Permission denied (403)")),
                raw: vi.fn().mockResolvedValue(
                    " 16c68a... local/plugin1 (heads/main)\n-34a81b... local/secret (heads/main)"
                ),
            } as any;

            const res = await syncSubmodulesResilient(fakeGit, tempDir, true);

            // Debe rescatar el submodulo accesible
            expect(res.successful).toBe(1);
            expect(res.failed).toContain("local/secret");
            expect(fakeGit.submoduleUpdate).toHaveBeenCalledTimes(3);
        });

        it("debe manejar fallos en submodule status durante fallback", async () => {
            await fs.writeFile(path.join(tempDir, ".gitmodules"), "dummy", "utf-8");
            const fakeGit = {
                submoduleUpdate: vi.fn().mockRejectedValueOnce(new Error("Batch failed")),
                raw: vi.fn().mockRejectedValueOnce(new Error("status command failed")),
            } as any;

            const res = await syncSubmodulesResilient(fakeGit, tempDir, true);
            expect(res.successful).toBe(0);
            expect(res.failed).toContain("submodule-status-failed");
        });
    });

    describe("4. Forzado de Errores en Clonacion Principal (CLN-01 a CLN-04)", () => {
        it("CLN-01: debe pasar las banderas optimizadas a simple-git", async () => {
            const fakeGit = {
                clone: vi.fn().mockResolvedValue(undefined),
                submoduleUpdate: vi.fn().mockResolvedValue(undefined),
            };

            await cloneRepository({
                repoUrl: "https://github.com/moodle/moodle.git",
                branch: "MOODLE_405_STABLE",
                targetPath: tempDir,
                gitInstance: fakeGit as any,
                silent: true,
            });

            expect(fakeGit.clone).toHaveBeenCalledWith(
                "https://github.com/moodle/moodle.git",
                tempDir,
                ["--depth", "1", "--single-branch", "--no-tags", "--branch", "MOODLE_405_STABLE"]
            );
        });

        it("CLN-04: debe sanitizar y propagar error explicito si la rama remota no existe", async () => {
            const secret = "super-secret-token";
            const fakeGit = {
                clone: vi.fn().mockRejectedValue(
                    new Error(`fatal: Remote branch non-existent not found for https://user:${secret}@github.com/moodle.git`)
                ),
            };

            await expect(
                cloneRepository({
                    repoUrl: "https://github.com/moodle/moodle.git",
                    branch: "non-existent",
                    targetPath: tempDir,
                    token: secret,
                    gitInstance: fakeGit as any,
                    silent: true,
                })
            ).rejects.toThrow(/\[REDACTED\]/);
        });

        it("debe limpiar el directorio del repositorio en cleanupRepository", async () => {
            const testFile = path.join(tempDir, "file.txt");
            await fs.writeFile(testFile, "hello", "utf-8");
            expect(await fs.stat(testFile).then(() => true)).toBe(true);

            await cleanupRepository(tempDir);
            expect(await fs.stat(tempDir).then(() => true).catch(() => false)).toBe(false);
        });
    });
});
