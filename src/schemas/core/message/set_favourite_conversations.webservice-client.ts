/** Mark a conversation or group of conversations as favourites/starred conversations. */
export interface CoreMessageSetFavouriteConversationsParams {
    /** id of the user, 0 for current user */
    userid?: number | null;
    conversations: number | null[];
}

/** list of warnings */
export type CoreMessageSetFavouriteConversationsReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type CoreMessageSetFavouriteConversationsReturn = CoreMessageSetFavouriteConversationsReturns;
export type core_message_set_favourite_conversations_returns = CoreMessageSetFavouriteConversationsReturns;
