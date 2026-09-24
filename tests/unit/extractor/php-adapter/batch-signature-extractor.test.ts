import fs from 'fs';
import path from 'path';
import {
    getBatchCliExecutorPath,
    extractBatchSignatures
} from '../../../../src/generator/extractor/adapter/batch-signature-extractor';
import { BatchServiceItem } from '../../../../src/generator/extractor/interfaces/batch.interfaces';

const MOCK_MOODLE = path.resolve(__dirname, '../../../fixtures/mock_moodle');

describe('Unit Test: batch-signature-extractor.ts TypeScript Adapter', () => {

    it('should locate valid batch-cli-executor.php on filesystem', () => {
        const executorPath = getBatchCliExecutorPath();
        expect(fs.existsSync(executorPath)).toBe(true);
        expect(executorPath).toContain('batch-cli-executor.php');
    });

    it('should return empty result immediately when items array is empty', async () => {
        const result = await extractBatchSignatures([], MOCK_MOODLE);
        expect(result.signatures.size).toBe(0);
        expect(result.errors.size).toBe(0);
        expect(result.uncompleted.length).toBe(0);
    });

    it('should extract signatures and record errors in parallel batch for multiple items', async () => {
        const items: BatchServiceItem[] = [
            {
                serviceName: 'mod_sample_get_items',
                classFile: 'mod/sample/classes/external/sample_service_with_exporter.php',
                classname: 'mod_sample\\external\\sample_service_with_exporter',
                methodname: 'get_items'
            },
            {
                serviceName: 'missing_sample_service',
                classFile: 'mod/sample/classes/external/not_found.php',
                classname: 'missing_class',
                methodname: 'execute'
            }
        ];

        const result = await extractBatchSignatures(items, MOCK_MOODLE);

        expect(result.signatures.has('mod_sample_get_items')).toBe(true);
        const sig = result.signatures.get('mod_sample_get_items');
        expect(sig?.parameters).toBeDefined();
        expect(sig?.returns).toBeDefined();

        expect(result.errors.has('missing_sample_service')).toBe(true);
        expect(result.errors.get('missing_sample_service')).toContain('Class file not found');
        expect(result.uncompleted.length).toBe(0);
    });

    it('should abort and mark items as timed out when timeoutMs is exceeded', async () => {
        const items: BatchServiceItem[] = [
            {
                serviceName: 'timeout_service',
                classFile: 'mod/sample/classes/external/sample_service_with_exporter.php',
                classname: 'mod_sample\\external\\sample_service_with_exporter',
                methodname: 'get_items'
            }
        ];

        // Extreme timeout of 1ms to force watchdog triggering
        const result = await extractBatchSignatures(items, MOCK_MOODLE, 1);
        expect(result.errors.has('timeout_service')).toBe(true);
        expect(result.errors.get('timeout_service')).toBe('Execution timed out');
    });

});
