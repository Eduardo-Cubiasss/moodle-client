/** Fetches a list of users */
export interface ToolDataprivacyGetUsersParams {
    /** The search query */
    query: string | null;
}

export type ToolDataprivacyGetUsersReturns = Array<{
    /** ID of the user */
    id: number | null;
    /** The fullname of the user */
    fullname: string | null;
    /** List of extra fields */
    extrafields?: Array<{
        /** Name of the extrafield. */
        name: string | null;
        /** Value of the extrafield. */
        value: string | null;
    }>;
}>;

export type ToolDataprivacyGetUsersReturn = ToolDataprivacyGetUsersReturns;
export type tool_dataprivacy_get_users_returns = ToolDataprivacyGetUsersReturns;
