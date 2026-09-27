/** Executes a check stored in the admin tree and returns the result */
export interface CoreCheckGetResultAdmintreeParams {
    /** ID of node in admintree */
    admintreeid: string | null;
    /** Name of setting */
    settingname: string | null;
    /** If the details should be included in the response. Depending on the check, details could be slower to return. */
    includedetails?: boolean | null;
}

export interface CoreCheckGetResultAdmintreeReturns {
    /** Result status constant */
    status: string | null;
    /** Summary of result */
    summary: string | null;
    /** Rendered full html result */
    html?: string | null;
    /** Details of result (if includedetails was enabled) */
    details?: string | null;
}

export type CoreCheckGetResultAdmintreeReturn = CoreCheckGetResultAdmintreeReturns;
export type core_check_get_result_admintree_returns = CoreCheckGetResultAdmintreeReturns;
