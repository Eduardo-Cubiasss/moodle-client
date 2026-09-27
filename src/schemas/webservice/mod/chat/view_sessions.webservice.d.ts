/** Trigger the chat session viewed event. */
export interface ModChatViewSessionsParams {
    /** Course module id */
    cmid: number | null;
    /** Session start time */
    start?: number | null;
    /** Session end time */
    end?: number | null;
}

export interface ModChatViewSessionsReturns {
    /** status: true if success */
    status: boolean | null;
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

export type ModChatViewSessionsReturn = ModChatViewSessionsReturns;
export type mod_chat_view_sessions_returns = ModChatViewSessionsReturns;
