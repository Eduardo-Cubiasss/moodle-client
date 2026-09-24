/** Return a list of notifications for the current session */
export interface CoreFetchNotificationsParams {
    /** Context ID */
    contextid: number | null;
}

export type CoreFetchNotificationsReturns = Array<{
    /** Name of the template */
    template: string | null;
    variables: {
        /** HTML content of the Notification */
        message: string | null;
        /** Extra classes to provide to the tmeplate */
        extraclasses: string | null;
        /** Whether to announce */
        announce: string | null;
        /** Whether to close */
        closebutton: string | null;
    };
}>;

export type CoreFetchNotificationsReturn = CoreFetchNotificationsReturns;
export type core_fetch_notifications_returns = CoreFetchNotificationsReturns;
