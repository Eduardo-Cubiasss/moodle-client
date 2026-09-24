import path from 'path';
import { extractWebservice } from '../../../../src/generator/extractor';
import * as Scanner from '../../../../src/generator/extractor/scanner/scanner';
import * as AstManager from '../../../../src/generator/extractor/cache/ast-manager';
import * as ServiceExtractor from '../../../../src/generator/extractor/extractor/service-extractor';
import * as ClassResolver from '../../../../src/generator/extractor/resolver/class-resolver';
import * as PhpSignatureExtractor from '../../../../src/generator/extractor/adapter/php-signature-extractor';

vi.mock('../../../../src/generator/extractor/scanner/scanner');
vi.mock('../../../../src/generator/extractor/cache/ast-manager');
vi.mock('../../../../src/generator/extractor/extractor/service-extractor');
vi.mock('../../../../src/generator/extractor/resolver/class-resolver');
vi.mock('../../../../src/generator/extractor/adapter/php-signature-extractor');

describe('Integration Flow: extractWebservice (Functional Pipeline)', () => {

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should orchestrate sequential communication between all extractor modules and return schemas', async () => {
        const moodlePath = path.resolve('./tests/fixtures/mock_moodle');

        (Scanner.findFiles as any).mockResolvedValue([
            './tests/fixtures/mock_moodle/mod/sample/db/services.php'
        ]);

        const mockServicesAst = { type: 'Program', body: [] };
        (AstManager.getAst as any).mockResolvedValue(mockServicesAst);

        const mockService = {
            name: 'mod_sample_get_items',
            classname: 'test_fixtures\\external\\sample_service_with_exporter',
            type: 'read',
            methodname: 'get_items',
            description: 'Get sample items from fixture'
        };
        (ServiceExtractor.extractServices as any).mockReturnValue([mockService]);

        (ClassResolver.resolveClass as any).mockResolvedValue(
            'mod/sample/classes/external/sample_service_with_exporter.php'
        );

        const mockSignature = {
            parameters: { keys: { courseid: { type: 'int' } } },
            returns: { keys: { items: { type: 'array' } } }
        };
        (PhpSignatureExtractor.extractWebserviceSignature as any).mockResolvedValue(mockSignature);

        const { schemas, errors } = await extractWebservice({
            moodlePath,
            services: ['*']
        });

        expect(Scanner.findFiles).toHaveBeenCalledWith(moodlePath, ['*/db/services.php']);
        expect(AstManager.getAst).toHaveBeenCalledWith('./tests/fixtures/mock_moodle/mod/sample/db/services.php', moodlePath);
        expect(ServiceExtractor.extractServices).toHaveBeenCalledWith(mockServicesAst);
        expect(ClassResolver.resolveClass).toHaveBeenCalledWith(mockService, moodlePath);
        expect(PhpSignatureExtractor.extractWebserviceSignature).toHaveBeenCalledWith({
            moodlePath,
            classFile: 'mod/sample/classes/external/sample_service_with_exporter.php',
            classname: 'test_fixtures\\external\\sample_service_with_exporter',
            methodname: 'get_items'
        });

        expect(errors).toHaveLength(0);
        expect(schemas).toEqual([
            {
                name: 'mod_sample_get_items',
                description: 'Get sample items from fixture',
                parameters: mockSignature.parameters,
                returns: mockSignature.returns
            }
        ]);
    });

    it('should handle unresolvable service classes by recording an error entry', async () => {
        const moodlePath = path.resolve('./tests/fixtures/mock_moodle');

        (Scanner.findFiles as any).mockResolvedValue(['./tests/fixtures/mock_moodle/unknown/db/services.php']);
        (AstManager.getAst as any).mockResolvedValue({ type: 'Program' });

        const unresolvableService = {
            name: 'unknown_service',
            classname: 'unknown_class'
        };
        (ServiceExtractor.extractServices as any).mockReturnValue([unresolvableService]);
        (ClassResolver.resolveClass as any).mockResolvedValue(null);

        const { schemas, errors } = await extractWebservice({ moodlePath });

        expect(PhpSignatureExtractor.extractWebserviceSignature).not.toHaveBeenCalled();
        expect(schemas).toHaveLength(0);
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('CLASS_NOT_FOUND');
        expect(errors[0].serviceName).toBe('unknown_service');
    });

    it('should invoke progress callback and console progress when progress option is enabled', async () => {
        const moodlePath = path.resolve('./tests/fixtures/mock_moodle');

        (Scanner.findFiles as any).mockResolvedValue([
            './tests/fixtures/mock_moodle/mod/sample/db/services.php'
        ]);
        (AstManager.getAst as any).mockResolvedValue({ type: 'Program', body: [] });
        (ServiceExtractor.extractServices as any).mockReturnValue([{
            name: 'mod_sample_service',
            classname: 'test_fixtures\\sample',
            methodname: 'execute'
        }]);
        (ClassResolver.resolveClass as any).mockResolvedValue('sample.php');
        (PhpSignatureExtractor.extractWebserviceSignature as any).mockResolvedValue({
            parameters: { keys: {} },
            returns: { keys: {} }
        });

        const progressUpdates: unknown[] = [];
        const resultWithCallback = await extractWebservice({
            moodlePath,
            progress: (p) => progressUpdates.push(p)
        });

        expect(resultWithCallback.schemas).toHaveLength(1);
        expect(progressUpdates.length).toBeGreaterThan(0);
        expect((progressUpdates[0] as { total: number }).total).toBe(1);

        const resultWithBool = await extractWebservice({
            moodlePath,
            progress: true
        });
        expect(resultWithBool.schemas).toHaveLength(1);
    });

});

