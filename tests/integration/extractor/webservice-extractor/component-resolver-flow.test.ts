import path from 'path';
import fs from 'fs/promises';
import { determineStrategy, resolverComponent } from '../../../../src/generator/extractor/resolver/component-resolver';
import AstParser from '../../../../src/generator/extractor/parser/ast-parser';
import { configureAstManager, clearAstCache } from '../../../../src/generator/extractor/cache/ast-manager';

describe('Integration Flow: Multi-Strategy Component Resolution Pipeline', () => {

    const fixturesDir = path.resolve(__dirname, '../../../fixtures/component-resolver');
    const mockMoodleRoot = path.resolve(__dirname, '../../../tmp/mock_moodle_pipeline');

    const moodle20Path = path.join(mockMoodleRoot, 'v20');
    const moodle37Path = path.join(mockMoodleRoot, 'v37');
    const moodle52Path = path.join(mockMoodleRoot, 'v52');

    beforeAll(async () => {
        clearAstCache();
        const parser = new AstParser();
        configureAstManager(parser);

        await fs.mkdir(path.join(moodle20Path, 'lib'), { recursive: true });
        await fs.writeFile(
            path.join(moodle20Path, 'version.php'),
            `<?php\n$version = 2011120500;\n$release = '2.0.10 (Build: 20111205)';\n`,
            'utf-8'
        );
        const moodlelibContent = await fs.readFile(path.join(fixturesDir, 'moodlelib.php'), 'utf-8');
        await fs.writeFile(path.join(moodle20Path, 'lib/moodlelib.php'), moodlelibContent, 'utf-8');

        await fs.mkdir(path.join(moodle37Path, 'lib/classes'), { recursive: true });
        await fs.writeFile(
            path.join(moodle37Path, 'version.php'),
            `<?php\n$version = 2019052000;\n$release = '3.7 (Build: 20190520)';\n`,
            'utf-8'
        );
        const componentPhpContent = await fs.readFile(path.join(fixturesDir, 'component3.7.php'), 'utf-8');
        await fs.writeFile(path.join(moodle37Path, 'lib/classes/component.php'), componentPhpContent, 'utf-8');

        await fs.mkdir(path.join(moodle52Path, 'lib'), { recursive: true });
        await fs.writeFile(
            path.join(moodle52Path, 'version.php'),
            `<?php\n$version = 2026042000;\n$release = '5.2.2 (Build: 20260420)';\n`,
            'utf-8'
        );
        const componentJsonContent = await fs.readFile(path.join(fixturesDir, 'component4.5.json'), 'utf-8');
        await fs.writeFile(path.join(moodle52Path, 'lib/components.json'), componentJsonContent, 'utf-8');
    });

    afterAll(async () => {
        await fs.rm(mockMoodleRoot, { recursive: true, force: true });
    });

    describe('Phase 1: Version Boundary & Routing Rules', () => {
        it('should correctly select the expected strategy metadata for each mock directory', () => {
            const strat20 = determineStrategy('2.0.10');
            expect(strat20).toEqual({
                target: 'lib/moodlelib.php',
                requiresTrimming: true,
                type: 'trimmed-ast'
            });

            const strat37 = determineStrategy('3.7');
            expect(strat37).toEqual({
                target: 'lib/classes/component.php',
                requiresTrimming: false,
                type: 'ast'
            });

            const strat52 = determineStrategy('5.2.2');
            expect(strat52).toEqual({
                target: 'lib/components.json',
                requiresTrimming: false,
                type: 'json'
            });
        });
    });

    describe('Phase 2: End-to-End Extraction & Component Mapping', () => {
        it('should resolve full component registry for Moodle 2.0 through trimmed moodlelib.php without memory exhaustion', async () => {
            const registry = await resolverComponent(moodle20Path);

            expect(registry.subsystems.get('core')).toBe('lib');
            expect(registry.plugintypes.get('mod')).toBe('mod');
            expect(registry.plugintypes.get('auth')).toBe('auth');
            expect(registry.plugintypes.get('report')).toBe('admin/report');
            expect(registry.plugintypes.get('theme')).toBe('theme');
        });

        it('should resolve full component registry for Moodle 3.7 through AST parsing of lib/classes/component.php', async () => {
            const registry = await resolverComponent(moodle37Path);

            expect(registry.subsystems.get('core')).toBe('lib');
            expect(registry.subsystems.get('group')).toBe('group');
            expect(registry.subsystems.get('core_group')).toBe('group');
            expect(registry.plugintypes.get('mod')).toBe('mod');
            expect(registry.plugintypes.get('tool')).toBe('admin/tool');
        });

        it('should resolve full component registry for Moodle 5.2 through modern lib/components.json', async () => {
            const registry = await resolverComponent(moodle52Path);

            expect(registry.subsystems.get('core')).toBe('lib');
            expect(registry.plugintypes.get('aiplacement')).toBe('ai/placement');
            expect(registry.plugintypes.get('paygw')).toBe('payment/gateway');
            expect(registry.plugintypes.get('tool')).toBe('admin/tool');
            expect(registry.subsystems.get('group')).toBe('group');
            expect(registry.subsystems.get('core_group')).toBe('group');
        });

        it('should maintain persistent version-specific maps across sequential multi-version processing', async () => {
            const map20 = await resolverComponent(moodle20Path);
            const map37 = await resolverComponent(moodle37Path);
            const map52 = await resolverComponent(moodle52Path);

            const reMap20 = await resolverComponent(moodle20Path);
            const reMap37 = await resolverComponent(moodle37Path);
            const reMap52 = await resolverComponent(moodle52Path);

            expect(reMap20).toBe(map20);
            expect(reMap37).toBe(map37);
            expect(reMap52).toBe(map52);

            expect(map20.plugintypes.get('report')).toBe('admin/report');
            expect(map37.subsystems.get('group')).toBe('group');
            expect(map52.subsystems.get('group')).toBe('group');
        });
    });

});
