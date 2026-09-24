import { PrimitiveType } from '../utils/type-utils';
export { PrimitiveType };

/**
 * Structural schema node kind classification.
 */
export type WebServiceSchemaKind = 'parameters' | 'object' | 'array' | 'value' | 'description';

/**
 * Base schema attributes shared across all schema node types.
 */
export interface WebServiceBaseSchema {
    kind?: WebServiceSchemaKind;
    /** Human-readable parameter or field description written by Moodle developers */
    description?: string;
    /** @deprecated Use description instead. Output JSON only contains description. */
    desc?: string;
    required?: number;
    default?: unknown;
    allownull?: boolean;
}

/**
 * Primitive leaf schema node (maps to Moodle external_value).
 */
export interface WebServiceValueSchema extends WebServiceBaseSchema {
    kind?: 'value';
    /** Moodle parameter type constant name (e.g. 'PARAM_INT', 'PARAM_TEXT', 'PARAM_BOOL', 'PARAM_ALPHANUM') */
    type: string;
    /** Standard primitive scalar data type ('string' | 'number' | 'boolean') */
    primitiveType?: PrimitiveType;
}

/**
 * Associative object schema node with key-value property map (maps to external_single_structure or external_function_parameters).
 */
export interface WebServiceObjectSchema extends WebServiceBaseSchema {
    kind?: 'parameters' | 'object';
    /** Dictionary mapping parameter or property names to their child schemas */
    keys: Record<string, WebServiceReturnSchema>;
}

/**
 * Schema representing the root parameter dictionary of a Web Service (maps to external_function_parameters).
 */
export type WebServiceParametersSchema = WebServiceObjectSchema;

/**
 * Array list schema node containing homogeneous items (maps to Moodle external_multiple_structure).
 */
export interface WebServiceArraySchema extends WebServiceBaseSchema {
    kind?: 'array';
    /** Schema definition of the elements contained in the array */
    content: WebServiceReturnSchema;
}

/**
 * Return schema union representing any valid Moodle return structure (primitive value, object, or array).
 */
export type WebServiceReturnSchema =
    | WebServiceValueSchema
    | WebServiceObjectSchema
    | WebServiceArraySchema;

/**
 * Raw signature definition returned by the sandboxed PHP reflection introspector.
 */
export interface WebserviceSignature {
    parameters: WebServiceParametersSchema | null;
    returns: WebServiceReturnSchema | null;
}

// Backwards-compatible aliases
export type SchemaKind = WebServiceSchemaKind;
export type BaseSchemaNode = WebServiceBaseSchema;
export type ValueSchemaNode = WebServiceValueSchema;
export type ObjectSchemaNode = WebServiceObjectSchema;
export type ArraySchemaNode = WebServiceArraySchema;
export type SchemaNode = WebServiceReturnSchema;

/**
 * Payload sent to the PHP signature extractor.
 */
export interface SignatureExtractionPayload {
    moodlePath: string;
    classFile: string;
    classname: string;
    methodname: string;
}

/**
 * Structured error payload emitted by PHP CLI adapter.
 */
export interface JsonErrorPayload {
    error?: string;
    file?: string;
    line?: number;
}
