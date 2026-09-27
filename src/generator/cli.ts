#!/usr/bin/env node
import { runGeneratorWithProgress } from "./ui/progress-bar";

export interface CliOptions {
    configPath?: string;
    force?: boolean;
}

export function parseCliArgs(args: string[]): CliOptions {
    let configPath: string | undefined;
    let force = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) {
            continue;
        }
        if (arg === "--f" || arg === "-f" || arg === "--force") {
            force = true;
        } else if (arg === "--config" && i + 1 < args.length) {
            configPath = args[i + 1];
            i++;
        } else if (arg.startsWith("--config=")) {
            configPath = arg.slice("--config=".length);
        }
    }

    return { configPath, force };
}

async function main(): Promise<void> {
    const { configPath, force } = parseCliArgs(process.argv.slice(2));
    try {
        await runGeneratorWithProgress(configPath, { force });
    } catch {
        process.exit(1);
    }
}

if (!process.env.VITEST) {
    main();
}

