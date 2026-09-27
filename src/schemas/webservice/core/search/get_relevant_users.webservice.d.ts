/** Gets relevant users for a search request. */
export interface CoreSearchGetRelevantUsersParams {
    /** Query string (full or partial user full name or other details) */
    query: string | null;
    /** Course id (0 if none) */
    courseid: number | null;
}

export type CoreSearchGetRelevantUsersReturns = Array<{
    /** User id */
    id: number | null;
    /** Full name as text */
    fullname: string | null;
    /** URL to small profile image */
    profileimageurlsmall: string | null;
}>;

export type CoreSearchGetRelevantUsersReturn = CoreSearchGetRelevantUsersReturns;
export type core_search_get_relevant_users_returns = CoreSearchGetRelevantUsersReturns;
