import fs from 'fs/promises';
import { getAst, configureAstManager, clearAstCache } from '../../../../../src/generator/extractor/cache/ast-manager';

vi.mock('fs/promises');

describe('Unit Test: ast-manager (In-Memory Execution Cache)', () => {

    let mockParser: any;

    beforeEach(() => {
        clearAstCache();

        mockParser = {
            parse: vi.fn()
        };

        configureAstManager(mockParser);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('on Cache MISS: reads PHP source file, parses AST, and stores in in-memory cache', async () => {
        const relativePath = 'user/externallib.php';
        const repoPath = './src/tmp/moodle/v/4.5';
        const phpContent = '<?php class sample {}';
        const parsedAst = { type: 'Program', body: [] };

        (fs.readFile as any).mockResolvedValue(phpContent);
        mockParser.parse.mockReturnValue(parsedAst);

        const result = await getAst(relativePath, repoPath);

        expect(fs.readFile).toHaveBeenCalledWith(expect.stringContaining(relativePath), 'utf-8');
        expect(mockParser.parse).toHaveBeenCalledWith(phpContent);
        expect(result).toEqual(parsedAst);
    });

    it('on Cache HIT: returns cached in-memory AST without re-reading disk or parsing', async () => {
        const relativePath = 'user/externallib.php';
        const repoPath = './src/tmp/moodle/v/4.5';
        const phpContent = '<?php class sample {}';
        const parsedAst = { type: 'Program', body: [] };

        (fs.readFile as any).mockResolvedValue(phpContent);
        mockParser.parse.mockReturnValue(parsedAst);

        await getAst(relativePath, repoPath);
        (fs.readFile as any).mockClear();
        mockParser.parse.mockClear();

        const cachedResult = await getAst(relativePath, repoPath);
        expect(fs.readFile).not.toHaveBeenCalled();
        expect(mockParser.parse).not.toHaveBeenCalled();
        expect(cachedResult).toEqual(parsedAst);
    });

    it('clearAstCache: clears in-memory cache so subsequent calls re-read disk', async () => {
        const relativePath = 'user/externallib.php';
        const repoPath = './src/tmp/moodle/v/4.5';
        const phpContent = '<?php class sample {}';
        const parsedAst = { type: 'Program', body: [] };

        (fs.readFile as any).mockResolvedValue(phpContent);
        mockParser.parse.mockReturnValue(parsedAst);

        await getAst(relativePath, repoPath);
        clearAstCache();
        (fs.readFile as any).mockClear();

        await getAst(relativePath, repoPath);
        expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

});
