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

import { PromptContext } from "../interfaces/cli.interfaces";

export type { PromptContext };

export function createPromptInterface(
    input: NodeJS.ReadableStream = defaultInput,
    output: NodeJS.WritableStream = defaultOutput
): readline.Interface {
    return readline.createInterface({ input, output });
}

/**
 * Asks a question until the validator accepts the answer. `prefill` is typed into the input line
 * beforehand, so the user can keep it (Enter), edit it, or delete it. With mock answers, each answer
 * stands for the final content of the line.
 */
export async function askQuestion(
    ctx: PromptContext,
    title: string,
    example?: string,
    promptLabel = "Response: ",
    validator?: (val: string) => string | undefined,
    prefill?: string
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
            answer = await questionWithPrefill(ctx.rl, promptLabel, prefill);
        } else {
            const rl = createPromptInterface(ctx.input, ctx.output);
            try {
                answer = await questionWithPrefill(rl, promptLabel, prefill);
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

/**
 * Asks on the readline interface with `prefill` already typed in the editable line.
 */
function questionWithPrefill(rl: readline.Interface, label: string, prefill?: string): Promise<string> {
    const pending = rl.question(label);
    if (prefill) {
        rl.write(prefill);
    }
    return pending;
}

/**
 * Whether an error is readline's rejection when the user presses Ctrl+C at a question.
 */
export function isPromptCancelled(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: unknown }).code === "ABORT_ERR";
}

/** Exit code of a process interrupted with Ctrl+C (128 + SIGINT). */
export const CANCELLED_EXIT_CODE = 130;

export function parseYesNoInput(input: string): boolean {
    const normalized = input.trim().toLowerCase();
    if (normalized === "y" || normalized === "yes") {
        return true;
    }
    if (normalized === "n" || normalized === "no") {
        return false;
    }
    throw new Error("Please answer with 'y', 'yes', 'n', or 'no'.");
}
