import fs from 'fs/promises';
import path from 'path';
import { resolveClassComponents } from '../../../../../../src/generator/extractor/resolver/component/class-component-resolver';
import AstParser from '../../../../../../src/generator/extractor/parser/ast-parser';
import { configureAstManager, clearAstCache } from '../../../../../../src/generator/extractor/cache/ast-manager';

describe('Unit Test: class-component-resolver (Moodle 2.6 - 3.7)', () => {

    const fixturesDir = path.resolve(__dirname, '../../../../../fixtures/component-resolver');
    const mockMoodlePath = path.resolve(__dirname, '../../../../../tmp/mock_moodle_class_test');

    beforeEach(async () => {
        clearAstCache();
        await fs.mkdir(path.join(mockMoodlePath, 'lib/classes'), { recursive: true });
        const parser = new AstParser();
        configureAstManager(parser);
    });

    afterEach(async () => {
        await fs.rm(mockMoodlePath, { recursive: true, force: true });
    });

    it('should parse real component3.7.php fixture and extract all plugintypes', async () => {
        const fixtureContent = await fs.readFile(path.join(fixturesDir, 'component3.7.php'), 'utf-8');
        await fs.writeFile(path.join(mockMoodlePath, 'lib/classes/component.php'), fixtureContent, 'utf-8');

        const map = await resolveClassComponents(mockMoodlePath);

        expect(map).toBeInstanceOf(Map);

        expect(map.get('mod')).toBe('mod');
        expect(map.get('tool')).toBe('admin/tool');
        expect(map.get('qtype')).toBe('question/type');
        expect(map.get('auth')).toBe('auth');
        expect(map.get('enrol')).toBe('enrol');
        expect(map.get('block')).toBe('blocks');
        expect(map.get('editor')).toBe('lib/editor');
    });

    it('should parse real component2.6.php fixture and extract accurate plugintypes map', async () => {
        const fixtureContent = await fs.readFile(path.join(fixturesDir, 'component2.6.php'), 'utf-8');
        await fs.writeFile(path.join(mockMoodlePath, 'lib/classes/component.php'), fixtureContent, 'utf-8');

        const map = await resolveClassComponents(mockMoodlePath);

        expect(map.get('mod')).toBe('mod');
        expect(map.get('tool')).toBe('admin/tool');
        expect(map.get('auth')).toBe('auth');
        expect(map.get('enrol')).toBe('enrol');
    });

    it('should throw descriptive error when lib/classes/component.php is missing', async () => {
        await expect(resolveClassComponents('./non_existent_path')).rejects.toThrow(
            /Unable to resolve component class from/
        );
    });

});
