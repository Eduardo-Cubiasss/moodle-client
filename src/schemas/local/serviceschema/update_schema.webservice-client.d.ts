/** Update an existing service schema. */
export interface LocalServiceschemaUpdateSchemaParams {
    /** Internal ID of the schema */
    id: number | null;
    /** New YAML content */
    yamlcontent: string | null;
}

export interface LocalServiceschemaUpdateSchemaReturns {
    /** Status of operation */
    status: string | null;
    /** Message */
    message: string | null;
}

export type LocalServiceschemaUpdateSchemaReturn = LocalServiceschemaUpdateSchemaReturns;
export type local_serviceschema_update_schema_returns = LocalServiceschemaUpdateSchemaReturns;
