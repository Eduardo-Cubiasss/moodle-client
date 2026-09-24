#!/usr/bin/env node
import { runGeneratorPipeline } from "./generator-pipeline";

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    let configPath: string | undefined;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--config" && args[i + 1]) {
            configPath = args[i + 1];
            i++;
        }
    }
    console.log("[moodle-client] Starting web service generation...");
    try {
        await runGeneratorPipeline(configPath);
        console.log("[moodle-client] Web services generated successfully.");
    } catch (error: any) {
        console.error("[moodle-client] Error:", error?.message || error);
        process.exit(1);
    }
}

main();
