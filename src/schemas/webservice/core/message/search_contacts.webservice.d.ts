/** Search for contacts */
export interface CoreMessageSearchContactsParams {
    /** String the user's fullname has to match to be found */
    searchtext: string | null;
    /** Limit search to the user's courses */
    onlymycourses?: boolean | null;
}

/** List of contacts */
export type CoreMessageSearchContactsReturns = Array<{
    /** User ID */
    id: number | null;
    /** User full name */
    fullname: string | null;
    /** User picture URL */
    profileimageurl?: string | null;
    /** Small user picture URL */
    profileimageurlsmall?: string | null;
}>;

export type CoreMessageSearchContactsReturn = CoreMessageSearchContactsReturns;
export type core_message_search_contacts_returns = CoreMessageSearchContactsReturns;
