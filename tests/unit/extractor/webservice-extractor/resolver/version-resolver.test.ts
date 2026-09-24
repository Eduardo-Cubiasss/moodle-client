import { resolveVersion, clearVersionCache } from '../../../../../src/generator/extractor/resolver/version-resolver';
import * as AstManager from '../../../../../src/generator/extractor/cache/ast-manager';
import * as Scanner from '../../../../../src/generator/extractor/scanner/scanner';

vi.mock('../../../../../src/generator/extractor/cache/ast-manager');

describe('Unit Test: version-resolver (Single Responsibility: Version Detection)', () => {

    afterEach(() => {
        vi.clearAllMocks();
        clearVersionCache();
    });

    describe('resolveVersion', () => {

        it('should extract semantic version "2.0.10" from version.php AST with release string', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockVersionAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'release' },
                            right: { kind: 'string', value: '2.0.10 (Build: 20120706)' }
                        }
                    }
                ]
            };

            (AstManager.getAst as any).mockResolvedValue(mockVersionAst);

            const version = await resolveVersion(moodlePath);

            expect(AstManager.getAst).toHaveBeenCalledWith('version.php', moodlePath);
            expect(version).toBe('2.0.10');
        });

        it('should extract semantic version "5.2.2" from modern version.php AST', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockVersionAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'release' },
                            right: { kind: 'string', value: '5.2.2 (Build: 20260810)' }
                        }
                    }
                ]
            };

            (AstManager.getAst as any).mockResolvedValue(mockVersionAst);

            const version = await resolveVersion(moodlePath);
            expect(version).toBe('5.2.2');
        });

        it('should handle release strings with plus modifiers like "3.11.2+" correctly', async () => {
            const moodlePath = './tests/fixtures/component-resolver';
            const mockVersionAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'release' },
                            right: { kind: 'string', value: '3.11.2+ (Build: 20210618)' }
                        }
                    }
                ]
            };

            (AstManager.getAst as any).mockResolvedValue(mockVersionAst);

            const version = await resolveVersion(moodlePath);
            expect(version).toBe('3.11.2');
        });

        it('should resolve version from public/version.php when root version.php is absent (Moodle >= 5)', async () => {
            const moodlePath = './moodle5';
            const mockVersionAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'release' },
                            right: { kind: 'string', value: '5.2.2 (Build: 20260810)' }
                        }
                    }
                ]
            };

            (AstManager.getAst as any).mockImplementation((file: string) => {
                if (file === 'version.php') {
                    return Promise.reject(new Error('Not found at root'));
                }
                if (file === 'public/version.php') {
                    return Promise.resolve(mockVersionAst);
                }
                return Promise.reject(new Error('Not found'));
            });

            const version = await resolveVersion(moodlePath);
            expect(version).toBe('5.2.2');
            expect(AstManager.getAst).toHaveBeenCalledWith('public/version.php', moodlePath);
        });

        it('should throw descriptive error when release variable is missing in version.php AST', async () => {
            const moodlePath = './invalid/moodle/path';
            const emptyAst = { kind: 'program', children: [] };

            (AstManager.getAst as any).mockResolvedValue(emptyAst);

            await expect(resolveVersion(moodlePath)).rejects.toThrow(
                /Unable to resolve Moodle version from version\.php/
            );
        });

        it('should throw descriptive error when version.php cannot be read or parsed', async () => {
            const moodlePath = './non_existent/moodle';

            (AstManager.getAst as any).mockRejectedValue(new Error('File not found'));

            await expect(resolveVersion(moodlePath)).rejects.toThrow(
                /Unable to resolve Moodle version/
            );
        });

        it('should dynamically ignore plugin version.php files and resolve core version.php in nested directory', async () => {
            const moodlePath = './nested/moodle';
            const pluginVersionAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'propertylookup', what: { kind: 'variable', name: 'plugin' }, offset: { kind: 'identifier', name: 'version' } },
                            right: { kind: 'number', value: '2025100600' }
                        }
                    }
                ]
            };
            const coreVersionAst = {
                kind: 'program',
                children: [
                    {
                        kind: 'expressionstatement',
                        expression: {
                            kind: 'assign',
                            left: { kind: 'variable', name: 'release' },
                            right: { kind: 'string', value: '5.1.0 (Build: 20260901)' }
                        }
                    }
                ]
            };

            (AstManager.getAst as any).mockImplementation((file: string) => {
                if (file === 'version.php') {
                    return Promise.reject(new Error('Not at root'));
                }
                if (file.includes('admin/tool')) {
                    return Promise.resolve(pluginVersionAst);
                }
                return Promise.resolve(coreVersionAst);
            });

            vi.spyOn(Scanner, 'findFiles').mockResolvedValue([
                'nested/moodle/public/admin/tool/version.php',
                'nested/moodle/public/version.php'
            ]);

            const version = await resolveVersion(moodlePath);
            expect(version).toBe('5.1.0');
        });

    });

});
