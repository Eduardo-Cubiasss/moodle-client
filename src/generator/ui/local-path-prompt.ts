import { MoodleSchemaConfigEntry, MoodleSourceConfig, isLocalSource } from "../interfaces/config.interfaces";
import { validateLocalPathInput } from "../config/input-validators";
import { resolveLocalPath } from "../config/local-path";
import { SEPARATOR, PromptContext, askQuestion } from "./prompt-helpers";

/**
 * Whether questions can be asked: answers are mocked (tests) or stdin is a terminal.
 */
export function canPrompt(ctx: PromptContext): boolean {
    return Boolean(ctx.mockAnswers && ctx.mockAnswers.length > 0) || Boolean(ctx.rl) || Boolean(process.stdin.isTTY);
}

/**
 * Asks for the local Moodle path of a namespace. Nothing is prefilled: the path is never saved.
 */
export async function askLocalPath(ctx: PromptContext, namespace: string): Promise<string> {
    console.log(SEPARATOR);
    return askQuestion(
        ctx,
        `Please enter the path to your Moodle directory for '${namespace}'`,
        "~/projects/moodle",
        "Path: ",
        (val) => {
            try {
                validateLocalPathInput(val);
                return undefined;
            } catch (err: any) {
                return err.message;
            }
        }
    );
}

export interface ResolveLocalSourcesOptions {
    ctx: PromptContext;
}

/**
 * Asks the path of every local entry that is about to be generated, when it can be asked.
 * Returns the sources to generate with, by namespace.
 */
export async function resolveLocalSources(
    entries: MoodleSchemaConfigEntry[],
    options: ResolveLocalSourcesOptions
): Promise<Record<string, MoodleSourceConfig>> {
    const sources: Record<string, MoodleSourceConfig> = {};
    const ask = canPrompt(options.ctx) ? (namespace: string) => askLocalPath(options.ctx, namespace) : undefined;
    for (const entry of entries) {
        if (isLocalSource(entry.source)) {
            const localPath = entry.source.path ?? (await resolveLocalPath(entry.namespace, { ask }));
            sources[entry.namespace] = { type: "moodle-local", path: localPath };
        }
    }
    return sources;
}
