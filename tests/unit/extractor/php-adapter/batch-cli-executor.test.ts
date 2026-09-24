import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);
const SCRIPT_PATH = path.resolve(__dirname, '../../../../src/generator/php-adapter/batch-cli-executor.php');
const MOCK_MOODLE = path.resolve(__dirname, '../../../fixtures/mock_moodle');

interface SpawnResult {
    code: number | null;
    stdout: string;
    stderr: string;
}

function runBatchScript(args: string[], stdinInput: string): Promise<SpawnResult> {
    return new Promise((resolve) => {
        const child = spawn('php', [SCRIPT_PATH, ...args], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        if (stdinInput) {
            child.stdin.write(stdinInput, 'utf-8', () => {
                child.stdin.end();
            });
        } else {
            child.stdin.end();
        }

        child.on('close', (code) => {
            resolve({ code, stdout, stderr });
        });
    });
}

describe('Unit Test: batch-cli-executor.php CLI Script', () => {

    it('should exit with code 1 when --moodle-root is missing', async () => {
        try {
            await execFileAsync('php', [SCRIPT_PATH]);
            // Should not succeed
            expect(true).toBe(false);
        } catch (err: unknown) {
            const execErr = err as { code: number; stderr: string };
            expect(execErr.code).toBe(1);
            const parsed = JSON.parse(execErr.stderr);
            expect(parsed.success).toBe(false);
            expect(parsed.error).toContain('--moodle-root');
        }
    });

    it('should exit cleanly with code 0 on empty stdin', async () => {
        const result = await runBatchScript(['--moodle-root', MOCK_MOODLE], '');
        expect(result.code).toBe(0);
        expect(result.stdout.trim()).toBe('');
    });

    it('should exit with code 1 when stdin is invalid JSON', async () => {
        const result = await runBatchScript(['--moodle-root', MOCK_MOODLE], 'INVALID_NOT_JSON');
        expect(result.code).toBe(1);
        const parsed = JSON.parse(result.stderr);
        expect(parsed.success).toBe(false);
        expect(parsed.error).toContain('Invalid JSON input');
    });

    it('should stream NDJSON line with success: true for valid service', async () => {
        const payload = JSON.stringify([
            {
                serviceName: 'mock_service',
                classFile: 'mod/sample/classes/external/sample_service_with_exporter.php',
                classname: 'mod_sample\\external\\sample_service_with_exporter',
                methodname: 'get_items'
            }
        ]);

        const result = await runBatchScript(['--moodle-root', MOCK_MOODLE], payload);
        expect(result.code).toBe(0);
        const line = result.stdout.trim();
        const parsed = JSON.parse(line);
        expect(parsed.serviceName).toBe('mock_service');
        expect(parsed.success).toBe(true);
        expect(parsed.signature).toHaveProperty('parameters');
        expect(parsed.signature).toHaveProperty('returns');
    });

    it('should stream NDJSON line with success: false for non-existent class file', async () => {
        const payload = JSON.stringify([
            {
                serviceName: 'missing_service',
                classFile: 'mod/sample/classes/external/non_existent.php',
                classname: 'non_existent_class',
                methodname: 'execute'
            }
        ]);

        const result = await runBatchScript(['--moodle-root', MOCK_MOODLE], payload);
        expect(result.code).toBe(0);
        const parsed = JSON.parse(result.stdout.trim());
        expect(parsed.serviceName).toBe('missing_service');
        expect(parsed.success).toBe(false);
        expect(parsed.error).toContain('Class file not found on disk');
    });

});
