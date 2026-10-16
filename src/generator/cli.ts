#!/usr/bin/env node
import { runGeneratorWithProgress } from "./ui/progress-bar";
import { CliOptions } from "./interfaces/cli.interfaces";
import { parseCliArgs } from "./utils/cli-parser";
import { GENERATE_USAGE } from "./utils/cli-usage";
import { formatGeneratorError } from "./utils/environment-validator";

export type { CliOptions };
export { parseCliArgs };

async function main(): Promise<void> {
    let options: CliOptions;
    try {
        options = parseCliArgs(process.argv.slice(2));
    } catch (err: unknown) {
        console.error(formatGeneratorError(err));
        process.exit(1);
    }
    if (options.help) {
        console.log(GENERATE_USAGE);
        return;
    }
    try {
        await runGeneratorWithProgress(options.configPath, {
            force: options.force,
            forceNamespaces: options.namespaces,
        });
    } catch {
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}
