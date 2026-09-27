/** Mark all notifications as read for a given user */
export interface CoreMessageMarkAllNotificationsAsReadParams {
    /** the user id who received the message, 0 for any user */
    useridto: number | null;
    /** the user id who send the message, 0 for any user. -10 or -20 for no-reply or support user */
    useridfrom?: number | null;
    /** mark messages created before this time as read, 0 for all messages */
    timecreatedto?: number | null;
}

/** True if the messages were marked read, false otherwise */
export type CoreMessageMarkAllNotificationsAsReadReturns = boolean | null;

export type CoreMessageMarkAllNotificationsAsReadReturn = CoreMessageMarkAllNotificationsAsReadReturns;
export type core_message_mark_all_notifications_as_read_returns = CoreMessageMarkAllNotificationsAsReadReturns;
