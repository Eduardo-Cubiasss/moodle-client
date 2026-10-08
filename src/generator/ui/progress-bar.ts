import { runGenerator } from "../runner";
import { formatGeneratorError } from "../utils/environment-validator";

function calculateProgress(
    startTime: number,
    totalDuration: number,
    maxPercent: number
): { percent: number; elapsedSec: string } {
    const elapsedMs = Date.now() - startTime;
    const elapsedSec = (elapsedMs / 1000).toFixed(1);
    const percent = Math.min(maxPercent, Math.floor((elapsedMs / totalDuration) * maxPercent));
    return { percent, elapsedSec };
}

function renderBar(percent: number, barWidth: number): string {
    const filledCount = Math.floor((percent / 100) * barWidth);
    return "■".repeat(filledCount) + "·".repeat(barWidth - filledCount);
}

export function buildBox(lines: string[]): string[] {
    const contentWidth = Math.max(...lines.map((line) => line.length));
    const width = Math.max(contentWidth + 4, 60);
    const top = `┌${"─".repeat(width)}┐`;
    const bottom = `└${"─".repeat(width)}┘`;
    const empty = `│${" ".repeat(width)}│`;
    const formattedLines = lines.map((line) => `│  ${line.padEnd(width - 4, " ")}  │`);
    return [top, empty, ...formattedLines, empty, bottom];
}

function printUsageInstructions(): void {
    const lines = [
        "You can now call generated web services directly from your",
        "MoodleClient instance using configured namespaces:",
        "",
        '  const moodle = new MoodleClient({ rootURL: "...", token: "..." });',
        "  const { data } = await moodle.<namespace>.core_course_get_courses({ ... });",
    ];
    console.log(buildBox(lines).join("\n") + "\n");
}

function renderProgressTick(startTime: number, barWidth: number): void {
    const { percent, elapsedSec } = calculateProgress(startTime, 14000, 99);
    const bar = renderBar(percent, barWidth);
    process.stdout.write(`\r  [${bar}] ${percent}% (${elapsedSec}s)`);
}

function renderCompletion(startTime: number, barWidth: number, isTTY: boolean): void {
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    if (isTTY) {
        process.stdout.write(`\x1b[1A\r\x1b[K[moodle-client] Moodle client ready (${elapsedSec}s)\n`);
        process.stdout.write(`\r  [${"■".repeat(barWidth)}] 100%\n\n`);
    } else {
        process.stdout.write(`[moodle-client] Moodle client ready (${elapsedSec}s)\n\n`);
    }
    printUsageInstructions();
}

function startProgressBar(barWidth: number): {
    startTime: number;
    timer: NodeJS.Timeout | null;
} {
    const startTime = Date.now();
    const isTTY = Boolean(process.stdout.isTTY);
    if (isTTY) {
        process.stdout.write("Generating Moodle client\n");
        const timer = setInterval(() => {
            renderProgressTick(startTime, barWidth);
        }, 80);
        return { startTime, timer };
    }
    process.stdout.write("Generating Moodle client...\n");
    return { startTime, timer: null };
}

function stopProgressBar(
    startTime: number,
    timer: NodeJS.Timeout | null,
    barWidth: number
): void {
    if (timer) {
        clearInterval(timer);
    }
    renderCompletion(startTime, barWidth, Boolean(process.stdout.isTTY));
}

export function reportProgressError(timer: NodeJS.Timeout | null, error: unknown): void {
    if (timer) {
        clearInterval(timer);
    }
    process.stdout.write("\n\n");
    console.error(formatGeneratorError(error));
}

/**
 * Runs the web service generator with a progress bar.
 */
export async function runGeneratorWithProgress(
    configPath?: string,
    options?: { force?: boolean; forceNamespaces?: string[] }
): Promise<void> {
    const barWidth = 30;
    const { startTime, timer } = startProgressBar(barWidth);
    try {
        await runGenerator(configPath, {
            silent: true,
            force: options?.force,
            forceNamespaces: options?.forceNamespaces,
        });
        stopProgressBar(startTime, timer, barWidth);
    } catch (error) {
        reportProgressError(timer, error);
        throw error;
    }
}
