import {
    isProgram,
    findVariableAssignment,
    extractStringLiteral,
    extractEntryKey,
    extractArrayEntriesMap,
    extractFieldValue
} from '../../../../../src/generator/extractor/parser/ast-utils';
import { Entry, Array as PhpArray, Node } from 'php-parser';

describe('Unit Test: ast-utils (Generic AST Helpers)', () => {

    describe('isProgram', () => {
        it('should return true for valid Program AST nodes with children array', () => {
            const validProgram = { kind: 'program', children: [], errors: [] };
            expect(isProgram(validProgram)).toBe(true);
        });

        it('should return false for non-program objects, null, or undefined', () => {
            expect(isProgram({})).toBe(false);
            expect(isProgram({ kind: 'expressionstatement' })).toBe(false);
            expect(isProgram(null)).toBe(false);
            expect(isProgram(undefined)).toBe(false);
            expect(isProgram('string')).toBe(false);
            expect(isProgram(123)).toBe(false);
        });

        it('should return false if kind is program but children is not an array', () => {
            expect(isProgram({ kind: 'program', children: null })).toBe(false);
            expect(isProgram({ kind: 'program', children: 'not_an_array' })).toBe(false);
            expect(isProgram({ kind: 'program' })).toBe(false);
        });
    });

    describe('findVariableAssignment', () => {
        it('should locate and return the PhpArray node assigned to a given variable name', () => {
            const ast = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'functions' },
                            right: { kind: 'array', items: [] }
                        }
                    }
                ]
            };

            const result = findVariableAssignment(ast as unknown as Node, 'functions');
            expect(result).toBeDefined();
            expect(result?.kind).toBe('array');
        });

        it('should return null when the target variable does not exist or is assigned to a non-array', () => {
            const astWithString = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'functions' },
                            right: { kind: 'string', value: 'not_an_array' }
                        }
                    }
                ]
            };

            expect(findVariableAssignment(astWithString as unknown as Node, 'functions')).toBeNull();
            expect(findVariableAssignment(astWithString as unknown as Node, 'non_existent_var')).toBeNull();
        });

        it('should ignore statements that are not ExpressionStatements or assignments to other variables', () => {
            const astWithOtherStatements = {
                kind: 'program',
                children: [
                    { kind: 'inline', value: 'echo "hello";' },
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'bin',
                            type: '||',
                            left: { kind: 'call', what: { kind: 'name', name: 'defined' } }
                        }
                    },
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'other_variable' },
                            right: { kind: 'array', items: [] }
                        }
                    },
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'propertylookup', what: { kind: 'variable', name: 'this' } },
                            right: { kind: 'array', items: [] }
                        }
                    }
                ]
            };

            expect(findVariableAssignment(astWithOtherStatements as unknown as Node, 'functions')).toBeNull();
        });

        it('should return null if the input is not a valid Program AST', () => {
            expect(findVariableAssignment(null as unknown as Node, 'functions')).toBeNull();
            expect(findVariableAssignment({} as unknown as Node, 'functions')).toBeNull();
        });
    });

    describe('extractStringLiteral', () => {
        it('should extract raw string value from a String AST node', () => {
            const stringNode = { kind: 'string', value: 'core_user_external' };
            expect(extractStringLiteral(stringNode as unknown as Node)).toBe('core_user_external');
        });

        it('should extract class FQN from a StaticLookup (::class) AST node', () => {
            const staticLookupNode = {
                kind: 'staticlookup',
                what: { kind: 'name', name: '\\core\\external\\user' },
                offset: { kind: 'identifier', name: 'class' }
            };

            expect(extractStringLiteral(staticLookupNode as unknown as Node)).toBe('\\core\\external\\user');
        });

        it('should return null for invalid or non-resolvable StaticLookup nodes', () => {
            const lookupWithoutName = {
                kind: 'staticlookup',
                what: { kind: 'call' }
            };
            const lookupWithNonStringName = {
                kind: 'staticlookup',
                what: { name: 12345 }
            };
            const lookupWithNullWhat = {
                kind: 'staticlookup',
                what: null
            };

            expect(extractStringLiteral(lookupWithoutName as unknown as Node)).toBeNull();
            expect(extractStringLiteral(lookupWithNonStringName as unknown as Node)).toBeNull();
            expect(extractStringLiteral(lookupWithNullWhat as unknown as Node)).toBeNull();
        });

        it('should return null for non-string nodes or null/undefined', () => {
            expect(extractStringLiteral({ kind: 'number', value: '123' } as unknown as Node)).toBeNull();
            expect(extractStringLiteral(null)).toBeNull();
            expect(extractStringLiteral(undefined)).toBeNull();
        });
    });

    describe('extractEntryKey', () => {
        it('should extract string key from an associative array Entry node', () => {
            const entry: Partial<Entry> = {
                kind: 'entry',
                key: { kind: 'string', value: 'classname' } as unknown as Node
            };

            expect(extractEntryKey(entry as Entry)).toBe('classname');
        });

        it('should return null if Entry key is missing or not a string literal', () => {
            const entryWithoutKey: Partial<Entry> = { kind: 'entry', key: null };
            const entryWithNumberKey: Partial<Entry> = {
                kind: 'entry',
                key: { kind: 'number', value: '0' } as unknown as Node
            };

            expect(extractEntryKey(entryWithoutKey as Entry)).toBeNull();
            expect(extractEntryKey(entryWithNumberKey as Entry)).toBeNull();
        });
    });

    describe('extractArrayEntriesMap', () => {
        it('should convert array items into a Map of key -> AST Node', () => {
            const phpArray: Partial<PhpArray> = {
                kind: 'array',
                items: [
                    {
                        kind: 'entry',
                        key: { kind: 'string', value: 'classname' } as unknown as Node,
                        value: { kind: 'string', value: 'core_external' } as unknown as Node
                    } as Entry
                ]
            };

            const map = extractArrayEntriesMap(phpArray as PhpArray);
            expect(map.size).toBe(1);
            expect(map.has('classname')).toBe(true);
        });

        it('should ignore invalid or non-entry items gracefully', () => {
            const phpArrayWithInvalidItems: Partial<PhpArray> = {
                kind: 'array',
                items: [
                    null as unknown as Entry,
                    { kind: 'string', value: 'standalone_string' } as unknown as Entry,
                    { kind: 'entry', key: null, value: { kind: 'string', value: 'val' } } as unknown as Entry
                ]
            };

            const map = extractArrayEntriesMap(phpArrayWithInvalidItems as PhpArray);
            expect(map.size).toBe(0);
        });

        it('should return an empty map when given null, undefined, or an array without items', () => {
            expect(extractArrayEntriesMap(null as unknown as PhpArray).size).toBe(0);
            expect(extractArrayEntriesMap(undefined as unknown as PhpArray).size).toBe(0);
            expect(extractArrayEntriesMap({ kind: 'array' } as PhpArray).size).toBe(0);
        });
    });

    describe('extractFieldValue', () => {
        it('should return null for nullkeyword AST nodes', () => {
            const nullNode = { kind: 'nullkeyword', name: 'null' };
            expect(extractFieldValue(nullNode as unknown as Node)).toBeNull();
        });

        it('should return the string value for standard string nodes', () => {
            const stringNode = { kind: 'string', value: 'read' };
            expect(extractFieldValue(stringNode as unknown as Node)).toBe('read');
        });

        it('should resolve StaticLookup (::class) nodes as field values', () => {
            const staticLookupNode = {
                kind: 'staticlookup',
                what: { kind: 'name', name: 'core_course_external' },
                offset: { kind: 'identifier', name: 'class' }
            };
            expect(extractFieldValue(staticLookupNode as unknown as Node)).toBe('core_course_external');
        });

        it('should return null if node is undefined or null', () => {
            expect(extractFieldValue(undefined)).toBeNull();
            expect(extractFieldValue(null)).toBeNull();
        });
    });

});
