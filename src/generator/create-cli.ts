#!/usr/bin/env node
import { promptCreateSchemas } from "./interactive/create-schemas";
import { CreateCliOptions } from "./interfaces/cli.interfaces";
import { parseCreateCliArgs } from "./utils/cli-parser";

export type { CreateCliOptions };
export { parseCreateCliArgs };

async function main(): Promise<void> {
    const { configPath } = parseCreateCliArgs(process.argv.slice(2));
    try {
        await promptCreateSchemas({ pkgPath: configPath });
    } catch {
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}
