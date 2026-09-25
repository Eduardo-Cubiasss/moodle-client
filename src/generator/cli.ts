#!/usr/bin/env node
import { runGeneratorWithProgress } from "@didactika/moodle-client-schemas";

function parseConfigPath(args: string[]): string | undefined {
    const idx = args.indexOf("--config");
    if (idx !== -1) {
        return args[idx + 1];
    }
    return undefined;
}

async function main(): Promise<void> {
    const configPath = parseConfigPath(process.argv.slice(2));
    try {
        await runGeneratorWithProgress(configPath);
    } catch {
        process.exit(1);
    }
}

main();
