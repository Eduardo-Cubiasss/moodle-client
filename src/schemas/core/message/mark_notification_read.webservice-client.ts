/** Mark a single notification as read, trigger notification_viewed event. */
export interface CoreMessageMarkNotificationReadParams {
    /** id of the notification */
    notificationid: number | null;
    /** timestamp for when the notification should be marked read */
    timeread?: number | null;
}

export interface CoreMessageMarkNotificationReadReturns {
    /** id of the notification */
    notificationid: number | null;
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type CoreMessageMarkNotificationReadReturn = CoreMessageMarkNotificationReadReturns;
export type core_message_mark_notification_read_returns = CoreMessageMarkNotificationReadReturns;
