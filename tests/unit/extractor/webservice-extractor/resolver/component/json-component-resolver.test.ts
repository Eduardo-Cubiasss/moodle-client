import fs from 'fs/promises';
import path from 'path';
import { resolveJsonComponents } from '../../../../../../src/generator/extractor/resolver/component/json-component-resolver';

describe('Unit Test: json-component-resolver (Moodle >= 3.8)', () => {

    const fixturesDir = path.resolve(__dirname, '../../../../../fixtures/component-resolver');
    const mockMoodlePath = path.resolve(__dirname, '../../../../../tmp/mock_moodle_json_test');

    beforeEach(async () => {
        await fs.mkdir(path.join(mockMoodlePath, 'lib'), { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(mockMoodlePath, { recursive: true, force: true });
    });

    it('should load real component4.5.json fixture and extract plugintypes map', async () => {
        const fixtureContent = await fs.readFile(path.join(fixturesDir, 'component4.5.json'), 'utf-8');
        await fs.writeFile(path.join(mockMoodlePath, 'lib/components.json'), fixtureContent, 'utf-8');

        const map = await resolveJsonComponents(mockMoodlePath);

        expect(map).toBeInstanceOf(Map);

        expect(map.get('mod')).toBe('mod');
        expect(map.get('tool')).toBe('admin/tool');
        expect(map.get('aiplacement')).toBe('ai/placement');
        expect(map.get('paygw')).toBe('payment/gateway');
        expect(map.get('qtype')).toBe('question/type');
        expect(map.get('report')).toBe('report');
        expect(map.get('customfield')).toBe('customfield/field');
        expect(map.get('media')).toBe('media/player');
    });

    it('should load real component3.8.json fixture and extract plugintypes map', async () => {
        const fixtureContent = await fs.readFile(path.join(fixturesDir, 'component3.8.json'), 'utf-8');
        await fs.writeFile(path.join(mockMoodlePath, 'lib/components.json'), fixtureContent, 'utf-8');

        const map = await resolveJsonComponents(mockMoodlePath);

        expect(map.get('tool')).toBe('admin/tool');
        expect(map.get('mod')).toBe('mod');
        expect(map.get('auth')).toBe('auth');
        expect(map.get('enrol')).toBe('enrol');
    });

    it('should throw descriptive error when lib/components.json is missing', async () => {
        await expect(resolveJsonComponents('./non_existent_path')).rejects.toThrow(
            /Unable to load components from/
        );
    });

});
