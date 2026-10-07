#!/usr/bin/env node
import { promptDeleteSchemas } from "./interactive/delete-schemas";
import { DeleteCliOptions } from "./interfaces/cli.interfaces";
import { parseDeleteCliArgs } from "./utils/cli-parser";

export type { DeleteCliOptions };
export { parseDeleteCliArgs };

async function main(): Promise<void> {
    const { configPath } = parseDeleteCliArgs(process.argv.slice(2));
    try {
        await promptDeleteSchemas({ pkgPath: configPath });
    } catch {
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}
