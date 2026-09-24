/** Get a single service schema by ID. */
export interface LocalServiceschemaGetSchemaParams {
    /** Internal ID of the schema */
    id: number | null;
}

export interface LocalServiceschemaGetSchemaReturns {
    /** Internal ID of the schema */
    id: number | null;
    /** Schema unique ID */
    schemaid: string | null;
    /** Schema name */
    name: string | null;
    /** Schema version */
    version: string | null;
    /** Schema description */
    description: string | null;
    /** YAML content */
    yaml_content: string | null;
    /** Whether the schema is enabled */
    enabled: boolean | null;
    /** Time created */
    timecreated: number | null;
    /** Time modified */
    timemodified: number | null;
}

export type LocalServiceschemaGetSchemaReturn = LocalServiceschemaGetSchemaReturns;
export type local_serviceschema_get_schema_returns = LocalServiceschemaGetSchemaReturns;
