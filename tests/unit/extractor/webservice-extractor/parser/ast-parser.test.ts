import AstParser from '../../../../../src/generator/extractor/parser/ast-parser';

describe('Unit Test: AstParser', () => {

    it('debe parsear codigo PHP valido a una estructura AST estructurada', () => {
        const parser = new AstParser();
        const phpCode = '<?php class user_external { public static function get_users() {} }';

        const ast = parser.parse(phpCode);

        expect(ast).toBeDefined();
        expect(typeof ast).toBe('object');
        expect(ast).toHaveProperty('kind', 'program');
    });

    it('debe parsear declaraciones de arrays asociativos como $functions', () => {
        const parser = new AstParser();
        const phpCode = '<?php $functions = ["core_user_get_users" => ["classname" => "core_user_external"]];';

        const ast = parser.parse(phpCode);

        expect(ast).toBeDefined();
        expect(ast).toHaveProperty('children');
    });

    it('debe permitir configurar opciones personalizadas en el constructor', () => {
        const parserWithDocs = new AstParser({ extractDoc: true, suppressErrors: true });
        const phpWithDoc = '<?php /** @var int $x */ $x = 1;';

        const ast = parserWithDocs.parse(phpWithDoc);

        expect(ast).toBeDefined();
    });

});
