/** Get number of unread notifications. */
export interface CoreMessageGetUnreadNotificationCountParams {
    /** user id who received the notification, 0 for any user */
    useridto: number | null;
}

/** The count of unread notifications. */
export type CoreMessageGetUnreadNotificationCountReturns = number | null;

export type CoreMessageGetUnreadNotificationCountReturn = CoreMessageGetUnreadNotificationCountReturns;
export type core_message_get_unread_notification_count_returns = CoreMessageGetUnreadNotificationCountReturns;
