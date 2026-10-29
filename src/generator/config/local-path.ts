import path from "path";
import os from "os";
import { createGeneratorError } from "./config-manager";
import { validateLocalPathInput } from "./input-validators";

/**
 * The path of a local Moodle checkout differs on every machine, so it is never saved. When a
 * namespace with a local source is generated, it comes from `--source.path` (create and update) or
 * is asked in the terminal; without a terminal to ask on, the run fails with a clear error instead
 * of waiting for an answer.
 */

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
    /** Asks the user; undefined when there is no terminal to ask on */
    ask?: (namespace: string) => Promise<string>;
}

/**
 * Error raised when a local path is needed but was not given and cannot be asked for.
 */
export function localPathRequiredError(namespace: string) {
    return createGeneratorError({
        code: "ERR_LOCAL_PATH_REQUIRED",
        title: "Local Moodle Path Required",
        details: `Namespace '${namespace}' is generated from a local Moodle checkout, whose path is not saved, and there is no terminal to ask for it.`,
        action: `Run the command in a terminal to be asked for the path, or pass it with '--source.path <dir>' to 'npx moodle-create-schemas' or 'npx moodle-update-schemas --namespace ${namespace} --sync'.`,
    });
}

/**
 * Returns the absolute local path to generate `namespace` from.
 */
export async function resolveLocalPath(namespace: string, options: ResolveLocalPathOptions = {}): Promise<string> {
    if (options.flagPath !== undefined) {
        try {
            return absoluteLocalPath(validateLocalPathInput(options.flagPath));
        } catch (err: unknown) {
            throw createGeneratorError({
                code: "ERR_CLI_INVALID_OPTION",
                title: "Invalid Option Value",
                details: `--source.path (local path of '${namespace}'): ${err instanceof Error ? err.message : String(err)}`,
                action: "Fix the value of --source.path and run the command again.",
            });
        }
    }
    if (options.ask) {
        return absoluteLocalPath(await options.ask(namespace));
    }
    throw localPathRequiredError(namespace);
}
