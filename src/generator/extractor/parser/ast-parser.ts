import phpParser from 'php-parser';
import { AstParserOptions } from '../interfaces/ast/ast-parser.interfaces';

export default class AstParser {
    private engine: phpParser.Engine;

    /**
     * Initializes the AST Parser instance with configurable engine options.
     *
     * @param {AstParserOptions} [options] - Custom parser configuration options.
     */
    constructor(options?: AstParserOptions) {
        this.engine = this.createParserEngine(options);
    }

    /**
     * Builds the php-parser Engine instance with configured parser flags.
     *
     * @param {AstParserOptions} [options] - Parser configuration options.
     * @returns {phpParser.Engine} Configured Engine instance.
     */
    private createParserEngine(options?: AstParserOptions): phpParser.Engine {
        const extractDoc = Boolean(options && options.extractDoc);
        const suppressErrors = !options || options.suppressErrors !== false;

        return new phpParser.Engine({
            parser: {
                extractDoc,
                suppressErrors
            },
            ast: {
                withPositions: false
            }
        });
    }

    /**
     * Parses raw PHP source code into an Abstract Syntax Tree (AST).
     *
     * @param {string} phpCode - PHP source code string.
     * @returns {unknown} Parsed AST root node.
     */
    public parse(phpCode: string): unknown {
        return this.engine.parseCode(phpCode, '');
    }
}
