/** Confirm a user account. */
export interface CoreAuthConfirmUserParams {
    /** User name */
    username: string | null;
    /** Confirmation secret */
    secret: string | null;
}

export interface CoreAuthConfirmUserReturns {
    /** True if the user was confirmed, false if he was already confirmed */
    success: boolean | null;
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

export type CoreAuthConfirmUserReturn = CoreAuthConfirmUserReturns;
export type core_auth_confirm_user_returns = CoreAuthConfirmUserReturns;
