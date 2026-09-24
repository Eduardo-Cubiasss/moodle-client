/** Get all service schemas. */
export interface LocalServiceschemaGetSchemasParams {}

export type LocalServiceschemaGetSchemasReturns = Array<{
    /** Internal ID of the schema */
    id: number | null;
    /** Schema unique ID */
    schemaid: string | null;
    /** Schema name */
    name: string | null;
    /** Schema version */
    version: string | null;
    /** Whether the schema is enabled */
    enabled: boolean | null;
    /** Time created */
    timecreated: number | null;
    /** Time modified */
    timemodified: number | null;
}>;

export type LocalServiceschemaGetSchemasReturn = LocalServiceschemaGetSchemasReturns;
export type local_serviceschema_get_schemas_returns = LocalServiceschemaGetSchemasReturns;
