import { describe, expect, it } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import ts from "typescript";
import { buildMasterBarrel, bundledSourceDescription, BUNDLED_NAMESPACE } from "../../../src/generator/barrel";

/**
 * Checks the barrel the package ships (dist/schemas/index.d.ts), as `npm run build` leaves it.
 * CI builds before testing; without a build these tests are skipped.
 *
 * tsup turns this file into a bare re-export, so it must be written whole by
 * scripts/postbuild.mjs: appending `declare module ... extends GeneratedMoodleServices` to the
 * re-export broke every project that type-checks its dependencies (TS2304).
 */
const ROOT = path.resolve(__dirname, "../../..");
const BARREL = path.join(ROOT, "dist/schemas/index.d.ts");
const built = fs.existsSync(BARREL);

describe.skipIf(!built)("built schemas barrel (dist/schemas/index.d.ts)", () => {
    it("should be the barrel the CLI writes for the bundled namespace", () => {
        const expected = buildMasterBarrel([{ namespace: BUNDLED_NAMESPACE, source: bundledSourceDescription() }]);
        expect(fs.readFileSync(BARREL, "utf-8")).toBe(expected);
        expect(fs.readFileSync(path.join(ROOT, "dist/schemas/index.d.mts"), "utf-8")).toBe(expected);
    });

    it("should type-check in a project that does not skip library checks", () => {
        // A consumer of the built package, resolved through a node_modules link to this repository
        const project = fs.mkdtempSync(path.join(os.tmpdir(), "moodle-barrel-consumer-"));
        try {
            fs.mkdirSync(path.join(project, "node_modules/@didactika"), { recursive: true });
            fs.symlinkSync(ROOT, path.join(project, "node_modules/@didactika/moodle-client"), "dir");
            const file = path.join(project, "consumer.ts");
            fs.writeFileSync(
                file,
                [
                    'import { MoodleClient } from "@didactika/moodle-client";',
                    'import type { webservice } from "@didactika/moodle-client";',
                    'const moodle = new MoodleClient({ rootURL: "http://x", token: "t" });',
                    'const params: webservice.CoreUserGetUsersParams = { criteria: [{ key: "id", value: "1" }] };',
                    "export const call = moodle.webservice.core_user_get_users(params);",
                ].join("\n"),
                "utf-8"
            );

            const program = ts.createProgram([file], {
                strict: true,
                noEmit: true,
                skipLibCheck: false,
                module: ts.ModuleKind.Node16,
                moduleResolution: ts.ModuleResolutionKind.Node16,
                target: ts.ScriptTarget.ES2022,
                types: [],
            });
            const errors = ts
                .getPreEmitDiagnostics(program)
                .filter((d) => d.file?.fileName.includes("dist/schemas") || d.file?.fileName === file)
                .map((d) => `${d.file ? path.relative(project, d.file.fileName) : ""}: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`);
            expect(errors).toEqual([]);
        } finally {
            fs.rmSync(project, { recursive: true, force: true });
        }
    }, 60_000);
});
