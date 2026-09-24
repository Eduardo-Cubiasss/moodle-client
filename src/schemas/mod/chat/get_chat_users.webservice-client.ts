/** Get the list of users in the given chat session. */
export interface ModChatGetChatUsersParams {
    /** chat session id (obtained via mod_chat_login_user) */
    chatsid: string | null;
}

export interface ModChatGetChatUsersReturns {
    /** list of users */
    users: Array<{
        /** user id */
        id: number | null;
        /** user full name */
        fullname: string | null;
        /** user picture URL */
        profileimageurl: string | null;
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

export type ModChatGetChatUsersReturn = ModChatGetChatUsersReturns;
export type mod_chat_get_chat_users_returns = ModChatGetChatUsersReturns;
