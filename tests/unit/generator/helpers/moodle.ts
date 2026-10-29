import fs from "fs/promises";
import path from "path";

/** A directory that looks like a Moodle checkout (has version.php). */
export async function makeMoodleDir(baseDir: string, name = "moodle", release = "4.5+ (Build: 20241018)"): Promise<string> {
    const dir = path.join(baseDir, name);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "version.php"), `<?php\n$release  = '${release}';\n`, "utf-8");
    return dir;
}
