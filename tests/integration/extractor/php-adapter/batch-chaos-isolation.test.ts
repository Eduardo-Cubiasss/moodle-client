import fs from 'fs';
import path from 'path';
import { extractBatchSignatures } from '../../../../src/generator/extractor/adapter/batch-signature-extractor';
import { BatchServiceItem } from '../../../../src/generator/extractor/interfaces/batch.interfaces';

const MOCK_MOODLE = path.resolve(__dirname, '../../../fixtures/mock_moodle');
const CHAOS_DIR = path.join(MOCK_MOODLE, 'mod/sample/classes/external');
const CHAOS_FILE = path.join(CHAOS_DIR, 'chaos_decoy_service.php');

describe('Chaos Engineering Test: Surgical Crash Isolation (die / exit Recovery)', () => {

    beforeAll(() => {
        const phpContent = `<?php
class chaos_decoy_service {
    public static function execute_parameters() {
        die("CHAOS INJECTION: Fatal simulated process termination");
    }
}
`;
        fs.writeFileSync(CHAOS_FILE, phpContent, 'utf-8');
    });

    afterAll(() => {
        if (fs.existsSync(CHAOS_FILE)) {
            fs.unlinkSync(CHAOS_FILE);
        }
    });

    it('should isolate crash from die(), record error diagnostic, and successfully extract healthy services', async () => {
        const validItem: BatchServiceItem = {
            serviceName: 'mod_sample_get_items',
            classFile: 'mod/sample/classes/external/sample_service_with_exporter.php',
            classname: 'mod_sample\\external\\sample_service_with_exporter',
            methodname: 'get_items'
        };

        const chaosItem: BatchServiceItem = {
            serviceName: 'chaos_decoy_killer',
            classFile: 'mod/sample/classes/external/chaos_decoy_service.php',
            classname: 'chaos_decoy_service',
            methodname: 'execute'
        };

        const items: BatchServiceItem[] = [
            { ...validItem, serviceName: 'healthy_before_1' },
            { ...validItem, serviceName: 'healthy_before_2' },
            chaosItem,
            { ...validItem, serviceName: 'healthy_after_1' },
            { ...validItem, serviceName: 'healthy_after_2' }
        ];

        const result = await extractBatchSignatures(items, MOCK_MOODLE);

        // 1. All healthy services extracted successfully
        expect(result.signatures.has('healthy_before_1')).toBe(true);
        expect(result.signatures.has('healthy_before_2')).toBe(true);
        expect(result.signatures.has('healthy_after_1')).toBe(true);
        expect(result.signatures.has('healthy_after_2')).toBe(true);

        // 2. Crashing decoy is classified as error with diagnostic
        expect(result.errors.has('chaos_decoy_killer')).toBe(true);
        const errorMsg = result.errors.get('chaos_decoy_killer');
        expect(errorMsg).toContain('CHAOS INJECTION');

        // 3. Zero uncompleted items remain
        expect(result.uncompleted.length).toBe(0);
    });

});
