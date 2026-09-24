/** Adds a new user (pendingto be confirmed) in the site. */
export interface AuthEmailSignupUserParams {
    /** Username */
    username: string | null;
    /** Plain text password */
    password: string | null;
    /** The first name(s) of the user */
    firstname: string | null;
    /** The family name of the user */
    lastname: string | null;
    /** A valid and unique email address */
    email: string | null;
    /** Home city of the user */
    city?: string | null;
    /** Home country code */
    country?: string | null;
    /** Recaptcha challenge hash */
    recaptchachallengehash?: string | null;
    /** Recaptcha response */
    recaptcharesponse?: string | null;
    /** User custom fields (also known as user profile fields) */
    customprofilefields?: Array<{
        /** The type of the custom field */
        type: string | null;
        /** The name of the custom field */
        name: string | null;
        /** Custom field value, can be an encoded json if required */
        value: string | null;
    }>;
    /** Redirect the user to this site url after confirmation. */
    redirect?: string | null;
}

export interface AuthEmailSignupUserReturns {
    /** True if the user was created false otherwise */
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

export type AuthEmailSignupUserReturn = AuthEmailSignupUserReturns;
export type auth_email_signup_user_returns = AuthEmailSignupUserReturns;
