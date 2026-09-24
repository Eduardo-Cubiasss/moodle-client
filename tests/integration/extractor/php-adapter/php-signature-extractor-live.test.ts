import path from 'path';
import fs from 'fs';
import { extractWebserviceSignature } from '../../../../src/generator/extractor/adapter/php-signature-extractor';

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

describe('Integration Test: PHP Signature Extractor Bridge Live Runner', () => {

    it('should extract signature live from active moodle target class', async () => {
        const target = getMoodleTestTarget();
        const signature = await extractWebserviceSignature({
            moodlePath: target.root,
            classFile: target.file,
            classname: target.classname,
            methodname: target.methodname
        });

        expect(signature.parameters).toBeDefined();
        expect(signature.returns).toBeDefined();
    });

    it('should reject with descriptive error when target class file does not exist', async () => {
        const target = getMoodleTestTarget();
        await expect(
            extractWebserviceSignature({
                moodlePath: target.root,
                classFile: 'non_existent_file.php',
                classname: 'non_existent_class',
                methodname: 'execute'
            })
        ).rejects.toThrow(/Class file not found on disk/);
    });

});
