/** Deletes a list of conversations. */
export interface CoreMessageDeleteConversationsByIdParams {
    /** The user id of who we want to delete the conversation for */
    userid: number | null;
    /** List of conversation IDs */
    conversationids: number | null[];
}

/** list of warnings */
export type CoreMessageDeleteConversationsByIdReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageDeleteConversationsByIdReturn = CoreMessageDeleteConversationsByIdReturns;
export type core_message_delete_conversations_by_id_returns = CoreMessageDeleteConversationsByIdReturns;
