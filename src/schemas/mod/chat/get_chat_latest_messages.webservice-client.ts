/** Get the latest messages from the given chat session. */
export interface ModChatGetChatLatestMessagesParams {
    /** chat session id (obtained via mod_chat_login_user) */
    chatsid: string | null;
    /** last time messages were retrieved (epoch time) */
    chatlasttime?: number | null;
}

export interface ModChatGetChatLatestMessagesReturns {
    /** list of users */
    messages: Array<{
        /** message id */
        id: number | null;
        /** user id */
        userid: number | null;
        /** true if is a system message (like user joined) */
        system: boolean | null;
        /** message text */
        message: string | null;
        /** timestamp for the message */
        timestamp: number | null;
    }>;
    /** new last time */
    chatnewlasttime: number | null;
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

export type ModChatGetChatLatestMessagesReturn = ModChatGetChatLatestMessagesReturns;
export type mod_chat_get_chat_latest_messages_returns = ModChatGetChatLatestMessagesReturns;
