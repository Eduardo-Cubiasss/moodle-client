import { resolvePrimitiveType } from '../../../../../src/generator/extractor/utils/type-utils';

describe('Unit Test: type-utils (resolvePrimitiveType)', () => {

    describe('Numeric Types Resolution', () => {
        it('should resolve integer types to number', () => {
            expect(resolvePrimitiveType('int')).toBe('number');
            expect(resolvePrimitiveType('integer')).toBe('number');
            expect(resolvePrimitiveType('PARAM_INT')).toBe('number');
            expect(resolvePrimitiveType('PARAM_INTEGER')).toBe('number');
            expect(resolvePrimitiveType(' INT ')).toBe('number');
        });

        it('should resolve float/decimal types to number', () => {
            expect(resolvePrimitiveType('float')).toBe('number');
            expect(resolvePrimitiveType('number')).toBe('number');
            expect(resolvePrimitiveType('PARAM_FLOAT')).toBe('number');
            expect(resolvePrimitiveType('PARAM_NUMBER')).toBe('number');
            expect(resolvePrimitiveType(' FLOAT ')).toBe('number');
        });
    });

    describe('Boolean Types Resolution', () => {
        it('should resolve boolean types to boolean', () => {
            expect(resolvePrimitiveType('bool')).toBe('boolean');
            expect(resolvePrimitiveType('boolean')).toBe('boolean');
            expect(resolvePrimitiveType('PARAM_BOOL')).toBe('boolean');
            expect(resolvePrimitiveType('PARAM_BOOLEAN')).toBe('boolean');
            expect(resolvePrimitiveType(' BOOL ')).toBe('boolean');
            expect(resolvePrimitiveType('Boolean')).toBe('boolean');
        });
    });

    describe('String and Sanitization Types Resolution', () => {
        it('should resolve standard text and clean types to string', () => {
            expect(resolvePrimitiveType('text')).toBe('string');
            expect(resolvePrimitiveType('raw')).toBe('string');
            expect(resolvePrimitiveType('raw_trimmed')).toBe('string');
            expect(resolvePrimitiveType('clean')).toBe('string');
            expect(resolvePrimitiveType('cleanhtml')).toBe('string');
            expect(resolvePrimitiveType('notags')).toBe('string');
        });

        it('should resolve alphanumeric, identifier, and formatting types to string', () => {
            expect(resolvePrimitiveType('alpha')).toBe('string');
            expect(resolvePrimitiveType('alphaext')).toBe('string');
            expect(resolvePrimitiveType('alphanum')).toBe('string');
            expect(resolvePrimitiveType('alphanumext')).toBe('string');
            expect(resolvePrimitiveType('action')).toBe('string');
            expect(resolvePrimitiveType('format')).toBe('string');
            expect(resolvePrimitiveType('multilang')).toBe('string');
            expect(resolvePrimitiveType('stringid')).toBe('string');
        });

        it('should resolve resource, system, and network types to string', () => {
            expect(resolvePrimitiveType('email')).toBe('string');
            expect(resolvePrimitiveType('url')).toBe('string');
            expect(resolvePrimitiveType('localurl')).toBe('string');
            expect(resolvePrimitiveType('file')).toBe('string');
            expect(resolvePrimitiveType('cleanfile')).toBe('string');
            expect(resolvePrimitiveType('path')).toBe('string');
            expect(resolvePrimitiveType('safepath')).toBe('string');
            expect(resolvePrimitiveType('safedir')).toBe('string');
            expect(resolvePrimitiveType('host')).toBe('string');
            expect(resolvePrimitiveType('pem')).toBe('string');
            expect(resolvePrimitiveType('base64')).toBe('string');
        });

        it('should resolve Moodle domain-specific types to string', () => {
            expect(resolvePrimitiveType('component')).toBe('string');
            expect(resolvePrimitiveType('area')).toBe('string');
            expect(resolvePrimitiveType('plugin')).toBe('string');
            expect(resolvePrimitiveType('username')).toBe('string');
            expect(resolvePrimitiveType('auth')).toBe('string');
            expect(resolvePrimitiveType('lang')).toBe('string');
            expect(resolvePrimitiveType('theme')).toBe('string');
            expect(resolvePrimitiveType('timezone')).toBe('string');
            expect(resolvePrimitiveType('capability')).toBe('string');
            expect(resolvePrimitiveType('permission')).toBe('string');
            expect(resolvePrimitiveType('sequence')).toBe('string');
            expect(resolvePrimitiveType('tag')).toBe('string');
            expect(resolvePrimitiveType('taglist')).toBe('string');
        });
    });

    describe('Dynamic / Edge Case Handling', () => {
        it('should resolve unknown custom or plugin types dynamically to string', () => {
            expect(resolvePrimitiveType('custom_plugin_type')).toBe('string');
            expect(resolvePrimitiveType('any_unknown_type')).toBe('string');
        });

        it('should default to string for empty or non-string values safely', () => {
            expect(resolvePrimitiveType('')).toBe('string');
            expect(resolvePrimitiveType(null as unknown as string)).toBe('string');
            expect(resolvePrimitiveType(undefined as unknown as string)).toBe('string');
            expect(resolvePrimitiveType(123 as unknown as string)).toBe('string');
        });
    });

});
