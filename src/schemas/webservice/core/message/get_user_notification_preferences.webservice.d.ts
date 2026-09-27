/** Get the notification preferences for a given user. */
export interface CoreMessageGetUserNotificationPreferencesParams {
    /** id of the user, 0 for current user */
    userid?: number | null;
}

export interface CoreMessageGetUserNotificationPreferencesReturns {
    preferences: {
        /** User id */
        userid: number | null;
        /** Whether all the preferences are disabled */
        disableall: number | null;
        /** Config form values */
        processors: Array<{
            /** Display name */
            displayname: string | null;
            /** Processor name */
            name: string | null;
            /** Whether has settings */
            hassettings: boolean | null;
            /** Context id */
            contextid: number | null;
            /** Whether is configured by the user */
            userconfigured: number | null;
        }>;
        /** Available components */
        components: Array<{
            /** Display name */
            displayname: string | null;
            /** List of notificaitons for the component */
            notifications: Array<{
                /** Display name */
                displayname: string | null;
                /** Preference key */
                preferencekey: string | null;
                /** Processors values for this notification */
                processors: Array<{
                    /** Display name */
                    displayname: string | null;
                    /** Processor name */
                    name: string | null;
                    /** Is locked by admin? */
                    locked: boolean | null;
                    /** Text to display if locked */
                    lockedmessage?: string | null;
                    /** Is configured? */
                    userconfigured: number | null;
                    /** Is enabled? */
                    enabled: boolean | null;
                }>;
            }>;
        }>;
    };
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

export type CoreMessageGetUserNotificationPreferencesReturn = CoreMessageGetUserNotificationPreferencesReturns;
export type core_message_get_user_notification_preferences_returns = CoreMessageGetUserNotificationPreferencesReturns;
