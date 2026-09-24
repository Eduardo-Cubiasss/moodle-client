import fs from 'fs/promises';
import path from 'path';
import AstParser from '../parser/ast-parser';

const memoryAstCache = new Map<string, unknown>();
let defaultParser = new AstParser();

/**
 * Clears in-memory AST cache completely.
 */
export function clearAstCache(): void {
    memoryAstCache.clear();
}

/**
 * Configures the AST Parser instance.
 *
 * @param {AstParser} [customParser] - Custom AstParser instance.
 */
export function configureAstManager(customParser?: AstParser): void {
    if (customParser) {
        defaultParser = customParser;
    }
}

/**
 * Normalizes a file path to be relative to the repository root.
 *
 * @param {string} filePath - Absolute or relative file path.
 * @param {string} repoPath - Root path of the repository.
 * @returns {string} Relative file path within repository.
 */
function toRelativePath(filePath: string, repoPath: string): string {
    if (!repoPath) {
        return filePath;
    }
    const relative = path.relative(repoPath, filePath);
    return relative.startsWith('..') ? filePath : relative;
}

/**
 * Resolves the full filesystem path for a file.
 *
 * @param {string} filePath - Absolute or relative file path.
 * @param {string} repoPath - Root path of the repository.
 * @returns {string} Full resolved file path.
 */
function toFullPath(filePath: string, repoPath: string): string {
    if (!repoPath) {
        return filePath;
    }
    const rel = toRelativePath(filePath, repoPath);
    return path.join(repoPath, rel);
}

/**
 * Obtains the AST for a given PHP file using fast in-memory execution caching.
 *
 * @param {string} filePath - Relative or absolute path of the PHP file.
 * @param {string} repoPath - Root path of the repository.
 * @returns {Promise<unknown>} Parsed AST representation.
 */
export async function getAst(
    filePath: string,
    repoPath: string
): Promise<unknown> {
    const fullPath = toFullPath(filePath, repoPath);
    const cached = memoryAstCache.get(fullPath);
    if (cached) {
        return cached;
    }

    const sourceCode = await fs.readFile(fullPath, 'utf-8');
    const ast = defaultParser.parse(sourceCode);
    memoryAstCache.set(fullPath, ast);
    return ast;
}
