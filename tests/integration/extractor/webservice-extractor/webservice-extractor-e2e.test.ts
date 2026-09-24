import path from 'path';
import { extractWebservice } from '../../../../src/generator/extractor';
import { ObjectSchemaNode, ValueSchemaNode, ArraySchemaNode } from '../../../../src/generator/extractor/interfaces/signature.interfaces';

const MOCK_MOODLE_DIR = path.resolve(__dirname, '../../../fixtures/mock_moodle');

describe('Integration E2E: extractWebservice (Live Pipeline with Mock Moodle Fixture)', () => {

    it('should scan services.php, resolve class, execute PHP adapter and return schemas in memory', async () => {
        const { schemas, errors } = await extractWebservice({
            moodlePath: MOCK_MOODLE_DIR,
            services: ['*']
        });

        expect(errors).toHaveLength(0);
        expect(schemas).toHaveLength(1);
        const service = schemas[0];
        expect(service.name).toBe('mod_sample_get_items');
        expect(service.description).toBe('Get sample items from fixture');

        const params = service.parameters as ObjectSchemaNode;
        const courseId = params.keys.courseid as ValueSchemaNode;
        expect(courseId.type).toBe('int');

        const returns = service.returns as ObjectSchemaNode;
        const itemsArray = returns.keys.items as ArraySchemaNode;
        const itemContent = itemsArray.content as ObjectSchemaNode;
        const idProp = itemContent.keys.id as ValueSchemaNode;
        expect(idProp.type).toBe('int');
        const titleProp = itemContent.keys.title as ValueSchemaNode;
        expect(titleProp.type).toBe('text');
        expect(returns.keys.warnings).toBeDefined();
    });

});
