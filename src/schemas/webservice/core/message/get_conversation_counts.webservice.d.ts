/** Retrieve a list of conversation counts, indexed by type. */
export interface CoreMessageGetConversationCountsParams {
    /** id of the user, 0 for current user */
    userid?: number | null;
}

export interface CoreMessageGetConversationCountsReturns {
    /** Total number of favourite conversations */
    favourites: number | null;
    types: {
        /** Total number of individual conversations */
        1: number | null;
        /** Total number of group conversations */
        2: number | null;
        /** Total number of self conversations */
        3: number | null;
    };
}

export type CoreMessageGetConversationCountsReturn = CoreMessageGetConversationCountsReturns;
export type core_message_get_conversation_counts_returns = CoreMessageGetConversationCountsReturns;
