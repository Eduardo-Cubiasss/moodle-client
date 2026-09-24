import { sanitizeDescription } from '../../../../../src/generator/extractor/utils/description-utils';

describe('Unit Test: description-utils (sanitizeDescription)', () => {

    it('should return sanitized description when input has valid single-line string', () => {
        expect(sanitizeDescription('Manual enrol users')).toBe('Manual enrol users');
        expect(sanitizeDescription('  Returns group details.  ')).toBe('Returns group details.');
    });

    it('should collapse newlines and excessive whitespace into clean single spaces', () => {
        const rawMoodleDoc = 'List of course id. If empty return all courses\n                                            except front page course.';
        expect(sanitizeDescription(rawMoodleDoc)).toBe('List of course id. If empty return all courses except front page course.');

        const multilineWithTabs = 'Enabled, control via completion.\r\n\t\tDisabled,\n\t\tnot shown.';
        expect(sanitizeDescription(multilineWithTabs)).toBe('Enabled, control via completion. Disabled, not shown.');
    });

    it('should return undefined when input is empty string or whitespace-only', () => {
        expect(sanitizeDescription('')).toBeUndefined();
        expect(sanitizeDescription('   ')).toBeUndefined();
        expect(sanitizeDescription('\n\t\r\n  ')).toBeUndefined();
    });

    it('should return undefined when input is not a string', () => {
        expect(sanitizeDescription(null)).toBeUndefined();
        expect(sanitizeDescription(undefined)).toBeUndefined();
        expect(sanitizeDescription(123)).toBeUndefined();
        expect(sanitizeDescription({})).toBeUndefined();
        expect(sanitizeDescription([])).toBeUndefined();
    });

});
