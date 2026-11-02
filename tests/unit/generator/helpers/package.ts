import fs from "fs/promises";
import path from "path";

/**
 * Makes `dir` look like a project with @didactika/moodle-client installed and runs from it, so the
 * generator writes into `dir/node_modules/@didactika/moodle-client` instead of finding this
 * repository (it looks for the installed package from the current directory first).
 * Returns the function that goes back to the previous directory.
 */
export async function runInProjectWithPackage(dir: string): Promise<() => void> {
    const pkgDir = path.join(dir, "node_modules/@didactika/moodle-client");
    await fs.mkdir(pkgDir, { recursive: true });
    await fs.writeFile(path.join(pkgDir, "package.json"), JSON.stringify({ name: "@didactika/moodle-client" }), "utf-8");
    const previous = process.cwd();
    process.chdir(dir);
    return () => process.chdir(previous);
}
