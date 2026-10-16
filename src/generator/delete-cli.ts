#!/usr/bin/env node
import { promptDeleteSchemas, deleteSchemasFromOptions } from "./ui/delete-schemas";
import { DeleteCliOptions } from "./interfaces/cli.interfaces";
import { parseDeleteCliArgs } from "./utils/cli-parser";
import { DELETE_USAGE } from "./utils/cli-usage";
import { wasErrorReported } from "./ui/progress-bar";
import { isPromptCancelled, CANCELLED_EXIT_CODE } from "./ui/prompt-helpers";
import { formatGeneratorError, createGeneratorError } from "./utils/environment-validator";

export type { DeleteCliOptions };
export { parseDeleteCliArgs };

async function run(options: DeleteCliOptions): Promise<void> {
    if (options.namespace !== undefined) {
        await deleteSchemasFromOptions({ pkgPath: options.configPath, namespace: options.namespace, purge: options.purge });
        return;
    }
    if (options.purge) {
        throw createGeneratorError({
            code: "ERR_CLI_MISSING_OPTION",
            title: "Missing Required Option",
            details: "'--purge' needs '--namespace' to know which namespace to delete.",
            action: "Add '--namespace <name>' to the command.",
        });
    }
    await promptDeleteSchemas({ pkgPath: options.configPath });
}

async function main(): Promise<void> {
    try {
        const options = parseDeleteCliArgs(process.argv.slice(2));
        if (options.help) {
            console.log(DELETE_USAGE);
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
