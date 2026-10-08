import fs from "fs/promises";
import path from "path";
import child_process from "child_process";
import { MoodleGeneratorError } from "@didactika/moodle-client-schemas";
import { ExtendedGeneratorErrorOptions } from "../interfaces/config.interfaces";
import { colors } from "../ui/prompt-helpers";

export function createGeneratorError(options: ExtendedGeneratorErrorOptions): MoodleGeneratorError {
    return new MoodleGeneratorError(options as unknown as {
        code: import("@didactika/moodle-client-schemas").MoodleGeneratorErrorCode;
        title: string;
        details: string;
        action: string;
        cause?: unknown;
    });
}

/**
 * Checks whether the PHP CLI binary is installed and has a supported version (>= 7.4).
 */
export async function checkPhpEnvironment(): Promise<void> {
    return new Promise((resolve, reject) => {
        child_process.exec("php -v", (error, stdout) => {
            if (error) {
                const isNotFound =
                    (error as unknown as Record<string, unknown>).code === "ENOENT" ||
                    /not found|not recognized/i.test(error.message);
                if (isNotFound) {
                    reject(
                        createGeneratorError({
                            code: "ERR_PHP_NOT_FOUND",
                            title: "PHP CLI Not Found",
                            details: "PHP CLI was not found on your system PATH.",
                            action: 'Install PHP 7.4 or higher (PHP 8.1+ recommended) and ensure the "php" executable is accessible in your system PATH.',
                            cause: error,
                        })
                    );
                    return;
                }
            }

            const match = /PHP\s+(\d+)\.(\d+)/i.exec(stdout || "");
            if (match && match[1]) {
                const major = parseInt(match[1], 10);
                const minor = match[2] ? parseInt(match[2], 10) : 0;
                if (major < 7 || (major === 7 && minor < 4)) {
                    reject(
                        createGeneratorError({
                            code: "ERR_PHP_VERSION_UNSUPPORTED",
                            title: "Unsupported PHP Version",
                            details: `Unsupported PHP version detected (PHP ${major}.${minor}). Moodle schema extraction requires PHP 7.4 or higher.`,
                            action: "Upgrade your PHP CLI installation to PHP 7.4 or higher.",
                        })
                    );
                    return;
                }
            }
            resolve();
        });
    });
}

/**
 * Checks whether the Git CLI binary is installed and executable in PATH.
 */
export async function checkGitEnvironment(): Promise<void> {
    return new Promise((resolve, reject) => {
        child_process.exec("git --version", (error) => {
            if (error) {
                reject(
                    createGeneratorError({
                        code: "ERR_GIT_NOT_FOUND",
                        title: "Git Executable Not Found",
                        details: "Git CLI is not installed or not accessible in your system PATH.",
                        action: 'Install Git and ensure the "git" executable is accessible in your system PATH.',
                        cause: error,
                    })
                );
                return;
            }
            resolve();
        });
    });
}

/**
 * Recursively inspects all .webservice.d.ts files in a directory to ensure they are valid
 * and declare exported types.
 */
export async function validateSchemaDeclarations(dir: string, namespace: string): Promise<void> {
    let entries: import("fs").Dirent[];
    try {
        entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
        return;
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await validateSchemaDeclarations(fullPath, namespace);
        } else if (
            entry.name.endsWith(".webservice.d.ts") ||
            entry.name.endsWith(".webservice-client.d.ts")
        ) {
            const stat = await fs.stat(fullPath);
            if (stat.size === 0) {
                throw createGeneratorError({
                    code: "ERR_SCHEMA_MALFORMED",
                    title: "Malformed Web Service Schema",
                    details: `Web service schema file '${path.relative(process.cwd(), fullPath)}' in namespace '${namespace}' is empty (0 bytes).`,
                    action: `Run 'npx moodle-delete-schemas' to select and delete the corrupted schema '${namespace}', then run 'npx moodle-create-schemas' to recreate it.`,
                });
            }

            const content = await fs.readFile(fullPath, "utf-8");
            const hasExportedTypes = /\bexport\s+(type|interface|const|declare|function|class)\b/.test(
                content
            ) || /\bexport\s*\{/.test(content);

            if (!hasExportedTypes) {
                throw createGeneratorError({
                    code: "ERR_SCHEMA_MALFORMED",
                    title: "Malformed Web Service Schema",
                    details: `Web service schema file '${path.relative(process.cwd(), fullPath)}' in namespace '${namespace}' does not contain exported type declarations.`,
                    action: `Run 'npx moodle-delete-schemas' to select and delete the corrupted schema '${namespace}', then run 'npx moodle-create-schemas' to recreate it.`,
                });
            }
        }
    }
}

/**
 * Verifies that if an output directory exists on disk, it is not completely empty.
 */
export async function validateOutputDirectoryNotEmpty(outDir: string, namespace?: string): Promise<void> {
    const exists = await fs.access(outDir).then(() => true).catch(() => false);
    if (!exists) {
        return;
    }
    const entries = await fs.readdir(outDir);
    if (entries.length === 0) {
        const nsMsg = namespace ? ` for namespace '${namespace}'` : "";
        throw createGeneratorError({
            code: "ERR_OUTPUT_DIRECTORY_EMPTY",
            title: "Output Directory Is Empty",
            details: `The output directory '${path.relative(process.cwd(), outDir) || outDir}'${nsMsg} exists but is completely empty. There are no generated schemas to delete.`,
            action: "Run 'npx moodle-generate-schemas' to compile and generate schemas, or remove the configuration from package.json.",
        });
    }
}

/**
 * Formats any error into the uniform CLI layout adhering to the color scheme and structure.
 */
export function formatGeneratorError(error: unknown, useColors = true): string {
    if (
        error instanceof MoodleGeneratorError ||
        (typeof error === "object" &&
            error !== null &&
            "title" in error &&
            "code" in error &&
            "details" in error &&
            "action" in error)
    ) {
        const err = error as { title: string; code: string; details: string; action: string };
        if (useColors) {
            return (
                `${colors.red("[moodle-client] ERROR:")} ${colors.bold(err.title)} ${colors.dim(`(${err.code})`)}\n` +
                `${colors.bold("Details:")} ${err.details}\n` +
                `${colors.orange("Action:")}  ${err.action}`
            );
        }
        return `[moodle-client] ERROR: ${err.title} (${err.code})\nDetails: ${err.details}\nAction:  ${err.action}`;
    }

    const message = error instanceof Error ? error.message : String(error);
    if (useColors) {
        return (
            `${colors.red("[moodle-client] ERROR:")} ${colors.bold("Operation Failed")} ${colors.dim("(ERR_UNKNOWN)")}\n` +
            `${colors.bold("Details:")} ${message}\n` +
            `${colors.orange("Action:")}  Verify your configuration and system environment.`
        );
    }
    return `[moodle-client] ERROR: Operation Failed (ERR_UNKNOWN)\nDetails: ${message}\nAction:  Verify your configuration and system environment.`;
}
