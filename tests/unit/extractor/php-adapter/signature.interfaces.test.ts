import {
    WebserviceSignature,
    ValueSchemaNode,
    ObjectSchemaNode,
    ArraySchemaNode,
    SignatureExtractionPayload,
    WebServiceValueSchema,
    WebServiceParametersSchema,
    WebServiceReturnSchema
} from '../../../../src/generator/extractor/interfaces/signature.interfaces';

describe('Unit Test: TypeScript Signature Interfaces (Phase 1)', () => {

    it('should correctly model a complex WebserviceSignature object in TypeScript', () => {
        const idNode: ValueSchemaNode = {
            kind: 'value',
            type: 'int',
            desc: 'User ID',
            required: 1,
            default: null,
            allownull: false
        };

        const paramsNode: ObjectSchemaNode = {
            kind: 'parameters',
            desc: 'Parameters for get_users',
            required: 1,
            keys: {
                userid: idNode
            }
        };

        const returnsContent: ObjectSchemaNode = {
            kind: 'object',
            desc: 'Single user summary',
            required: 1,
            keys: {
                id: idNode,
                username: {
                    kind: 'value',
                    type: 'text',
                    desc: 'Username',
                    required: 1
                }
            }
        };

        const returnsNode: ArraySchemaNode = {
            kind: 'array',
            desc: 'List of users',
            required: 1,
            content: returnsContent
        };

        const signature: WebserviceSignature = {
            parameters: paramsNode,
            returns: returnsNode
        };

        expect(signature.parameters).toBeDefined();
        const userParam = signature.parameters?.keys.userid as ValueSchemaNode;
        expect(userParam.type).toBe('int');
        expect(signature.returns?.kind).toBe('array');
    });

    it('should model a valid SignatureExtractionPayload object', () => {
        const payload: SignatureExtractionPayload = {
            moodlePath: '/var/www/moodle',
            classFile: 'user/classes/external.php',
            classname: 'core_user_external',
            methodname: 'get_users'
        };

        expect(payload.moodlePath).toBe('/var/www/moodle');
        expect(payload.classname).toBe('core_user_external');
    });

    it('should correctly model WebServiceParametersSchema and WebServiceReturnSchema', () => {
        const idValue: WebServiceValueSchema = {
            kind: 'value',
            type: 'PARAM_INT',
            desc: 'Course ID',
            required: 1
        };

        const params: WebServiceParametersSchema = {
            kind: 'parameters',
            keys: {
                courseid: idValue
            }
        };

        const returns: WebServiceReturnSchema = {
            kind: 'array',
            content: {
                kind: 'object',
                keys: {
                    id: idValue,
                    fullname: {
                        kind: 'value',
                        type: 'PARAM_TEXT',
                        desc: 'Full course name'
                    }
                }
            }
        };

        expect(params.keys.courseid.kind).toBe('value');
        expect(returns.kind).toBe('array');
    });

});
