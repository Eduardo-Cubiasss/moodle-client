/** Log a user into a chat room in the given chat. */
export interface ModChatLoginUserParams {
    /** chat instance id */
    chatid: number | null;
    /** group id, 0 means that the function will determine the user group */
    groupid?: number | null;
}

export interface ModChatLoginUserReturns {
    /** unique chat session id */
    chatsid: string | null;
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

export type ModChatLoginUserReturn = ModChatLoginUserReturns;
export type mod_chat_login_user_returns = ModChatLoginUserReturns;
