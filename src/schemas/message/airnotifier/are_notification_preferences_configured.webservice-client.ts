/** Check if the users have notification preferences configured yet */
export interface MessageAirnotifierAreNotificationPreferencesConfiguredParams {
    userids: number | null[];
}

export interface MessageAirnotifierAreNotificationPreferencesConfiguredReturns {
    /** list of preferences by user */
    users: Array<{
        /** userid id */
        userid: number | null;
        /** 1 if the user preferences have been configured and 0 if not */
        configured: number | null;
    }>;
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

export type MessageAirnotifierAreNotificationPreferencesConfiguredReturn = MessageAirnotifierAreNotificationPreferencesConfiguredReturns;
export type message_airnotifier_are_notification_preferences_configured_returns = MessageAirnotifierAreNotificationPreferencesConfiguredReturns;
