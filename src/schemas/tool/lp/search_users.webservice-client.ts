/** Search for users. */
export interface ToolLpSearchUsersParams {
    /** Query string */
    query: string | null;
    /** Required capability */
    capability: string | null;
    /** Number of records to skip */
    limitfrom?: number | null;
    /** Number of records to fetch */
    limitnum?: string | null;
}

export interface ToolLpSearchUsersReturns {
    users: Array<{
        /** id */
        id: number;
        /** email */
        email: string;
        /** idnumber */
        idnumber: string;
        /** phone1 */
        phone1: string;
        /** phone2 */
        phone2: string;
        /** department */
        department: string;
        /** institution */
        institution: string;
        /** fullname */
        fullname: string;
        /** identity */
        identity: string;
        /** profileurl */
        profileurl: string;
        /** profileimageurl */
        profileimageurl: string;
        /** profileimageurlsmall */
        profileimageurlsmall: string;
    }>;
    /** Total number of results. */
    count: number | null;
}

export type ToolLpSearchUsersReturn = ToolLpSearchUsersReturns;
export type tool_lp_search_users_returns = ToolLpSearchUsersReturns;
