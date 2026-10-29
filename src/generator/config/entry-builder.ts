import {
    MoodleSchemaConfigEntry,
    MoodleSourceConfig,
    SourceType,
    SOURCE_TYPES,
    LEGACY_SOURCE_TYPES,
    isSourceType,
} from "../interfaces/config.interfaces";
import { SchemaEntryFlags } from "../interfaces/cli.interfaces";
import { createGeneratorError } from "./config-manager";
import {
    parseWebservicesInput,
    validateNamespace,
    validateRepositoryUrlInput,
    validateBranchInput,
    validateMoodleVersionInput,
    validateLocalPathInput,
    validateOutDirInput,
} from "./input-validators";
import { absoluteLocalPath } from "./local-path";

/** Source flags that only make sense for one source type. */
const SOURCE_FLAGS_BY_TYPE: Readonly<Record<SourceType, ReadonlyArray<keyof SchemaEntryFlags>>> = {
    "moodle-official": ["sourceVersion"],
    "moodle-repository": ["sourceUrl", "sourceBranch"],
    "moodle-local": ["sourcePath"],
};

const FLAG_NAMES: Readonly<Record<keyof SchemaEntryFlags, string>> = {
    namespace: "--namespace",
    sourceType: "--source.type",
    sourceVersion: "--source.version",
    sourceUrl: "--source.url",
    sourceBranch: "--source.branch",
    sourcePath: "--source.path",
    webservices: "--webservices",
    outDir: "--outDir",
};

const ALL_SOURCE_FLAGS = Object.values(SOURCE_FLAGS_BY_TYPE).flat();

function invalidOption(flag: string, message: string) {
    return createGeneratorError({
        code: "ERR_CLI_INVALID_OPTION",
        title: "Invalid Option Value",
        details: `${flag}: ${message}`,
        action: `Fix the value of '${flag}' and run the command again.`,
    });
}

function missingOption(flag: string, reason: string) {
    return createGeneratorError({
        code: "ERR_CLI_MISSING_OPTION",
        title: "Missing Required Option",
        details: `'${flag}' is required ${reason}.`,
        action: `Add '${flag} <value>' to the command.`,
    });
}

/**
 * Runs a validator and turns its Error into an ERR_CLI_INVALID_OPTION naming the flag.
 */
function validated<T>(key: keyof SchemaEntryFlags, run: () => T): T {
    try {
        return run();
    } catch (err: unknown) {
        throw invalidOption(FLAG_NAMES[key], err instanceof Error ? err.message : String(err));
    }
}

function parseSourceType(value: string): SourceType {
    if (isSourceType(value)) {
        return value;
    }
    const replacement = LEGACY_SOURCE_TYPES[value];
    const accepted = SOURCE_TYPES.join(", ");
    throw invalidOption(
        "--source.type",
        replacement
            ? `'${value}' is no longer supported, use '${replacement}'.`
            : `'${value}' is not a source type. Accepted: ${accepted}.`
    );
}

/**
 * Rejects source flags that do not belong to the given source type, so nothing is silently ignored.
 */
function assertSourceFlagsMatch(flags: SchemaEntryFlags, type: SourceType): void {
    const allowed = SOURCE_FLAGS_BY_TYPE[type];
    for (const key of ALL_SOURCE_FLAGS) {
        if (flags[key] !== undefined && !allowed.includes(key)) {
            throw invalidOption(FLAG_NAMES[key], `does not apply to source type '${type}'.`);
        }
    }
}

/**
 * Builds a source from flags alone; every saved field the type requires must be present. A local
 * source may come without a path: it is then asked when generating.
 */
function buildSource(flags: SchemaEntryFlags, type: SourceType): MoodleSourceConfig {
    const reason = `when --source.type is '${type}'`;
    if (type === "moodle-official") {
        if (flags.sourceVersion === undefined) throw missingOption("--source.version", reason);
        return { type, version: validated("sourceVersion", () => validateMoodleVersionInput(flags.sourceVersion!)) };
    }
    if (type === "moodle-repository") {
        if (flags.sourceUrl === undefined) throw missingOption("--source.url", reason);
        return {
            type,
            url: validated("sourceUrl", () => validateRepositoryUrlInput(flags.sourceUrl!)),
            branch: validateBranchInput(flags.sourceBranch ?? ""),
        };
    }
    return flags.sourcePath === undefined
        ? { type }
        : { type, path: validated("sourcePath", () => absoluteLocalPath(validateLocalPathInput(flags.sourcePath!))) };
}

/**
 * Applies source flags on top of an existing source of the same type.
 */
function overrideSource(current: MoodleSourceConfig, flags: SchemaEntryFlags): MoodleSourceConfig {
    if (current.type === "moodle-official") {
        return flags.sourceVersion === undefined
            ? current
            : { ...current, version: validated("sourceVersion", () => validateMoodleVersionInput(flags.sourceVersion!)) };
    }
    if (current.type === "moodle-repository") {
        return {
            ...current,
            ...(flags.sourceUrl !== undefined ? { url: validated("sourceUrl", () => validateRepositoryUrlInput(flags.sourceUrl!)) } : {}),
            ...(flags.sourceBranch !== undefined ? { branch: validateBranchInput(flags.sourceBranch) } : {}),
        };
    }
    // A local path is never saved, so there is no current one to keep
    return flags.sourcePath === undefined
        ? { type: "moodle-local" }
        : { type: "moodle-local", path: validated("sourcePath", () => absoluteLocalPath(validateLocalPathInput(flags.sourcePath!))) };
}

/**
 * Local and repository sources write into the project, so they need an outDir.
 */
function assertOutDirIfRequired(entry: MoodleSchemaConfigEntry): void {
    if (entry.source.type !== "moodle-official" && !entry.outDir) {
        throw missingOption("--outDir", `when the source type is '${entry.source.type}'`);
    }
}

function optionalFields(flags: SchemaEntryFlags): Partial<MoodleSchemaConfigEntry> {
    return {
        ...(flags.webservices !== undefined
            ? { webservices: validated("webservices", () => parseWebservicesInput(flags.webservices!)) }
            : {}),
        ...(flags.outDir !== undefined ? { outDir: validated("outDir", () => validateOutDirInput(flags.outDir!)) } : {}),
    };
}

/**
 * Builds a new "moodle-client" entry from the flags of `moodle-create-schemas`.
 * `--webservices` defaults to '*'.
 */
export function buildEntryFromFlags(
    flags: SchemaEntryFlags,
    existingNamespaces: Set<string>
): MoodleSchemaConfigEntry {
    if (flags.namespace === undefined) throw missingOption("--namespace", "to create a schema without prompts");
    const namespace = flags.namespace.trim();
    validated("namespace", () => validateNamespace(namespace, existingNamespaces));

    if (flags.sourceType === undefined) throw missingOption("--source.type", "to create a schema without prompts");
    const type = parseSourceType(flags.sourceType);
    assertSourceFlagsMatch(flags, type);

    const entry: MoodleSchemaConfigEntry = {
        namespace,
        source: buildSource(flags, type),
        webservices: ["*"],
        ...optionalFields(flags),
    };
    assertOutDirIfRequired(entry);
    return entry;
}

/**
 * Applies the flags of `moodle-update-schemas` to an existing entry. Only the given flags change;
 * changing `--source.type` replaces the whole source, so the new type's fields must be given too.
 * `--outDir ""` is not accepted; an official source keeps its outDir unless a new one is given.
 */
export function mergeEntryWithFlags(
    stored: MoodleSchemaConfigEntry,
    flags: SchemaEntryFlags
): MoodleSchemaConfigEntry {
    const current = normalizeLegacySource(stored);
    if (flags.sourceType === undefined && !isSourceType(current.source.type)) {
        throw missingOption("--source.type", `because '${String(current.source.type)}' is not a source type`);
    }
    const type = flags.sourceType !== undefined ? parseSourceType(flags.sourceType) : current.source.type;
    assertSourceFlagsMatch(flags, type);

    const source = type === current.source.type ? overrideSource(current.source, flags) : buildSource(flags, type);
    const merged: MoodleSchemaConfigEntry = { ...current, source, ...optionalFields(flags) };
    assertOutDirIfRequired(merged);
    return merged;
}

/**
 * Rewrites a pre-release short source type (e.g. 'moodle', 'local') to its replacement,
 * keeping the other source fields, so updating an old entry also migrates it. Unknown types are
 * returned unchanged.
 */
export function normalizeLegacySource(entry: MoodleSchemaConfigEntry): MoodleSchemaConfigEntry {
    const type = (entry.source as { type: string }).type;
    const replacement = LEGACY_SOURCE_TYPES[type];
    if (isSourceType(type) || !replacement) {
        return entry;
    }
    return { ...entry, source: { ...entry.source, type: replacement } as MoodleSourceConfig };
}

/** Fields compared by describeEntryChanges, in display order. */
const CHANGE_FIELDS: ReadonlyArray<[string, (entry: MoodleSchemaConfigEntry) => unknown]> = [
    ["source.type", (e) => e.source.type],
    ["source.version", (e) => (e.source as { version?: string }).version],
    ["source.url", (e) => (e.source as { url?: string }).url],
    ["source.branch", (e) => (e.source as { branch?: string }).branch],
    ["webservices", (e) => e.webservices],
    ["outDir", (e) => e.outDir],
];

/**
 * Describes what differs between two entries, one short line per changed field
 * (e.g. `source.branch: main -> release`). Unchanged fields are not listed; a local path is never
 * compared, since it is not saved.
 */
export function describeEntryChanges(before: MoodleSchemaConfigEntry, after: MoodleSchemaConfigEntry): string[] {
    return CHANGE_FIELDS.map(([name, read]) => [name, formatValue(read(before)), formatValue(read(after))] as const)
        .filter(([, a, b]) => a !== b)
        .map(([name, a, b]) => `${name}: ${a} -> ${b}`);
}

function formatValue(value: unknown): string {
    if (value === undefined) {
        return "(none)";
    }
    return Array.isArray(value) ? value.join(", ") : String(value);
}
