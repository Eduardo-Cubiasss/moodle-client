/** Mutes a list of conversations */
export interface CoreMessageMuteConversationsParams {
    /** The id of the user who is blocking */
    userid: number | null;
    conversationids: number | null[];
}

/** list of warnings */
export type CoreMessageMuteConversationsReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageMuteConversationsReturn = CoreMessageMuteConversationsReturns;
export type core_message_mute_conversations_returns = CoreMessageMuteConversationsReturns;
