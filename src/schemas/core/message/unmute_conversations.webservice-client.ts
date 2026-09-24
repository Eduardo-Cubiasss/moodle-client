/** Unmutes a list of conversations */
export interface CoreMessageUnmuteConversationsParams {
    /** The id of the user who is unblocking */
    userid: number | null;
    conversationids: number | null[];
}

/** list of warnings */
export type CoreMessageUnmuteConversationsReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageUnmuteConversationsReturn = CoreMessageUnmuteConversationsReturns;
export type core_message_unmute_conversations_returns = CoreMessageUnmuteConversationsReturns;
