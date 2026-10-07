import type * as readline from "node:readline/promises";

/**
 * Options accepted by the main schema generator CLI (`moodle-generate-schemas`).
 */
export interface CliOptions {
    configPath?: string;
    force?: boolean;
}

/**
 * Options accepted by the interactive schema creation CLI (`moodle-create-schemas`).
 */
export interface CreateCliOptions {
    configPath?: string;
}

/**
 * Options accepted by the interactive schema deletion CLI (`moodle-delete-schemas`).
 */
export interface DeleteCliOptions {
    configPath?: string;
}

/**
 * Execution context for interactive readline prompts, supporting dependency injection for testing.
 */
export interface PromptContext {
    rl?: readline.Interface;
    mockAnswers?: string[];
    input?: NodeJS.ReadableStream;
    output?: NodeJS.WritableStream;
}
