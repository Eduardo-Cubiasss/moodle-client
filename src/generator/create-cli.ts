#!/usr/bin/env node
import { promptCreateSchemas, createSchemasFromOptions } from "./ui/create-schemas";
import { CreateCliOptions } from "./interfaces/cli.interfaces";
import { parseCreateCliArgs } from "./utils/cli-parser";
import { CREATE_USAGE } from "./utils/cli-usage";
import { wasErrorReported } from "./ui/progress-bar";
import { isPromptCancelled, CANCELLED_EXIT_CODE } from "./ui/prompt-helpers";
import { formatGeneratorError } from "./utils/environment-validator";

export type { CreateCliOptions };
export { parseCreateCliArgs };

async function run(options: CreateCliOptions): Promise<void> {
    if (options.entry) {
        await createSchemasFromOptions({ pkgPath: options.configPath, flags: options.entry });
        return;
    }
    await promptCreateSchemas({ pkgPath: options.configPath });
}

async function main(): Promise<void> {
    try {
        const options = parseCreateCliArgs(process.argv.slice(2));
        if (options.help) {
            console.log(CREATE_USAGE);
            return;
        }
        await run(options);
    } catch (err: unknown) {
        if (isPromptCancelled(err)) {
            console.log("\nCancelled.");
            process.exit(CANCELLED_EXIT_CODE);
        }
        if (!wasErrorReported(err)) {
            console.error("\n" + formatGeneratorError(err));
        }
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}
