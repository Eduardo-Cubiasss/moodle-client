import path from 'path';
import fs from 'fs';
import { extractBatchSignatures } from '../../../../src/generator/extractor/adapter/batch-signature-extractor';
import { extractWebserviceSignature } from '../../../../src/generator/extractor/adapter/php-signature-extractor';
import { BatchServiceItem } from '../../../../src/generator/extractor/interfaces/batch.interfaces';

function getMoodleTestTarget(): { root: string; file: string; classname: string; methodname: string } {
    const v5 = path.resolve(__dirname, '../../../../src/tmp/moodle/v/5.0');
    if (fs.existsSync(v5)) {
        return {
            root: v5,
            file: 'webservice/externallib.php',
            classname: 'core_webservice_external',
            methodname: 'get_site_info'
        };
    }
    const v2 = path.resolve(__dirname, '../../../../src/tmp/moodle/v/2.0');
    if (fs.existsSync(v2)) {
        return {
            root: v2,
            file: 'group/externallib.php',
            classname: 'moodle_group_external',
            methodname: 'create_groups'
        };
    }
    return {
        root: path.resolve(__dirname, '../../../fixtures/mock_moodle'),
        file: 'mod/sample/classes/external/sample_service_with_exporter.php',
        classname: 'mod_sample\\external\\sample_service_with_exporter',
        methodname: 'get_items'
    };
}

describe('Integration Test: Batch Signature Extractor Live Runner', () => {

    it('should extract signatures in batch and match 100% with single extraction baseline', async () => {
        const target = getMoodleTestTarget();
        const items: BatchServiceItem[] = [
            {
                serviceName: 'test_service_target',
                classFile: target.file,
                classname: target.classname,
                methodname: target.methodname
            }
        ];

        // 1. Single baseline extraction
        const singleBaseline = await extractWebserviceSignature({
            moodlePath: target.root,
            classFile: target.file,
            classname: target.classname,
            methodname: target.methodname
        });

        // 2. Batch extraction
        const batchResult = await extractBatchSignatures(items, target.root);

        expect(batchResult.errors.size).toBe(0);
        expect(batchResult.signatures.has('test_service_target')).toBe(true);

        const batchSig = batchResult.signatures.get('test_service_target');
        expect(batchSig).toBeDefined();

        // 3. Strict schema parity assertion
        expect(JSON.stringify(batchSig?.parameters)).toBe(JSON.stringify(singleBaseline.parameters));
        expect(JSON.stringify(batchSig?.returns)).toBe(JSON.stringify(singleBaseline.returns));
    });

    it('should extract multiple services in sub-second time', async () => {
        const target = getMoodleTestTarget();
        const items: BatchServiceItem[] = [
            {
                serviceName: 'service_1',
                classFile: target.file,
                classname: target.classname,
                methodname: target.methodname
            },
            {
                serviceName: 'service_2',
                classFile: target.file,
                classname: target.classname,
                methodname: target.methodname
            }
        ];

        const start = performance.now();
        const result = await extractBatchSignatures(items, target.root);
        const duration = performance.now() - start;

        expect(result.signatures.size).toBe(2);
        expect(duration).toBeLessThan(1500);
    });

});
