/** Retrieve a list of users blocked */
export interface CoreMessageGetBlockedUsersParams {
    /** the user whose blocked users we want to retrieve */
    userid: number | null;
}

export interface CoreMessageGetBlockedUsersReturns {
    /** List of blocked users */
    users: Array<{
        /** User ID */
        id: number | null;
        /** User full name */
        fullname: string | null;
        /** User picture URL */
        profileimageurl?: string | null;
    }>;
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type CoreMessageGetBlockedUsersReturn = CoreMessageGetBlockedUsersReturns;
export type core_message_get_blocked_users_returns = CoreMessageGetBlockedUsersReturns;
