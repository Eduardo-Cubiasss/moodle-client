import fs from 'fs/promises';
import path from 'path';
import { resolveLegacyMoodlelibComponents } from '../../../../../../src/generator/extractor/resolver/component/legacy-moodlelib-resolver';

describe('Unit Test: legacy-moodlelib-resolver (Moodle 2.0 - 2.5)', () => {

    const fixturesDir = path.resolve(__dirname, '../../../../../fixtures/component-resolver');
    const mockMoodlePath = path.resolve(__dirname, '../../../../../tmp/mock_moodle_legacy_test');

    beforeEach(async () => {
        await fs.mkdir(path.join(mockMoodlePath, 'lib'), { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(mockMoodlePath, { recursive: true, force: true });
    });

    it('should read real 10,000-line moodlelib.php fixture, trim get_plugin_types and extract plugin types into Map', async () => {
        const fixtureContent = await fs.readFile(path.join(fixturesDir, 'moodlelib.php'), 'utf-8');
        await fs.writeFile(path.join(mockMoodlePath, 'lib/moodlelib.php'), fixtureContent, 'utf-8');

        const map = await resolveLegacyMoodlelibComponents(mockMoodlePath);

        expect(map).toBeInstanceOf(Map);

        // Plugin types from get_plugin_types
        expect(map.get('mod')).toBe('mod');
        expect(map.get('auth')).toBe('auth');
        expect(map.get('enrol')).toBe('enrol');
        expect(map.get('message')).toBe('message/output');
        expect(map.get('block')).toBe('blocks');
        expect(map.get('filter')).toBe('filter');
        expect(map.get('editor')).toBe('lib/editor');
        expect(map.get('report')).toBe('admin/report');
        expect(map.get('qtype')).toBe('question/type');
        expect(map.get('theme')).toBe('theme');
        expect(map.get('local')).toBe('local');
    });

    it('should throw descriptive error when lib/moodlelib.php is missing', async () => {
        await expect(resolveLegacyMoodlelibComponents('./non_existent_path')).rejects.toThrow(
            /Unable to load legacy moodlelib from/
        );
    });

    it('should throw descriptive error when get_plugin_types function cannot be found in moodlelib.php', async () => {
        await fs.writeFile(path.join(mockMoodlePath, 'lib/moodlelib.php'), '<?php function other() {}', 'utf-8');

        await expect(resolveLegacyMoodlelibComponents(mockMoodlePath)).rejects.toThrow(
            /Unable to locate get_plugin_types function in moodlelib\.php/
        );
    });

});
