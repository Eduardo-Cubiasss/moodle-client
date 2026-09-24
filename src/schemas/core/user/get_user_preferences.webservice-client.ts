/** Return user preferences. */
export interface CoreUserGetUserPreferencesParams {
    /** preference name, empty for all */
    name?: string | null;
    /** id of the user, default to current user */
    userid?: number | null;
}

export interface CoreUserGetUserPreferencesReturns {
    /** User custom fields (also known as user profile fields) */
    preferences: Array<{
        /** The name of the preference */
        name: string | null;
        /** The value of the preference */
        value: string | null;
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

export type CoreUserGetUserPreferencesReturn = CoreUserGetUserPreferencesReturns;
export type core_user_get_user_preferences_returns = CoreUserGetUserPreferencesReturns;
