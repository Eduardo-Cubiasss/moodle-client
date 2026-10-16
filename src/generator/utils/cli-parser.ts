import {
    CliOptions,
    CreateCliOptions,
    DeleteCliOptions,
    SchemaEntryFlags,
    UpdateCliOptions,
} from "../interfaces/cli.interfaces";
import { createGeneratorError } from "../config/config-manager";

/** Flags that take a value, mapped to their key in SchemaEntryFlags. */
const ENTRY_FLAGS: Readonly<Record<string, keyof SchemaEntryFlags>> = {
    "--namespace": "namespace",
    "--source.type": "sourceType",
    "--source.version": "sourceVersion",
    "--source.url": "sourceUrl",
    "--source.branch": "sourceBranch",
    "--source.path": "sourcePath",
    "--webservices": "webservices",
    "--outDir": "outDir",
};

const HELP_FLAGS = ["--help", "-h"];
const FORCE_FLAGS = ["--force", "-f", "--f"];

interface FlagSpec {
    /** Command name shown in error messages */
    command: string;
    /** Flags that take a value */
    valueFlags: readonly string[];
    /** Flags that take no value */
    booleanFlags: readonly string[];
}

interface ParsedArgs {
    values: Map<string, string[]>;
    booleans: Set<string>;
}

function unknownOptionError(command: string, arg: string) {
    return createGeneratorError({
        code: "ERR_CLI_UNKNOWN_OPTION",
        title: "Unknown Option",
        details: `'${command}' does not accept the option '${arg}'.`,
        action: `Run 'npx ${command} --help' to list the accepted options.`,
    });
}

function missingValueError(command: string, flag: string) {
    return createGeneratorError({
        code: "ERR_CLI_MISSING_OPTION",
        title: "Missing Option Value",
        details: `Option '${flag}' of '${command}' needs a value.`,
        action: `Pass it as '${flag} <value>' or '${flag}=<value>'.`,
    });
}

/**
 * Splits `--flag=value` into its parts; other arguments are returned unchanged.
 */
function splitInlineValue(arg: string): { flag: string; inline?: string } {
    const eq = arg.indexOf("=");
    if (arg.startsWith("--") && eq > 2) {
        return { flag: arg.slice(0, eq), inline: arg.slice(eq + 1) };
    }
    return { flag: arg };
}

/**
 * Strict parser: every argument must be a known flag, and value flags must have a value.
 * Supports `--flag value` and `--flag=value`; a value flag may be repeated.
 */
function parseArgs(args: string[], spec: FlagSpec): ParsedArgs {
    const values = new Map<string, string[]>();
    const booleans = new Set<string>();

    for (let i = 0; i < args.length; i++) {
        const raw = args[i];
        if (raw === undefined) continue;
        const { flag, inline } = splitInlineValue(raw);

        if (spec.booleanFlags.includes(flag) && inline === undefined) {
            booleans.add(flag);
            continue;
        }
        if (!spec.valueFlags.includes(flag)) {
            throw unknownOptionError(spec.command, raw);
        }

        let value = inline;
        if (value === undefined) {
            const next = args[i + 1];
            if (next === undefined || next.startsWith("--")) {
                throw missingValueError(spec.command, flag);
            }
            value = next;
            i++;
        }
        values.set(flag, [...(values.get(flag) ?? []), value]);
    }

    return { values, booleans };
}

function last(parsed: ParsedArgs, flag: string): string | undefined {
    const all = parsed.values.get(flag);
    return all ? all[all.length - 1] : undefined;
}

function hasAny(parsed: ParsedArgs, flags: readonly string[]): boolean {
    return flags.some((flag) => parsed.booleans.has(flag));
}

/**
 * Collects the schema entry flags; returns undefined when none was given.
 */
function readEntryFlags(parsed: ParsedArgs): SchemaEntryFlags | undefined {
    const entry: SchemaEntryFlags = {};
    let found = false;
    for (const [flag, key] of Object.entries(ENTRY_FLAGS)) {
        const value = last(parsed, flag);
        if (value !== undefined) {
            entry[key] = value;
            found = true;
        }
    }
    return found ? entry : undefined;
}

/**
 * Parses command line options for `moodle-generate-schemas`.
 * `--namespace` may be repeated or hold a comma-separated list.
 */
export function parseCliArgs(args: string[]): CliOptions {
    const parsed = parseArgs(args, {
        command: "moodle-generate-schemas",
        valueFlags: ["--config", "--namespace"],
        booleanFlags: [...FORCE_FLAGS, ...HELP_FLAGS],
    });
    const namespaces = (parsed.values.get("--namespace") ?? [])
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
    return {
        configPath: last(parsed, "--config"),
        force: hasAny(parsed, FORCE_FLAGS),
        ...(namespaces.length > 0 ? { namespaces } : {}),
        ...(hasAny(parsed, HELP_FLAGS) ? { help: true } : {}),
    };
}

/**
 * Parses command line options for `moodle-create-schemas`.
 */
export function parseCreateCliArgs(args: string[]): CreateCliOptions {
    const parsed = parseArgs(args, {
        command: "moodle-create-schemas",
        valueFlags: ["--config", ...Object.keys(ENTRY_FLAGS)],
        booleanFlags: HELP_FLAGS,
    });
    const entry = readEntryFlags(parsed);
    return {
        configPath: last(parsed, "--config"),
        ...(entry ? { entry } : {}),
        ...(hasAny(parsed, HELP_FLAGS) ? { help: true } : {}),
    };
}

/**
 * Parses command line options for `moodle-update-schemas`.
 */
export function parseUpdateCliArgs(args: string[]): UpdateCliOptions {
    const parsed = parseArgs(args, {
        command: "moodle-update-schemas",
        valueFlags: ["--config", ...Object.keys(ENTRY_FLAGS)],
        booleanFlags: ["--sync", ...HELP_FLAGS],
    });
    const entry = readEntryFlags(parsed);
    return {
        configPath: last(parsed, "--config"),
        ...(entry ? { entry } : {}),
        ...(parsed.booleans.has("--sync") ? { sync: true } : {}),
        ...(hasAny(parsed, HELP_FLAGS) ? { help: true } : {}),
    };
}

/**
 * Parses command line options for `moodle-delete-schemas`.
 */
export function parseDeleteCliArgs(args: string[]): DeleteCliOptions {
    const parsed = parseArgs(args, {
        command: "moodle-delete-schemas",
        valueFlags: ["--config", "--namespace"],
        booleanFlags: ["--purge", ...HELP_FLAGS],
    });
    const namespace = last(parsed, "--namespace");
    return {
        configPath: last(parsed, "--config"),
        ...(namespace !== undefined ? { namespace } : {}),
        ...(parsed.booleans.has("--purge") ? { purge: true } : {}),
        ...(hasAny(parsed, HELP_FLAGS) ? { help: true } : {}),
    };
}
