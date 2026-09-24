import path from 'path';
import { findFiles, findFirstFile, trimPhpFunction } from '../../../../../src/generator/extractor/scanner/scanner';

describe('Unit Test: scanner (Cross-Platform Node.js Filesystem Walker)', () => {

    describe('findFiles', () => {

        it('should discover service files in fixtures matching glob pattern', async () => {
            const fixturePath = path.resolve('./tests/fixtures/mock_moodle');
            const results = await findFiles(fixturePath, ['*/db/services.php']);

            expect(results.length).toBeGreaterThanOrEqual(1);
            expect(results.some(r => r.endsWith('services.php'))).toBe(true);
        });

        it('should return empty array when path does not exist', async () => {
            const nonExistent = path.resolve('./non_existent_folder_xyz');
            const results = await findFiles(nonExistent, ['*/db/services.php']);

            expect(results).toEqual([]);
        });

        it('should support findFirstFile', async () => {
            const fixturePath = path.resolve('./tests/fixtures/mock_moodle');
            const result = await findFirstFile(fixturePath, 'services.php');

            expect(result).toBeDefined();
            expect(result).toContain('services.php');
        });

        it('should return null when findFirstFile finds nothing', async () => {
            const fixturePath = path.resolve('./tests/fixtures/mock_moodle');
            const result = await findFirstFile(fixturePath, 'totally_non_existent_file.xyz');

            expect(result).toBeNull();
        });

    });

    describe('trimPhpFunction', () => {

        it('should extract a single function block from raw PHP content and wrap in php tags', () => {
            const phpSource = `
                <?php
                function unneeded_function() {
                    return false;
                }
                function get_plugin_types($fullpaths=true) {
                    $info = array('mod' => 'mod', 'auth' => 'auth');
                    return $info;
                }
                function another_function() {
                    return true;
                }
            `;

            const trimmed = trimPhpFunction(phpSource, 'get_plugin_types');

            expect(trimmed).toBeDefined();
            expect(trimmed).toContain('<?php');
            expect(trimmed).toContain('function get_plugin_types');
            expect(trimmed).toContain("'mod' => 'mod'");
            expect(trimmed).not.toContain('unneeded_function');
            expect(trimmed).not.toContain('another_function');
        });

        it('should return null when target function is not found in source', () => {
            const phpSource = '<?php function hello() { return "world"; }';
            const trimmed = trimPhpFunction(phpSource, 'non_existent_function');

            expect(trimmed).toBeNull();
        });

        it('should correctly handle nested braces within function body', () => {
            const phpSource = `
                function complex_function() {
                    if (true) {
                        for ($i = 0; $i < 10; $i++) {
                            $x = 1;
                        }
                    }
                    return $x;
                }
            `;

            const trimmed = trimPhpFunction(phpSource, 'complex_function');

            expect(trimmed).toBeDefined();
            expect(trimmed).toContain('for ($i = 0; $i < 10; $i++)');
        });

    });

});