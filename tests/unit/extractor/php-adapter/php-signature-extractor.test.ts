import childProcess from 'child_process';
import {
    extractWebserviceSignature,
    buildCliArgs,
    parsePhpOutput
} from '../../../../src/generator/extractor/adapter/php-signature-extractor';
import {
    SignatureExtractionPayload,
    ValueSchemaNode,
    ObjectSchemaNode,
    WebServiceArraySchema,
    WebServiceValueSchema
} from '../../../../src/generator/extractor/interfaces/signature.interfaces';

vi.mock('child_process');

import { setPhpBinaryPath } from '../../../../src/generator/extractor/adapter/php-runtime';

describe('Unit Test: PHP Signature Extractor Bridge (Phase 3)', () => {

    const validPayload: SignatureExtractionPayload = {
        moodlePath: '/var/www/moodle',
        classFile: 'user/classes/external.php',
        classname: 'core_user_external',
        methodname: 'get_users'
    };

    beforeEach(() => {
        setPhpBinaryPath('php');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('buildCliArgs', () => {

        it('should format CLI arguments array using discrete parameters without shell interpolation', () => {
            const args = buildCliArgs(validPayload);

            expect(args).toContain('--moodle-root');
            expect(args).toContain('/var/www/moodle');
            expect(args).toContain('--file');
            expect(args).toContain('user/classes/external.php');
            expect(args).toContain('--class');
            expect(args).toContain('core_user_external');
            expect(args).toContain('--method');
            expect(args).toContain('get_users');
        });

    });

    describe('parsePhpOutput', () => {

        it('should parse valid stdout JSON into WebserviceSignature object', () => {
            const sampleJson = JSON.stringify({
                parameters: {
                    kind: 'parameters',
                    keys: {
                        userid: { kind: 'value', type: 'int', required: 1 }
                    }
                },
                returns: {
                    kind: 'array',
                    content: { kind: 'value', type: 'text' }
                }
            });

            const result = parsePhpOutput(sampleJson);
            const userParam = result.parameters?.keys.userid as WebServiceValueSchema;
            expect(userParam.type).toBe('int');
            expect(userParam.primitiveType).toBe('number');
            expect(result.returns?.kind).toBe('array');
            const returns = result.returns as WebServiceArraySchema;
            const returnContent = returns.content as WebServiceValueSchema;
            expect(returnContent.type).toBe('text');
            expect(returnContent.primitiveType).toBe('string');
        });

        it('should throw an error when stdout contains malformed non-JSON data', () => {
            expect(() => parsePhpOutput('Fatal error: unexpected token')).toThrow(
                /Failed to parse PHP adapter JSON output/
            );
        });

    });

    describe('extractWebserviceSignature with Mocked execFile', () => {

        it('should return parsed WebserviceSignature when PHP runner exits with code 0 and valid JSON', async () => {
            const mockOutput = JSON.stringify({
                parameters: { keys: { courseid: { type: 'int' } } },
                returns: { keys: { status: { type: 'bool' } } }
            });

            (childProcess.execFile as unknown as any).mockImplementation(
                (_cmd: string, _args: string[], _opts: unknown, callback: (err: Error | null, stdout: string, stderr: string) => void) => {
                    callback(null, mockOutput, '');
                }
            );

            const signature = await extractWebserviceSignature(validPayload);
            const courseParam = signature.parameters?.keys.courseid as ValueSchemaNode;
            expect(courseParam.type).toBe('int');
            const returnsObj = signature.returns as ObjectSchemaNode;
            const statusReturn = returnsObj.keys.status as ValueSchemaNode;
            expect(statusReturn.type).toBe('bool');
        });

        it('should throw structured error message when PHP runner emits JSON error on stderr', async () => {
            const phpErrorPayload = JSON.stringify({
                success: false,
                code: 4,
                error: 'Call to undefined method sample::execute_parameters()',
                file: '/var/www/moodle/sample.php',
                line: 42
            });

            const mockError = new Error('Command failed') as Error & { code?: number; stderr?: string };
            mockError.code = 4;
            mockError.stderr = phpErrorPayload;

            (childProcess.execFile as unknown as any).mockImplementation(
                (_cmd: string, _args: string[], _opts: unknown, callback: (err: Error | null, stdout: string, stderr: string) => void) => {
                    callback(mockError, '', phpErrorPayload);
                }
            );

            await expect(extractWebserviceSignature(validPayload)).rejects.toThrow(
                /PHP Signature Extraction failed: Call to undefined method/
            );
        });

        it('should throw generic error message when PHP runner emits non-JSON stderr', async () => {
            const mockError = new Error('Process killed') as Error & { code?: number; stderr?: string };
            mockError.code = 1;
            mockError.stderr = 'PHP binary died unexpectedly';

            (childProcess.execFile as unknown as any).mockImplementation(
                (_cmd: string, _args: string[], _opts: unknown, callback: (err: Error | null, stdout: string, stderr: string) => void) => {
                    callback(mockError, '', mockError.stderr ?? '');
                }
            );

            await expect(extractWebserviceSignature(validPayload)).rejects.toThrow(
                /PHP Signature Extraction failed: PHP binary died unexpectedly/
            );
        });

        it('should handle ETIMEDOUT error with a descriptive timeout error message', async () => {
            const mockError = new Error('timed out') as Error & { code?: string; stderr?: string };
            mockError.code = 'ETIMEDOUT';
            mockError.stderr = '';

            (childProcess.execFile as unknown as any).mockImplementation(
                (_cmd: string, _args: string[], _opts: unknown, callback: (err: Error | null, stdout: string, stderr: string) => void) => {
                    callback(mockError, '', '');
                }
            );

            await expect(extractWebserviceSignature(validPayload, 2000)).rejects.toThrow(
                /PHP Signature Extraction failed: Execution timed out/
            );
        });

        it('should format file and line location when available in JSON error payload', async () => {
            const phpErrorPayload = JSON.stringify({
                success: false,
                code: 3,
                error: 'Cannot redeclare function sample()',
                file: '/var/www/moodle/lib/sample.php',
                line: 128
            });

            const mockError = new Error('Command failed') as Error & { code?: number; stderr?: string };
            mockError.code = 3;
            mockError.stderr = phpErrorPayload;

            (childProcess.execFile as unknown as any).mockImplementation(
                (_cmd: string, _args: string[], _opts: unknown, callback: (err: Error | null, stdout: string, stderr: string) => void) => {
                    callback(mockError, '', phpErrorPayload);
                }
            );

            await expect(extractWebserviceSignature(validPayload)).rejects.toThrow(
                /PHP Signature Extraction failed: Cannot redeclare function sample\(\) in \/var\/www\/moodle\/lib\/sample\.php:128/
            );
        });

    });

});

