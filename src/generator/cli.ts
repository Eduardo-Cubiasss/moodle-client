#!/usr/bin/env node
import { runGeneratorWithProgress } from "./ui/progress-bar";
import { CliOptions } from "./interfaces/cli.interfaces";
import { parseCliArgs } from "./utils/cli-parser";

export type { CliOptions };
export { parseCliArgs };

async function main(): Promise<void> {
    const { configPath, force } = parseCliArgs(process.argv.slice(2));
    try {
        await runGeneratorWithProgress(configPath, { force });
    } catch {
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}
