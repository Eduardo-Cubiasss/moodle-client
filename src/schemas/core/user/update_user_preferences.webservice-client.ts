/** Update a user's preferences */
export interface CoreUserUpdateUserPreferencesParams {
    /** id of the user, default to current user */
    userid?: number | null;
    /** Enable or disable notifications for this user */
    emailstop?: number | null;
    /** User preferences */
    preferences?: Array<{
        /** The name of the preference */
        type: string | null;
        /** The value of the preference, do not set this field if you want to remove (unset) the current value. */
        value?: string | null;
    }>;
}

export type CoreUserUpdateUserPreferencesReturns = unknown;

export type CoreUserUpdateUserPreferencesReturn = CoreUserUpdateUserPreferencesReturns;
export type core_user_update_user_preferences_returns = CoreUserUpdateUserPreferencesReturns;
