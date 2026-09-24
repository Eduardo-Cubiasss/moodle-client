/** Retrieve a list of unread conversation counts, indexed by type. */
export interface CoreMessageGetUnreadConversationCountsParams {
    /** id of the user, 0 for current user */
    userid?: number | null;
}

export interface CoreMessageGetUnreadConversationCountsReturns {
    /** Total number of unread favourite conversations */
    favourites: number | null;
    types: {
        /** Total number of unread individual conversations */
        1: number | null;
        /** Total number of unread group conversations */
        2: number | null;
        /** Total number of unread self conversations */
        3: number | null;
    };
}

export type CoreMessageGetUnreadConversationCountsReturn = CoreMessageGetUnreadConversationCountsReturns;
export type core_message_get_unread_conversation_counts_returns = CoreMessageGetUnreadConversationCountsReturns;
