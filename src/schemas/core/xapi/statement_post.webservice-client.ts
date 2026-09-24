/** Post an xAPI statement. */
export interface CoreXapiStatementPostParams {
    /** Component name */
    component: string | null;
    /** json object with all the statements to post */
    requestjson: string | null;
}

/** List of statements storing acceptance results */
export type CoreXapiStatementPostReturns = boolean | null[];

export type CoreXapiStatementPostReturn = CoreXapiStatementPostReturns;
export type core_xapi_statement_post_returns = CoreXapiStatementPostReturns;
