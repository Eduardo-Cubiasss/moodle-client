/** Get the message preferences for a given user. */
export interface CoreMessageGetUserMessagePreferencesParams {
    /** id of the user, 0 for current user */
    userid?: number | null;
}

export interface CoreMessageGetUserMessagePreferencesReturns {
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
    /** Privacy messaging setting to define who can message you */
    blocknoncontacts: number | null;
    /** User preference for using enter to send messages */
    entertosend: boolean | null;
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

export type CoreMessageGetUserMessagePreferencesReturn = CoreMessageGetUserMessagePreferencesReturns;
export type core_message_get_user_message_preferences_returns = CoreMessageGetUserMessagePreferencesReturns;
