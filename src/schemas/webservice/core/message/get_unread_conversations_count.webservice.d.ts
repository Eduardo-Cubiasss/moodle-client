/** Retrieve the count of unread conversations for a given user */
export interface CoreMessageGetUnreadConversationsCountParams {
    /** the user id who received the message, 0 for any user */
    useridto: number | null;
}

/** The count of unread messages for the user */
export type CoreMessageGetUnreadConversationsCountReturns = number | null;

export type CoreMessageGetUnreadConversationsCountReturn = CoreMessageGetUnreadConversationsCountReturns;
export type core_message_get_unread_conversations_count_returns = CoreMessageGetUnreadConversationsCountReturns;
