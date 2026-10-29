import path from "path";
import os from "os";
import { createGeneratorError } from "./config-manager";
import { validateLocalPathInput } from "./input-validators";

/**
 * The path of a local Moodle checkout differs on every machine, so it is never saved. When a
 * namespace with a local source is generated, it comes from (in this order) `--source.path`, the
 * `MOODLE_<NAMESPACE>_PATH` environment variable, or a prompt; without a terminal to ask on, the
 * run fails with a clear error instead of waiting for an answer.
 */

/**
 * Name of the environment variable holding the local path of a namespace:
 * `localDev` -> `MOODLE_LOCALDEV_PATH`.
 */
export function localPathEnvVar(namespace: string): string {
    return `MOODLE_${namespace.toUpperCase().replace(/[^A-Z0-9_]/g, "_")}_PATH`;
}

/**
 * Expands `~/` and resolves a relative path against the current directory.
 */
export function absoluteLocalPath(rawPath: string): string {
    const trimmed = rawPath.trim();
    return trimmed.startsWith("~/") ? path.join(os.homedir(), trimmed.slice(2)) : path.resolve(process.cwd(), trimmed);
}

export interface ResolveLocalPathOptions {
    /** Value of `--source.path`, when given */
    flagPath?: string;
    /** Environment to read `MOODLE_<NAMESPACE>_PATH` from (default process.env) */
    env?: NodeJS.ProcessEnv;
    /** Asks the user; undefined when there is no terminal to ask on */
    ask?: (namespace: string) => Promise<string>;
}

function invalidPath(namespace: string, origin: string, message: string) {
    return createGeneratorError({
        code: "ERR_CLI_INVALID_OPTION",
        title: "Invalid Option Value",
        details: `${origin} (local path of '${namespace}'): ${message}`,
        action: `Fix the value of ${origin} and run the command again.`,
    });
}

function validatedFrom(namespace: string, origin: string, value: string): string {
    try {
        return absoluteLocalPath(validateLocalPathInput(value));
    } catch (err: unknown) {
        throw invalidPath(namespace, origin, err instanceof Error ? err.message : String(err));
    }
}

/**
 * Error raised when a local path is needed but was given in no way and cannot be asked for.
 */
export function localPathRequiredError(namespace: string) {
    const envVar = localPathEnvVar(namespace);
    return createGeneratorError({
        code: "ERR_LOCAL_PATH_REQUIRED",
        title: "Local Moodle Path Required",
        details: `Namespace '${namespace}' is generated from a local Moodle checkout, whose path is not saved, and there is no terminal to ask for it.`,
        action: `Set ${envVar}=<path to Moodle> before the command, or run it in a terminal to be asked for the path.`,
    });
}

/**
 * Returns the absolute local path to generate `namespace` from.
 */
export async function resolveLocalPath(namespace: string, options: ResolveLocalPathOptions = {}): Promise<string> {
    if (options.flagPath !== undefined) {
        return validatedFrom(namespace, "--source.path", options.flagPath);
    }
    const envVar = localPathEnvVar(namespace);
    const fromEnv = (options.env ?? process.env)[envVar];
    if (fromEnv !== undefined && fromEnv.trim() !== "") {
        return validatedFrom(namespace, envVar, fromEnv);
    }
    if (options.ask) {
        return absoluteLocalPath(await options.ask(namespace));
    }
    throw localPathRequiredError(namespace);
}
