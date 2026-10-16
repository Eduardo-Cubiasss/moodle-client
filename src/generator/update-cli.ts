#!/usr/bin/env node
import { promptUpdateSchemas, updateSchemasFromOptions } from "./ui/update-schemas";
import { UpdateCliOptions } from "./interfaces/cli.interfaces";
import { parseUpdateCliArgs } from "./utils/cli-parser";
import { UPDATE_USAGE } from "./utils/cli-usage";
import { wasErrorReported } from "./ui/progress-bar";
import { isPromptCancelled, CANCELLED_EXIT_CODE } from "./ui/prompt-helpers";
import { formatGeneratorError, createGeneratorError } from "./utils/environment-validator";

export type { UpdateCliOptions };
export { parseUpdateCliArgs };

async function run(options: UpdateCliOptions): Promise<void> {
    if (!options.entry && !options.sync) {
        await promptUpdateSchemas({ pkgPath: options.configPath });
        return;
    }
    if (options.entry?.namespace === undefined) {
        throw createGeneratorError({
            code: "ERR_CLI_MISSING_OPTION",
            title: "Missing Required Option",
            details: "'--namespace' is required to update a schema without prompts.",
            action: "Add '--namespace <name>' to the command, or run 'npx moodle-update-schemas' without options for the wizard.",
        });
    }
    await updateSchemasFromOptions({ pkgPath: options.configPath, flags: options.entry, sync: options.sync });
}

async function main(): Promise<void> {
    try {
        const options = parseUpdateCliArgs(process.argv.slice(2));
        if (options.help) {
            console.log(UPDATE_USAGE);
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
