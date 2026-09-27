/** Set user preferences. */
export interface CoreUserSetUserPreferencesParams {
    preferences: Array<{
        /** The name of the preference */
        name: string | null;
        /** The value of the preference */
        value: string | null;
        /** Id of the user to set the preference (default to current user) */
        userid?: number | null;
    }>;
}

export interface CoreUserSetUserPreferencesReturns {
    /** Preferences saved */
    saved: Array<{
        /** The name of the preference */
        name: string | null;
        /** The user the preference was set for */
        userid: number | null;
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

export type CoreUserSetUserPreferencesReturn = CoreUserSetUserPreferencesReturns;
export type core_user_set_user_preferences_returns = CoreUserSetUserPreferencesReturns;
