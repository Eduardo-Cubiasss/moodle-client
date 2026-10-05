#!/usr/bin/env node
import { promptDeleteSchemas } from "./interactive/delete-schemas";

export interface DeleteCliOptions {
    configPath?: string;
}

export function parseDeleteCliArgs(args: string[]): DeleteCliOptions {
    let configPath: string | undefined;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) {
            continue;
        }
        if (arg === "--config" && i + 1 < args.length) {
            configPath = args[i + 1];
            i++;
        } else if (arg.startsWith("--config=")) {
            configPath = arg.slice("--config=".length);
        }
    }

    return { configPath };
}

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
