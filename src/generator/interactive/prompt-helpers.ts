import * as readline from "node:readline/promises";
import { stdin as defaultInput, stdout as defaultOutput } from "node:process";

export const colors = {
    orange: (text: string): string => `\x1b[38;5;208m${text}\x1b[0m`,
    dim: (text: string): string => `\x1b[90m${text}\x1b[0m`,
    red: (text: string): string => `\x1b[31m${text}\x1b[0m`,
    green: (text: string): string => `\x1b[32m${text}\x1b[0m`,
    bold: (text: string): string => `\x1b[1m${text}\x1b[0m`,
};

export const SEPARATOR = "-".repeat(85);

export interface PromptContext {
    rl?: readline.Interface;
    mockAnswers?: string[];
    input?: NodeJS.ReadableStream;
    output?: NodeJS.WritableStream;
}

export function createPromptInterface(
    input: NodeJS.ReadableStream = defaultInput,
    output: NodeJS.WritableStream = defaultOutput
): readline.Interface {
    return readline.createInterface({ input, output });
}

export async function askQuestion(
    ctx: PromptContext,
    title: string,
    example?: string,
    promptLabel = "Response: ",
    validator?: (val: string) => string | undefined
): Promise<string> {
    while (true) {
        if (title) {
            console.log(colors.orange(title));
        }
        if (example) {
            console.log(colors.dim(`~ Example: ${example} ~`));
        }

        let answer: string;
        if (ctx.mockAnswers && ctx.mockAnswers.length > 0) {
            answer = ctx.mockAnswers.shift() ?? "";
            console.log(`${promptLabel}${answer}`);
        } else if (ctx.rl) {
            answer = await ctx.rl.question(promptLabel);
        } else {
            const rl = createPromptInterface(ctx.input, ctx.output);
            try {
                answer = await rl.question(promptLabel);
            } finally {
                rl.close();
            }
        }

        const trimmed = answer.trim();
        if (validator) {
            const error = validator(trimmed);
            if (error) {
                console.log(colors.red(`Error: ${error}`));
                continue;
            }
        }
        return trimmed;
    }
}
