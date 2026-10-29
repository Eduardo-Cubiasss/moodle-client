#!/usr/bin/env node
import { runGeneratorWithProgress, wasErrorReported } from "./ui/progress-bar";
import { CliOptions } from "./interfaces/cli.interfaces";
import { parseCliArgs } from "./utils/cli-parser";
import { GENERATE_USAGE } from "./utils/cli-usage";
import { formatGeneratorError } from "./utils/environment-validator";
import { planExtraction, RunGeneratorOptions } from "./runner";
import { resolveLocalSources } from "./ui/local-path-prompt";
import { createPromptInterface, isPromptCancelled, CANCELLED_EXIT_CODE, PromptContext } from "./ui/prompt-helpers";

export type { CliOptions };
export { parseCliArgs };

export interface GenerateSchemasOptions {
    configPath?: string;
    force?: boolean;
    namespaces?: string[];
    mockAnswers?: string[];
    generatorRunner?: (configPath: string | undefined, options: RunGeneratorOptions) => Promise<void>;
}

/**
 * `moodle-generate-schemas`: asks for the path of every local namespace it is about to regenerate,
 * then runs the generator.
 */
export async function generateSchemas(options: GenerateSchemasOptions): Promise<void> {
    const runOptions: RunGeneratorOptions = { force: options.force, forceNamespaces: options.namespaces };
    const planned = await planExtraction(options.configPath, runOptions);

    const isMock = Boolean(options.mockAnswers && options.mockAnswers.length > 0);
    const needsPrompt = planned.some((entry) => entry.source.type === "moodle-local");
    const rl = !isMock && needsPrompt && process.stdin.isTTY ? createPromptInterface() : undefined;
    const ctx: PromptContext = { rl, mockAnswers: options.mockAnswers };
    try {
        runOptions.sources = await resolveLocalSources(planned, { ctx });
    } finally {
        rl?.close();
    }

    const run = options.generatorRunner ?? runGeneratorWithProgress;
    await run(options.configPath, runOptions);
}

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
        await generateSchemas({ configPath: options.configPath, force: options.force, namespaces: options.namespaces });
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
