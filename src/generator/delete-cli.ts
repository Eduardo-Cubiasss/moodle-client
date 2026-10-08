#!/usr/bin/env node
import { promptDeleteSchemas } from "./ui/delete-schemas";
import { DeleteCliOptions } from "./interfaces/cli.interfaces";
import { parseDeleteCliArgs } from "./utils/cli-parser";
import { formatGeneratorError } from "./utils/environment-validator";

export type { DeleteCliOptions };
export { parseDeleteCliArgs };

async function main(): Promise<void> {
    const { configPath } = parseDeleteCliArgs(process.argv.slice(2));
    try {
        await promptDeleteSchemas({ pkgPath: configPath });
    } catch (err: unknown) {
        console.error("\n" + formatGeneratorError(err));
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}
