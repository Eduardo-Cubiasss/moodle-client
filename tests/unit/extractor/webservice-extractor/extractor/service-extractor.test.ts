import { extractServices } from '../../../../../src/generator/extractor/extractor/service-extractor';
import { MoodleService } from '../../../../../src/generator/extractor/interfaces/service-extractor.interfaces';

// Valid Fixtures
import formatStandardMoodle2 from '../../../../fixtures/services/format-standard-moodle-2.json';
import formatStandardMoodle5 from '../../../../fixtures/services/format-standard-moodle-5.json';
import formatValidNullable from '../../../../fixtures/services/format-valid-nullable-fields.json';

// Corrupted / Invalid Fixtures
import corruptMissingClassname from '../../../../fixtures/services/format-corrupt-missing-classname.json';
import corruptNotArray from '../../../../fixtures/services/format-corrupt-not-array.json';
import corruptEntryNotArray from '../../../../fixtures/services/format-corrupt-entry-not-array.json';

describe('Unit Test: service-extractor', () => {

    describe('Valid Cases (Happy Paths & Moodle Evolution)', () => {

        it('should extract services with legacy format (Moodle 2.x - 3.x with classpath and explicit methodname)', () => {
            const services: MoodleService[] = extractServices(formatStandardMoodle2);

            expect(services).toEqual([
                {
                    name: 'moodle_enrol_manual_enrol_users',
                    classname: 'moodle_enrol_manual_external',
                    methodname: 'manual_enrol_users',
                    classpath: 'enrol/manual/externallib.php',
                    description: 'Manual enrol users',
                    type: 'write'
                }
            ]);
        });

        it('should extract modern services (Moodle >= 4.0 with ::class and implicit "execute" methodname)', () => {
            const services: MoodleService[] = extractServices(formatStandardMoodle5);

            expect(services).toEqual([
                {
                    name: 'aiplacement_editor_generate_image',
                    classname: '\\aiplacement_editor\\external\\generate_image',
                    methodname: 'execute'
                },
                {
                    name: 'aiplacement_editor_generate_text',
                    classname: '\\aiplacement_editor\\external\\generate_text',
                    methodname: 'execute',
                }
            ]);
        });

        it('should accept null description, custom string type, and minimal service definitions', () => {
            const services: MoodleService[] = extractServices(formatValidNullable);

            expect(services).toEqual([
                {
                    name: 'core_course_get_contents',
                    classname: 'core_course_external',
                    methodname: 'execute',
                    type: 'custom_query_type',
                    description: null
                },
                {
                    name: 'core_minimal_service',
                    classname: 'core_minimal_external',
                    methodname: 'execute'
                }
            ]);
        });

        it('should extract custom explicit methodname when declared', () => {
            const customMethodAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'functions' },
                            right: {
                                kind: 'array',
                                items: [
                                    {
                                        kind: 'entry',
                                        key: { kind: 'string', value: 'custom_service_call' },
                                        value: {
                                            kind: 'array',
                                            items: [
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'classname' },
                                                    value: { kind: 'string', value: 'custom_external' }
                                                },
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'methodname' },
                                                    value: { kind: 'string', value: 'custom_fetch_data' }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };

            const services = extractServices(customMethodAst);

            expect(services).toHaveLength(1);
            expect(services[0]).toEqual({
                name: 'custom_service_call',
                classname: 'custom_external',
                methodname: 'custom_fetch_data'
            });
        });

        it('should default methodname to "execute" when methodname is null, empty string, whitespace, or absent', () => {
            const methodnameVariationsAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'functions' },
                            right: {
                                kind: 'array',
                                items: [
                                    {
                                        kind: 'entry',
                                        key: { kind: 'string', value: 'svc_with_empty_method' },
                                        value: {
                                            kind: 'array',
                                            items: [
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'classname' },
                                                    value: { kind: 'string', value: 'core_external_1' }
                                                },
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'methodname' },
                                                    value: { kind: 'string', value: '' }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        kind: 'entry',
                                        key: { kind: 'string', value: 'svc_with_whitespace_method' },
                                        value: {
                                            kind: 'array',
                                            items: [
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'classname' },
                                                    value: { kind: 'string', value: 'core_external_2' }
                                                },
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'methodname' },
                                                    value: { kind: 'string', value: '   ' }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        kind: 'entry',
                                        key: { kind: 'string', value: 'svc_with_null_method' },
                                        value: {
                                            kind: 'array',
                                            items: [
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'classname' },
                                                    value: { kind: 'string', value: 'core_external_3' }
                                                },
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'methodname' },
                                                    value: { kind: 'nullkeyword', name: 'null' }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };

            const services = extractServices(methodnameVariationsAst);

            expect(services).toHaveLength(3);
            expect(services[0].methodname).toBe('execute');
            expect(services[1].methodname).toBe('execute');
            expect(services[2].methodname).toBe('execute');
        });
    });

    describe('Corrupted / Invalid Cases & Resilience (Edge Cases)', () => {

        it('should discard service entries that do not declare "classname"', () => {
            const services = extractServices(corruptMissingClassname);
            expect(services).toEqual([]);
        });

        it('should return an empty array if $functions is not an array', () => {
            const services = extractServices(corruptNotArray);
            expect(services).toEqual([]);
        });

        it('should discard entries whose inner definition is not an associative array structure', () => {
            const services = extractServices(corruptEntryNotArray);
            expect(services).toEqual([]);
        });

        it('should filter out invalid entries and preserve valid services when mixed in the same $functions array', () => {
            const mixedAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'functions' },
                            right: {
                                kind: 'array',
                                items: [
                                    // 1. Invalid entry: missing classname
                                    {
                                        kind: 'entry',
                                        key: { kind: 'string', value: 'invalid_entry_1' },
                                        value: {
                                            kind: 'array',
                                            items: [
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'type' },
                                                    value: { kind: 'string', value: 'read' }
                                                }
                                            ]
                                        }
                                    },
                                    // 2. Valid entry
                                    {
                                        kind: 'entry',
                                        key: { kind: 'string', value: 'valid_service' },
                                        value: {
                                            kind: 'array',
                                            items: [
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'classname' },
                                                    value: { kind: 'string', value: 'valid_external' }
                                                }
                                            ]
                                        }
                                    },
                                    // 3. Invalid entry: value is a string, not an array
                                    {
                                        kind: 'entry',
                                        key: { kind: 'string', value: 'invalid_entry_2' },
                                        value: { kind: 'string', value: 'not_an_array' }
                                    },
                                    // 4. Invalid entry: key is numeric
                                    {
                                        kind: 'entry',
                                        key: { kind: 'number', value: '0' },
                                        value: {
                                            kind: 'array',
                                            items: [
                                                {
                                                    kind: 'entry',
                                                    key: { kind: 'string', value: 'classname' },
                                                    value: { kind: 'string', value: 'numeric_key_external' }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };

            const services = extractServices(mixedAst);

            expect(services).toHaveLength(1);
            expect(services[0]).toEqual({
                name: 'valid_service',
                classname: 'valid_external',
                methodname: 'execute'
            });
        });

        it('should handle empty, null, or undefined AST structures safely', () => {
            expect(extractServices({})).toEqual([]);
            expect(extractServices({ kind: 'program', children: [] })).toEqual([]);
            expect(extractServices(null)).toEqual([]);
            expect(extractServices(undefined)).toEqual([]);
            expect(extractServices('not_an_object')).toEqual([]);
        });
    });

});
