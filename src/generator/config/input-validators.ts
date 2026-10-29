import { existsSync, accessSync, constants } from "fs";
import path from "path";
import os from "os";
import {
    normalizeMoodleVersion,
    isMoodleVersionSupported,
    describeInvalidNamespace,
} from "./config-manager";
import { SourceType, BUNDLED_NAMESPACE } from "../interfaces/config.interfaces";
import { localPathEnvVar } from "./local-path";

/**
 * Validators shared by the interactive wizards and the one-line (flag) mode of the CLIs.
 * Each one returns the normalized value or throws an Error with a user-facing message.
 */

export function parseWebservicesInput(input: string): string[] {
    const trimmed = input.trim();
    if (!trimmed || trimmed === "[]") {
        throw new Error("Webservices pattern cannot be empty.");
    }

    let items: string[];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                items = parsed.map((s) => String(s));
            } else {
                items = [trimmed];
            }
        } catch {
            const inner = trimmed.slice(1, -1);
            items = inner.split(",");
        }
    } else {
        items = trimmed.split(",");
    }

    const filtered = items
        .map((s) => s.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, ""))
        .filter((s) => s.length > 0);

    if (filtered.length === 0) {
        throw new Error("Webservices pattern cannot be empty.");
    }
    return filtered;
}

export function validateNamespace(
    namespace: string,
    existingNamespaces: Set<string>
): boolean {
    const trimmed = namespace.trim();
    const problem = describeInvalidNamespace(trimmed);
    if (problem) {
        throw new Error(problem);
    }
    if (trimmed === BUNDLED_NAMESPACE) {
        throw new Error(`'${BUNDLED_NAMESPACE}' is reserved for the web services bundled with the package. Choose another name.`);
    }
    if (existingNamespaces.has(trimmed)) {
        throw new Error(`Namespace '${trimmed}' already exists.`);
    }
    // Checked for every source type: a namespace can become local later with moodle-update-schemas
    const envVar = localPathEnvVar(trimmed);
    const clash = [...existingNamespaces].find((existing) => localPathEnvVar(existing) === envVar);
    if (clash) {
        throw new Error(
            `Namespace '${trimmed}' would share the environment variable ${envVar} with '${clash}', which gives the path of a local source. Choose a name that differs from '${clash}' in more than upper or lower case and symbols.`
        );
    }
    return true;
}

/**
 * Maps the wizard's numbered source menu to a source type.
 */
export function validateSourceOption(option: string): SourceType {
    const trimmed = option.trim();
    if (trimmed === "1") {
        return "moodle-official";
    }
    if (trimmed === "2") {
        return "moodle-local";
    }
    if (trimmed === "3") {
        return "moodle-repository";
    }
    throw new Error("Invalid option. Please enter 1, 2, or 3.");
}

export function validateRepositoryUrlInput(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) {
        throw new Error("Repository URL cannot be empty.");
    }
    if (!/^(https?:\/\/|git@|ssh:\/\/).+/i.test(trimmed)) {
        throw new Error("Invalid repository URL. Must start with http://, https://, git@, or ssh://");
    }
    return trimmed;
}

export function validateBranchInput(branch: string): string {
    const trimmed = branch.trim();
    if (!trimmed) {
        return "main";
    }
    return trimmed;
}

export function validateMoodleVersionInput(version: string): string {
    const trimmed = version.trim();
    if (!trimmed) {
        throw new Error("Version cannot be empty.");
    }
    if (!isMoodleVersionSupported(trimmed)) {
        throw new Error(
            `Moodle version '${trimmed}' is unsupported. Web services schema generation requires Moodle 2.0 or higher.`
        );
    }
    return normalizeMoodleVersion(trimmed);
}

export function validateLocalPathInput(rawPath: string): string {
    const trimmed = rawPath.trim();
    if (!trimmed) {
        throw new Error("Path cannot be empty.");
    }
    const resolved = trimmed.startsWith("~/")
        ? path.join(os.homedir(), trimmed.slice(2))
        : path.resolve(process.cwd(), trimmed);
    if (!existsSync(resolved)) {
        throw new Error(`Directory '${resolved}' does not exist.`);
    }
    try {
        accessSync(resolved, constants.R_OK | (constants.X_OK ?? 0));
    } catch (err: unknown) {
        const error = err as NodeJS.ErrnoException;
        if (error.code === "EACCES" || error.code === "EPERM") {
            throw new Error(`Permission denied: Cannot read directory '${resolved}'. Grant read permissions (e.g. chmod u+rx '${resolved}').`);
        }
    }
    return trimmed;
}

export function validateOutDirInput(outDir: string): string {
    const trimmed = outDir.trim();
    if (!trimmed) {
        throw new Error("Path cannot be empty.");
    }
    return trimmed;
}
