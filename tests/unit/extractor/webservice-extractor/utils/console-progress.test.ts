import {
    calculateEta,
    padLeft,
    padRight,
    buildProgressBar,
    buildBarLine,
    buildFooterLine,
    formatCardLines,
    ConsoleProgressRenderer
} from '../../../../../src/generator/extractor/utils/console-progress';

describe('Console Progress and ETA Utils', () => {

    describe('padRight and padLeft', () => {
        it('should pad string on the right to target length', () => {
            expect(padRight('abc', 6)).toBe('abc   ');
            expect(padRight('abcdef', 4)).toBe('abcd');
        });

        it('should pad string on the left to target length', () => {
            expect(padLeft('abc', 6)).toBe('   abc');
            expect(padLeft('abcdef', 4)).toBe('abcd');
        });
    });

    describe('calculateEta', () => {
        it('should return Calculating... when completed is 0', () => {
            expect(calculateEta(0, 100, performance.now())).toBe('ETA: Calculating...');
        });

        it('should return Completed when completed >= total', () => {
            expect(calculateEta(100, 100, performance.now() - 1000)).toBe('Completed');
            expect(calculateEta(110, 100, performance.now() - 1000)).toBe('Completed');
        });

        it('should compute seconds left accurately', () => {
            // 50 completed in 1000ms -> rate 50/1000 = 0.05 items/ms. Remaining = 50 -> 1000ms = 1s left
            const startTime = performance.now() - 1000;
            const eta = calculateEta(50, 100, startTime);
            expect(eta).toContain('ETA: ~');
            expect(eta).toContain('s left');
        });

        it('should format minutes and seconds when duration is large', () => {
            // 1 item in 10000ms -> remaining 99 items = 990 seconds = 16m 30s
            const startTime = performance.now() - 10000;
            const eta = calculateEta(1, 100, startTime);
            expect(eta).toContain('ETA: ~');
            expect(eta).toContain('m ');
            expect(eta).toContain('s left');
        });
    });

    describe('buildProgressBar and lines', () => {
        it('should build progress bar with filled and empty blocks', () => {
            const bar = buildProgressBar(50, 10);
            expect(bar).toBe('█████░░░░░');
        });

        it('should build formatted bar line with percentage', () => {
            const line = buildBarLine(50, 52);
            expect(line.length).toBe(52);
            expect(line).toContain('50%');
        });

        it('should build footer line with counter and ETA', () => {
            const footer = buildFooterLine(10, 20, 'ETA: ~5s left', 52);
            expect(footer.length).toBe(52);
            expect(footer).toContain('10 of 20 services');
            expect(footer).toContain('ETA: ~5s left');
        });
    });

    describe('formatCardLines', () => {
        it('should return 8 card lines each having exact width of 58 chars', () => {
            const lines = formatCardLines(490, 755, 'core_user_get_users', 'ETA: ~3s left');
            expect(lines.length).toBe(8);
            for (const line of lines) {
                expect(line.length).toBe(58);
            }
            expect(lines[0]).toBe('┌────────────────────────────────────────────────────────┐');
            expect(lines[7]).toBe('└────────────────────────────────────────────────────────┘');
            expect(lines[1]).toContain('Extracting Moodle Web Services');
            expect(lines[2]).toContain('core_user_get_users');
            expect(lines[6]).toContain('490 of 755 services');
        });
    });

    describe('ConsoleProgressRenderer', () => {
        it('should update and finish without throwing in non-TTY or TTY environments', () => {
            const renderer = new ConsoleProgressRenderer(100);
            expect(() => renderer.update(10, 'core_user_create')).not.toThrow();
            expect(() => renderer.update(50, 'mod_forum_get')).not.toThrow();
            expect(() => renderer.finish()).not.toThrow();
        });
    });

});
