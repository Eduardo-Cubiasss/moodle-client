/** Retrieve the count of unread popup notifications for a given user */
export interface MessagePopupGetUnreadPopupNotificationCountParams {
    /** the user id who received the message, 0 for any user */
    useridto: number | null;
}

/** The count of unread popup notifications */
export type MessagePopupGetUnreadPopupNotificationCountReturns = number | null;

export type MessagePopupGetUnreadPopupNotificationCountReturn = MessagePopupGetUnreadPopupNotificationCountReturns;
export type message_popup_get_unread_popup_notification_count_returns = MessagePopupGetUnreadPopupNotificationCountReturns;
