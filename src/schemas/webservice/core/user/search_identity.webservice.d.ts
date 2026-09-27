/** Return list of users identities matching the given criteria in their name or other identity fields. */
export interface CoreUserSearchIdentityParams {
    /** The search query */
    query: string | null;
}

export interface CoreUserSearchIdentityReturns {
    list: Array<{
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
    /** Configured maximum users per page. */
    maxusersperpage: number | null;
    /** Were there more records than maxusersperpage found? */
    overflow: boolean | null;
}

export type CoreUserSearchIdentityReturn = CoreUserSearchIdentityReturns;
export type core_user_search_identity_returns = CoreUserSearchIdentityReturns;
