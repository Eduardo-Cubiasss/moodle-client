/** Create a new service schema. */
export interface LocalServiceschemaCreateSchemaParams {
    /** YAML content of the schema */
    yamlcontent: string | null;
    /** Generate token automatically */
    generatetoken?: boolean | null;
}

export interface LocalServiceschemaCreateSchemaReturns {
    /** ID of the created schema */
    id: number | null;
    /** Status of operation */
    status: string | null;
    /** Message */
    message: string | null;
    /** Generated token if requested */
    token?: string | null;
}

export type LocalServiceschemaCreateSchemaReturn = LocalServiceschemaCreateSchemaReturns;
export type local_serviceschema_create_schema_returns = LocalServiceschemaCreateSchemaReturns;
