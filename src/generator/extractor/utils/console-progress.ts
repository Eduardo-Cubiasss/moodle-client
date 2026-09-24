/**
 * Utility functions and terminal renderer for interactive progress display with ETA.
 */

const INNER_WIDTH = 56;
const CONTENT_WIDTH = 52;
const BAR_WIDTH = 38;

/**
 * Pads string on the right to exact target length or truncates if longer.
 *
 * @param {string} str - Input text.
 * @param {number} len - Target length.
 * @returns {string} Padded string.
 */
export function padRight(str: string, len: number): string {
    if (str.length >= len) {
        return str.slice(0, len);
    }
    return str + ' '.repeat(len - str.length);
}

/**
 * Pads string on the left to exact target length.
 *
 * @param {string} str - Input text.
 * @param {number} len - Target length.
 * @returns {string} Padded string.
 */
export function padLeft(str: string, len: number): string {
    if (str.length >= len) {
        return str.slice(0, len);
    }
    return ' '.repeat(len - str.length) + str;
}

/**
 * Formats seconds into human-readable duration string.
 *
 * @param {number} sec - Seconds count.
 * @returns {string} Formatted duration.
 */
function formatRemainingSeconds(sec: number): string {
    if (sec < 60) {
        return `~${sec}s left`;
    }
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `~${mins}m ${secs}s left`;
}

/**
 * Computes remaining seconds based on processing rate.
 *
 * @param {number} completed - Completed items.
 * @param {number} total - Total items.
 * @param {number} startTime - Start timestamp in ms.
 * @returns {number} Estimated seconds remaining.
 */
function calculateRemainingSeconds(completed: number, total: number, startTime: number): number {
    const elapsedMs = Math.max(1, performance.now() - startTime);
    const rate = completed / elapsedMs;
    const remainingCount = total - completed;
    return Math.ceil((remainingCount / rate) / 1000);
}

/**
 * Calculates human-readable Estimated Time of Arrival (ETA) text.
 *
 * @example
 * ```ts
 * calculateEta(10, 100, startTime); // 'ETA: ~9s left'
 * ```
 *
 * @param {number} completed - Completed count.
 * @param {number} total - Total count.
 * @param {number} startTime - Start timestamp from performance.now().
 * @returns {string} Formatted ETA text.
 */
export function calculateEta(completed: number, total: number, startTime: number): string {
    if (completed <= 0) {
        return 'ETA: Calculating...';
    }
    if (completed >= total) {
        return 'Completed';
    }
    const remaining = calculateRemainingSeconds(completed, total, startTime);
    return `ETA: ${formatRemainingSeconds(remaining)}`;
}

/**
 * Generates ASCII block progress bar.
 *
 * @param {number} percent - Percentage 0 - 100.
 * @param {number} [barWidth=38] - Character width of bar.
 * @returns {string} Progress bar string.
 */
export function buildProgressBar(percent: number, barWidth = BAR_WIDTH): string {
    const filled = Math.round((percent / 100) * barWidth);
    const empty = Math.max(0, barWidth - filled);
    return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Builds formatted progress bar line.
 *
 * @param {number} percent - Completion percentage.
 * @param {number} [contentWidth=52] - Inner width.
 * @returns {string} Formatted bar line.
 */
export function buildBarLine(percent: number, contentWidth = CONTENT_WIDTH): string {
    const bar = buildProgressBar(percent, BAR_WIDTH);
    const pctText = padLeft(`${percent}%`, 5);
    return padRight(`[${bar}] ${pctText}`, contentWidth);
}

/**
 * Builds bottom footer line containing counter and ETA.
 *
 * @param {number} completed - Number of completed services.
 * @param {number} total - Total count.
 * @param {string} etaText - Formatted ETA string.
 * @param {number} [contentWidth=52] - Inner width.
 * @returns {string} Formatted footer line.
 */
export function buildFooterLine(
    completed: number,
    total: number,
    etaText: string,
    contentWidth = CONTENT_WIDTH
): string {
    const left = `${completed} of ${total} services`;
    const spacing = Math.max(1, contentWidth - left.length - etaText.length);
    return padRight(`${left}${' '.repeat(spacing)}${etaText}`, contentWidth);
}

/**
 * Generates all 8 lines of the terminal progress card.
 *
 * @param {number} completed - Completed items count.
 * @param {number} total - Total items count.
 * @param {string | undefined} serviceName - Active service name.
 * @param {string} etaText - Formatted ETA text.
 * @returns {string[]} Formatted card lines.
 */
export function formatCardLines(
    completed: number,
    total: number,
    serviceName: string | undefined,
    etaText: string
): string[] {
    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    const top = `┌${'─'.repeat(INNER_WIDTH)}┐`;
    const bot = `└${'─'.repeat(INNER_WIDTH)}┘`;
    const empty = ' '.repeat(CONTENT_WIDTH);

    const title = padRight('Extracting Moodle Web Services', CONTENT_WIDTH);
    const sub = padRight(`Processing: ${serviceName || 'Initializing...'}`, CONTENT_WIDTH);
    const barLine = buildBarLine(percent, CONTENT_WIDTH);
    const footer = buildFooterLine(completed, total, etaText, CONTENT_WIDTH);

    return [
        top,
        `│  ${title}  │`,
        `│  ${sub}  │`,
        `│  ${empty}  │`,
        `│  ${barLine}  │`,
        `│  ${empty}  │`,
        `│  ${footer}  │`,
        bot
    ];
}

/**
 * Terminal renderer for displaying an in-place updating progress card with ETA.
 */
export class ConsoleProgressRenderer {
    private hasRendered = false;
    private isTty = Boolean(process.stdout && process.stdout.isTTY);
    private startTime = performance.now();

    /**
     * Initializes console progress renderer.
     *
     * @param {number} total - Total number of services.
     */
    constructor(private total: number) {}

    /**
     * Writes card lines to stdout, repositioning cursor if in TTY mode.
     *
     * @param {string[]} lines - Card lines.
     */
    private writeLines(lines: string[]): void {
        if (!this.isTty) {
            return;
        }
        const prefix = this.hasRendered ? '\x1b[8A' : '';
        process.stdout.write(prefix + lines.join('\n') + '\n');
        this.hasRendered = true;
    }

    /**
     * Updates the progress card with current completed count and active service.
     *
     * @param {number} completed - Completed items.
     * @param {string} [currentService] - Active service name.
     */
    public update(completed: number, currentService?: string): void {
        const eta = calculateEta(completed, this.total, this.startTime);
        const lines = formatCardLines(completed, this.total, currentService, eta);
        this.writeLines(lines);
    }

    /**
     * Finalizes the progress card rendering 100% completion state.
     */
    public finish(): void {
        const lines = formatCardLines(this.total, this.total, 'Completed successfully', 'Completed');
        this.writeLines(lines);
        if (this.isTty) {
            process.stdout.write('\n');
        }
    }
}
