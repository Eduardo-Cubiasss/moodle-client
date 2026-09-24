/**
 * Metadata for a generated webservice client file, used by the barrel generator.
 */
export interface GeneratedServiceMetadata {
    /** Exact webservice name as registered in Moodle (e.g. 'core_course_get_courses') */
    name: string;
    /** Relative import path for index.ts (e.g. './core/course/get_courses.webservice-client') */
    relativeImportPath: string;
    /** Whether this service has at least one mandatory parameter (VALUE_REQUIRED) */
    hasRequiredParams: boolean;
    /** Optional human-readable description */
    description?: string;
}

/**
 * Structural classification of schema nodes.
 */
export type SchemaKind = "parameters" | "object" | "array" | "value" | "description";

/**
 * Primitive scalar data type classification.
 */
export type PrimitiveType = "string" | "number" | "boolean";

/**
 * Base schema attributes shared across all schema node types.
 */
export interface WebServiceBaseSchema {
    kind?: SchemaKind;
    description?: string;
    required?: number;
    default?: unknown;
    allownull?: boolean;
}

/**
 * Primitive leaf schema node.
 */
export interface WebServiceValueSchema extends WebServiceBaseSchema {
    kind?: "value";
    type: string;
    primitiveType?: PrimitiveType;
}

/**
 * Associative object schema node with key-value property map.
 */
export interface WebServiceObjectSchema extends WebServiceBaseSchema {
    kind?: "parameters" | "object";
    keys: Record<string, WebServiceReturnSchema>;
}

export type WebServiceParametersSchema = WebServiceObjectSchema;

/**
 * Array list schema node containing homogeneous items.
 */
export interface WebServiceArraySchema extends WebServiceBaseSchema {
    kind?: "array";
    content: WebServiceReturnSchema;
}

/**
 * Return schema union representing any valid Moodle return structure.
 */
export type WebServiceReturnSchema =
    | WebServiceValueSchema
    | WebServiceObjectSchema
    | WebServiceArraySchema;

/**
 * Extracted Moodle Web Service schema definition.
 */
export interface WebServiceSchema {
    name: string;
    description?: string;
    parameters: WebServiceParametersSchema | null;
    returns: WebServiceReturnSchema | null;
}
