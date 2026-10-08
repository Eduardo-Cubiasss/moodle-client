#!/usr/bin/env node
import { promptCreateSchemas } from "./ui/create-schemas";
import { CreateCliOptions } from "./interfaces/cli.interfaces";
import { parseCreateCliArgs } from "./utils/cli-parser";
import { formatGeneratorError } from "./utils/environment-validator";

export type { CreateCliOptions };
export { parseCreateCliArgs };

async function main(): Promise<void> {
    const { configPath } = parseCreateCliArgs(process.argv.slice(2));
    try {
        await promptCreateSchemas({ pkgPath: configPath });
    } catch (err: unknown) {
        console.error("\n" + formatGeneratorError(err));
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}
