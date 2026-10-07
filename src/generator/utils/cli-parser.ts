import {
    CliOptions,
    CreateCliOptions,
    DeleteCliOptions,
} from "../interfaces/cli.interfaces";

/**
 * Extracts configuration file path from argument list (`--config <path>` or `--config=<path>`).
 */
export function parseConfigArg(args: string[]): string | undefined {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--config" && i + 1 < args.length) {
            return args[i + 1];
        }
        if (arg.startsWith("--config=")) {
            return arg.slice("--config=".length);
        }
    }
    return undefined;
}

/**
 * Checks whether force flag (`--force`, `-f`, or `--f`) is present in arguments.
 */
export function parseForceArg(args: string[]): boolean {
    return args.some((arg) => arg === "--force" || arg === "-f" || arg === "--f");
}

/**
 * Parses command line options for `moodle-generate-schemas`.
 */
export function parseCliArgs(args: string[]): CliOptions {
    return {
        configPath: parseConfigArg(args),
        force: parseForceArg(args),
    };
}

/**
 * Parses command line options for `moodle-create-schemas`.
 */
export function parseCreateCliArgs(args: string[]): CreateCliOptions {
    return {
        configPath: parseConfigArg(args),
    };
}

/**
 * Parses command line options for `moodle-delete-schemas`.
 */
export function parseDeleteCliArgs(args: string[]): DeleteCliOptions {
    return {
        configPath: parseConfigArg(args),
    };
}
