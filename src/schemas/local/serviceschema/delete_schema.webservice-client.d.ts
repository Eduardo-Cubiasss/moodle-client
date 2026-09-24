/** Delete a service schema. */
export interface LocalServiceschemaDeleteSchemaParams {
    /** Internal ID of the schema */
    id: number | null;
}

export interface LocalServiceschemaDeleteSchemaReturns {
    /** Status of operation */
    status: string | null;
    /** Message */
    message: string | null;
}

export type LocalServiceschemaDeleteSchemaReturn = LocalServiceschemaDeleteSchemaReturns;
export type local_serviceschema_delete_schema_returns = LocalServiceschemaDeleteSchemaReturns;
