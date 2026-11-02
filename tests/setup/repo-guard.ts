import { afterAll, beforeAll } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Fails a test file that writes into this repository's own dist/schemas or src/schemas.
 *
 * The generator looks for the installed @didactika/moodle-client package and, run from this
 * repository, finds the repository itself. A test that lets it do so rewrites the built barrel
 * (dist/schemas/index.d.ts), which once hid a broken build: the tests fixed the file the build had
 * just written. Tests must give the generator a package to write into (see
 * tests/unit/generator/helpers/package.ts).
 */
const ROOT = path.resolve(__dirname, "../..");
const WATCHED = ["dist/schemas", "src/schemas"];

function fingerprint(): string {
    const lines: string[] = [];
    const walk = (dir: string) => {
        let entries: fs.Dirent[];
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch {
            return;
        }
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                lines.push(`${path.relative(ROOT, full)}/`);
                walk(full);
            } else {
                const stat = fs.statSync(full);
                lines.push(`${path.relative(ROOT, full)} ${stat.size} ${stat.mtimeMs}`);
            }
        }
    };
    WATCHED.forEach((dir) => walk(path.join(ROOT, dir)));
    return lines.sort().join("\n");
}

let before = "";

beforeAll(() => {
    before = fingerprint();
});

afterAll(() => {
    if (fingerprint() !== before) {
        throw new Error(`This test file modified ${WATCHED.join(" or ")} of the repository. Run the generator from a project with its own node_modules/@didactika/moodle-client (tests/unit/generator/helpers/package.ts).`);
    }
});
