import { describe, expect, it } from "vitest";
import os from "os";
import {
    buildEntryFromFlags,
    mergeEntryWithFlags,
    describeEntryChanges,
    normalizeLegacySource,
} from "../../../src/generator/config/entry-builder";
import type { MoodleSchemaConfigEntry } from "../../../src/generator/interfaces/config.interfaces";

const existingDir = os.tmpdir();

describe("buildEntryFromFlags (moodle-create-schemas one-line mode)", () => {
    it("should build an official entry; outDir is optional and webservices default to '*'", () => {
        expect(
            buildEntryFromFlags({ namespace: "moodle45", sourceType: "moodle-official", sourceVersion: "4.5.2" }, new Set())
        ).toEqual({ namespace: "moodle45", source: { type: "moodle-official", version: "4.5" }, webservices: ["*"] });
    });

    it("should build a repository entry with branch defaulting to main", () => {
        expect(
            buildEntryFromFlags(
                {
                    namespace: "funiber",
                    sourceType: "moodle-repository",
                    sourceUrl: "https://gitlab.example.com/moodle.git",
                    webservices: "core_*, local_*",
                    outDir: "src/moodle",
                },
                new Set()
            )
        ).toEqual({
            namespace: "funiber",
            source: { type: "moodle-repository", url: "https://gitlab.example.com/moodle.git", branch: "main" },
            webservices: ["core_*", "local_*"],
            outDir: "src/moodle",
        });
    });

    it("should build a local entry when the path exists", () => {
        const entry = buildEntryFromFlags(
            { namespace: "localDev", sourceType: "moodle-local", sourcePath: existingDir, outDir: "src/moodle" },
            new Set()
        );
        expect(entry.source).toEqual({ type: "moodle-local", path: existingDir });
    });

    it("should require --namespace and --source.type", () => {
        expect(() => buildEntryFromFlags({ sourceType: "moodle-official", sourceVersion: "4.5" }, new Set())).toThrow(/'--namespace' is required/);
        expect(() => buildEntryFromFlags({ namespace: "x" }, new Set())).toThrow(/'--source.type' is required/);
    });

    it("should require the fields of the chosen source type", () => {
        expect(() => buildEntryFromFlags({ namespace: "x", sourceType: "moodle-official" }, new Set())).toThrow(/'--source.version' is required when --source.type is 'moodle-official'/);
        expect(() => buildEntryFromFlags({ namespace: "x", sourceType: "moodle-repository", outDir: "o" }, new Set())).toThrow(/'--source.url' is required/);
        expect(() => buildEntryFromFlags({ namespace: "x", sourceType: "moodle-local", outDir: "o" }, new Set())).toThrow(/'--source.path' is required/);
    });

    it("should require --outDir for repository and local sources", () => {
        expect(() =>
            buildEntryFromFlags({ namespace: "x", sourceType: "moodle-repository", sourceUrl: "https://a/b.git" }, new Set())
        ).toThrow(/'--outDir' is required when the source type is 'moodle-repository'/);
    });

    it("should reject flags that do not apply to the source type instead of ignoring them", () => {
        expect(() =>
            buildEntryFromFlags({ namespace: "x", sourceType: "moodle-official", sourceVersion: "4.5", sourceUrl: "https://a/b.git" }, new Set())
        ).toThrow(/--source.url: does not apply to source type 'moodle-official'/);
    });

    it("should only accept the three source types, naming the replacement of legacy ones", () => {
        expect(() => buildEntryFromFlags({ namespace: "x", sourceType: "repository" }, new Set())).toThrow(/'repository' is no longer supported, use 'moodle-repository'/);
        expect(() => buildEntryFromFlags({ namespace: "x", sourceType: "ftp" }, new Set())).toThrow(/Accepted: moodle-official, moodle-repository, moodle-local/);
    });

    it("should validate namespace, version, url and webservices values", () => {
        const base = { sourceType: "moodle-official", sourceVersion: "4.5" };
        expect(() => buildEntryFromFlags({ ...base, namespace: "moodle5.0" }, new Set())).toThrow(/--namespace: Invalid namespace 'moodle5.0'/);
        expect(() => buildEntryFromFlags({ ...base, namespace: "taken" }, new Set(["taken"]))).toThrow(/already exists/);
        expect(() => buildEntryFromFlags({ ...base, namespace: "x", sourceVersion: "1.9" }, new Set())).toThrow(/--source.version: Moodle version '1.9' is unsupported/);
        expect(() => buildEntryFromFlags({ ...base, namespace: "x", webservices: " , " }, new Set())).toThrow(/--webservices: Webservices pattern cannot be empty/);
        expect(() =>
            buildEntryFromFlags({ namespace: "x", sourceType: "moodle-repository", sourceUrl: "ftp://a", outDir: "o" }, new Set())
        ).toThrow(/--source.url: Invalid repository URL/);
    });
});

describe("mergeEntryWithFlags (moodle-update-schemas one-line mode)", () => {
    const repoEntry: MoodleSchemaConfigEntry = {
        namespace: "funiber",
        source: { type: "moodle-repository", url: "https://a/b.git", branch: "main" },
        webservices: ["*"],
        outDir: "src/moodle",
    };

    it("should change only the given fields", () => {
        expect(mergeEntryWithFlags(repoEntry, { namespace: "funiber", sourceBranch: "dev", webservices: "core_*" })).toEqual({
            ...repoEntry,
            source: { ...repoEntry.source, branch: "dev" },
            webservices: ["core_*"],
        });
    });

    it("should return the entry unchanged when only --namespace is given", () => {
        expect(mergeEntryWithFlags(repoEntry, { namespace: "funiber" })).toEqual(repoEntry);
    });

    it("should replace the whole source when --source.type changes, requiring the new type's fields", () => {
        expect(() => mergeEntryWithFlags(repoEntry, { sourceType: "moodle-official" })).toThrow(/'--source.version' is required/);
        expect(mergeEntryWithFlags(repoEntry, { sourceType: "moodle-official", sourceVersion: "4.5" }).source).toEqual({
            type: "moodle-official",
            version: "4.5",
        });
    });

    it("should reject flags of another source type", () => {
        expect(() => mergeEntryWithFlags(repoEntry, { sourceVersion: "4.5" })).toThrow(/does not apply to source type 'moodle-repository'/);
    });

    it("should migrate a legacy source type while keeping its fields", () => {
        const legacy = { namespace: "webservice", source: { type: "moodle", version: "4.5" }, webservices: ["*"] } as unknown as MoodleSchemaConfigEntry;
        expect(mergeEntryWithFlags(legacy, { namespace: "webservice" }).source).toEqual({ type: "moodle-official", version: "4.5" });
        expect(normalizeLegacySource(legacy).source.type).toBe("moodle-official");
    });

    it("should require --source.type when the stored type is unknown", () => {
        const unknown = { namespace: "x", source: { type: "ftp" }, webservices: ["*"] } as unknown as MoodleSchemaConfigEntry;
        expect(() => mergeEntryWithFlags(unknown, { namespace: "x" })).toThrow(/'--source.type' is required because 'ftp' is not a source type/);
    });
});

describe("describeEntryChanges", () => {
    it("should show only the changed source fields, with plain values", () => {
        const before = {
            namespace: "uneat",
            source: { type: "repository", url: "https://gitlab.example.com/moodle.git", branch: "UEA_MASTER" },
            webservices: ["*"],
        } as unknown as MoodleSchemaConfigEntry;
        const after: MoodleSchemaConfigEntry = {
            namespace: "uneat",
            source: { type: "moodle-repository", url: "https://gitlab.example.com/moodle.git", branch: "UEA_MASTER" },
            webservices: ["local_*"],
        };
        expect(describeEntryChanges(before, after)).toEqual([
            "source.type: repository -> moodle-repository",
            "webservices: * -> local_*",
        ]);
    });

    it("should list one line per changed field", () => {
        const before: MoodleSchemaConfigEntry = { namespace: "a", source: { type: "moodle-official", version: "4.4" }, webservices: ["*"] };
        const after: MoodleSchemaConfigEntry = { ...before, source: { type: "moodle-official", version: "4.5" }, outDir: "src" };
        expect(describeEntryChanges(before, after)).toEqual(["source.version: 4.4 -> 4.5", "outDir: (none) -> src"]);
        expect(describeEntryChanges(before, before)).toEqual([]);
    });
});
