import { describe, expect, it, vi } from "vitest";
import { PassThrough } from "node:stream";
import * as readline from "node:readline/promises";
import { askQuestion, isPromptCancelled } from "../../../src/generator/ui/prompt-helpers";

function terminal() {
    const input = new PassThrough();
    const output = new PassThrough();
    const rl = readline.createInterface({ input, output, terminal: true });
    return { input, rl };
}

describe("askQuestion prefill", () => {
    it("should type the current value into the line, so Enter keeps it", async () => {
        vi.spyOn(console, "log").mockImplementation(() => undefined);
        const { input, rl } = terminal();
        const answer = askQuestion({ rl }, "Branch", undefined, "Branch: ", undefined, "UEA_MASTER");
        setImmediate(() => input.write("\r"));
        await expect(answer).resolves.toBe("UEA_MASTER");
        rl.close();
    });

    it("should let the prefilled value be edited or deleted", async () => {
        vi.spyOn(console, "log").mockImplementation(() => undefined);
        const { input, rl } = terminal();
        const edited = askQuestion({ rl }, "Branch", undefined, "Branch: ", undefined, "main");
        setImmediate(() => input.write("\x7f\x7f\x7f\x7fdev\r"));
        await expect(edited).resolves.toBe("dev");

        const cleared = askQuestion({ rl }, "Path", undefined, "Path: ", undefined, "src/moodle");
        setImmediate(() => input.write("\x15\r")); // Ctrl+U deletes the whole line
        await expect(cleared).resolves.toBe("");
        rl.close();
    });
});

describe("Ctrl+C at a question", () => {
    it("should reject with an error that isPromptCancelled recognizes", async () => {
        vi.spyOn(console, "log").mockImplementation(() => undefined);
        const { input, rl } = terminal();
        const answer = askQuestion({ rl }, "Option", undefined, "Option: ");
        setImmediate(() => input.write("\x03"));
        const err = await answer.catch((e: unknown) => e);
        expect(isPromptCancelled(err)).toBe(true);
        expect(isPromptCancelled(new Error("other"))).toBe(false);
        expect(isPromptCancelled(undefined)).toBe(false);
        rl.close();
    });
});
