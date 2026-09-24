import {
    compareVersions,
    isVersionGreaterOrEqual,
    isValidVersionString,
    parseVersionParts,
    normalizeVersion
} from '../../../../../src/generator/extractor/utils/version-utils';

describe('Unit Test: version-utils (3-Point Version Comparison & Validation)', () => {

    describe('parseVersionParts', () => {
        it('should parse 3-point version string into numbers array', () => {
            expect(parseVersionParts('2.0.10')).toEqual([2, 0, 10]);
            expect(parseVersionParts('3.11.2')).toEqual([3, 11, 2]);
            expect(parseVersionParts('5.2.0')).toEqual([5, 2, 0]);
        });

        it('should parse 2-point version string into numbers array', () => {
            expect(parseVersionParts('4.5')).toEqual([4, 5]);
            expect(parseVersionParts('3.8')).toEqual([3, 8]);
        });

        it('should handle leading "v" and whitespace cleanly', () => {
            expect(parseVersionParts(' v4.5.1 ')).toEqual([4, 5, 1]);
        });

        it('should return empty array for empty or invalid string', () => {
            expect(parseVersionParts('')).toEqual([]);
        });
    });

    describe('compareVersions', () => {
        it('should correctly compare major versions', () => {
            expect(compareVersions('4.0.0', '3.11.2')).toBe(1);
            expect(compareVersions('2.6.0', '3.0.0')).toBe(-1);
            expect(compareVersions('5.0.0', '5.0.0')).toBe(0);
        });

        it('should correctly compare minor versions (numeric, not alphabetic)', () => {
            expect(compareVersions('3.11.2', '3.8.0')).toBe(1);
            expect(compareVersions('3.8.0', '3.11.2')).toBe(-1);
            expect(compareVersions('2.6.0', '2.5.9')).toBe(1);
        });

        it('should correctly compare patch versions (e.g. 2.0.10 vs 2.0.2)', () => {
            expect(compareVersions('2.0.10', '2.0.2')).toBe(1);
            expect(compareVersions('2.0.2', '2.0.10')).toBe(-1);
            expect(compareVersions('2.0.10', '2.0.10')).toBe(0);
        });

        it('should treat missing patch versions as 0 (e.g. 4.5 vs 4.5.0)', () => {
            expect(compareVersions('4.5', '4.5.0')).toBe(0);
            expect(compareVersions('4.5.1', '4.5')).toBe(1);
            expect(compareVersions('4.5', '4.5.1')).toBe(-1);
        });
    });

    describe('isVersionGreaterOrEqual', () => {
        it('should return true when v1 is greater than or equal to v2', () => {
            expect(isVersionGreaterOrEqual('4.5.0', '3.8.0')).toBe(true);
            expect(isVersionGreaterOrEqual('3.8.0', '3.8.0')).toBe(true);
            expect(isVersionGreaterOrEqual('3.11.0', '3.8.0')).toBe(true);
            expect(isVersionGreaterOrEqual('2.6.0', '2.6.0')).toBe(true);
            expect(isVersionGreaterOrEqual('2.0.10', '2.0.0')).toBe(true);
        });

        it('should return false when v1 is strictly less than v2', () => {
            expect(isVersionGreaterOrEqual('3.7.9', '3.8.0')).toBe(false);
            expect(isVersionGreaterOrEqual('2.5.9', '2.6.0')).toBe(false);
            expect(isVersionGreaterOrEqual('1.9.0', '2.0.0')).toBe(false);
        });
    });

    describe('isValidVersionString', () => {
        it('should return true for valid version strings', () => {
            expect(isValidVersionString('2.0.10')).toBe(true);
            expect(isValidVersionString('3.8')).toBe(true);
            expect(isValidVersionString('5.2.2')).toBe(true);
            expect(isValidVersionString(' 4.5.0 ')).toBe(true);
        });

        it('should return false for invalid version strings', () => {
            expect(isValidVersionString('')).toBe(false);
            expect(isValidVersionString('invalid-version')).toBe(false);
            expect(isValidVersionString('abc')).toBe(false);
        });
    });

    describe('normalizeVersion', () => {
        it('should convert 2-part versions to x.x.0 format', () => {
            expect(normalizeVersion('3.2')).toBe('3.2.0');
            expect(normalizeVersion('4.5')).toBe('4.5.0');
            expect(normalizeVersion('5.0')).toBe('5.0.0');
        });

        it('should keep 3-part versions intact', () => {
            expect(normalizeVersion('4.0.1')).toBe('4.0.1');
            expect(normalizeVersion('2.0.10')).toBe('2.0.10');
            expect(normalizeVersion('3.11.2')).toBe('3.11.2');
        });

        it('should handle leading "v" or whitespace', () => {
            expect(normalizeVersion(' v3.2 ')).toBe('3.2.0');
            expect(normalizeVersion('v4.0.1')).toBe('4.0.1');
        });
    });

});
