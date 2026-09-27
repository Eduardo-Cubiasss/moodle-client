/** Retrieves chat sessions for a given chat. */
export interface ModChatGetSessionsParams {
    /** Chat instance id. */
    chatid: number | null;
    /** Get messages from users in this group. 0 means that the function will determine the user group */
    groupid?: number | null;
    /** Whether to show completed sessions or not. */
    showall?: boolean | null;
}

export interface ModChatGetSessionsReturns {
    /** list of users */
    sessions: Array<{
        /** Session start time. */
        sessionstart: number | null;
        /** Session end time. */
        sessionend: number | null;
        /** Session users. */
        sessionusers: Array<{
            /** User id. */
            userid: number | null;
            /** Number of messages in the session. */
            messagecount: number | null;
        }>;
        /** Whether the session is completed or not. */
        iscomplete: boolean | null;
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

export type ModChatGetSessionsReturn = ModChatGetSessionsReturns;
export type mod_chat_get_sessions_returns = ModChatGetSessionsReturns;
