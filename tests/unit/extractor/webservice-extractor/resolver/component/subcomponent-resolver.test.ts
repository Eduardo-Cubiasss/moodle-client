import fs from 'fs/promises';
import path from 'path';
import {
    resolveJsonSubplugins,
    resolveAstSubplugins,
    resolveAllSubplugins
} from '../../../../../../src/generator/extractor/resolver/component/subcomponent-resolver';
import AstParser from '../../../../../../src/generator/extractor/parser/ast-parser';
import { configureAstManager, clearAstCache } from '../../../../../../src/generator/extractor/cache/ast-manager';

describe('Unit Test: subcomponent-resolver (Subplugin & Subsystem Branch Discovery)', () => {

    const mockMoodlePath = path.resolve(__dirname, '../../../../../tmp/mock_moodle_subcomponents_test');

    beforeEach(async () => {
        clearAstCache();
        const parser = new AstParser();
        configureAstManager(parser);

        await fs.mkdir(path.join(mockMoodlePath, 'lib/editor/tiny/db'), { recursive: true });
        await fs.mkdir(path.join(mockMoodlePath, 'mod/quiz/db'), { recursive: true });
        await fs.mkdir(path.join(mockMoodlePath, 'mod/assign/db'), { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(mockMoodlePath, { recursive: true, force: true });
    });

    it('should parse modern subplugins.json file and extract plugintypes map', async () => {
        const tinyJson = JSON.stringify({
            subplugintypes: { tiny: 'plugins' },
            plugintypes: { tiny: 'lib/editor/tiny/plugins' }
        });
        const filePath = path.join(mockMoodlePath, 'lib/editor/tiny/db/subplugins.json');
        await fs.writeFile(filePath, tinyJson, 'utf-8');

        const map = await resolveJsonSubplugins(filePath);

        expect(map.get('tiny')).toBe('lib/editor/tiny/plugins');
    });

    it('should parse AST from legacy subplugins.php file and extract plugintypes map', async () => {
        const quizPhp = `<?php
$subplugins = array(
    'quiz' => 'mod/quiz/report',
    'quizaccess' => 'mod/quiz/accessrule'
);
`;
        const filePath = 'mod/quiz/db/subplugins.php';
        await fs.writeFile(path.join(mockMoodlePath, filePath), quizPhp, 'utf-8');

        const map = await resolveAstSubplugins(filePath, mockMoodlePath);

        expect(map.get('quiz')).toBe('mod/quiz/report');
        expect(map.get('quizaccess')).toBe('mod/quiz/accessrule');
    });

    it('should aggregate multiple subplugin definitions into a combined plugintypes map', async () => {
        const tinyJson = JSON.stringify({
            plugintypes: { tiny: 'lib/editor/tiny/plugins' }
        });
        const assignJson = JSON.stringify({
            plugintypes: {
                assignsubmission: 'mod/assign/submission',
                assignfeedback: 'mod/assign/feedback'
            }
        });

        const tinyPath = path.join(mockMoodlePath, 'lib/editor/tiny/db/subplugins.json');
        const assignPath = path.join(mockMoodlePath, 'mod/assign/db/subplugins.json');

        await fs.writeFile(tinyPath, tinyJson, 'utf-8');
        await fs.writeFile(assignPath, assignJson, 'utf-8');

        const map = await resolveAllSubplugins(mockMoodlePath, [tinyPath, assignPath]);

        expect(map.get('tiny')).toBe('lib/editor/tiny/plugins');
        expect(map.get('assignsubmission')).toBe('mod/assign/submission');
        expect(map.get('assignfeedback')).toBe('mod/assign/feedback');
    });

    it('should return empty map for invalid or empty subplugins file gracefully', async () => {
        const invalidJsonPath = path.join(mockMoodlePath, 'lib/editor/tiny/db/subplugins.json');
        await fs.writeFile(invalidJsonPath, 'INVALID JSON', 'utf-8');

        const map = await resolveJsonSubplugins(invalidJsonPath);
        expect(map.size).toBe(0);
    });

});
