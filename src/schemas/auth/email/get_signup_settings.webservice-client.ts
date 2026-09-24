/** Get the signup required settings and profile fields. */
export interface AuthEmailGetSignupSettingsParams {}

export interface AuthEmailGetSignupSettingsReturns {
    namefields: string | null[];
    /** Password policy */
    passwordpolicy?: string | null;
    /** Site policy */
    sitepolicy?: string | null;
    /** Site policy handler */
    sitepolicyhandler?: string | null;
    /** Default city */
    defaultcity?: string | null;
    /** Default country */
    country?: string | null;
    /** Extended characters in usernames or not */
    extendedusernamechars?: boolean | null;
    /** Required profile fields */
    profilefields?: Array<{
        /** Profile field id */
        id?: number | null;
        /** Profile field shortname */
        shortname?: string | null;
        /** Profield field name */
        name?: string | null;
        /** Profield field datatype */
        datatype?: string | null;
        /** Profield field description */
        description?: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat: number | null;
        /** Profield field category id */
        categoryid?: number | null;
        /** Profield field category name */
        categoryname?: string | null;
        /** Profield field sort order */
        sortorder?: number | null;
        /** Profield field required */
        required?: number | null;
        /** Profield field locked */
        locked?: number | null;
        /** Profield field visible */
        visible?: number | null;
        /** Profield field unique */
        forceunique?: number | null;
        /** Profield field in signup form */
        signup?: number | null;
        /** Profield field default data */
        defaultdata?: string | null;
        /** defaultdata format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        defaultdataformat: number | null;
        /** Profield field settings */
        param1?: string | null;
        /** Profield field settings */
        param2?: string | null;
        /** Profield field settings */
        param3?: string | null;
        /** Profield field settings */
        param4?: string | null;
        /** Profield field settings */
        param5?: string | null;
    }>;
    /** Recaptcha public key */
    recaptchapublickey?: string | null;
    /** Recaptcha challenge hash */
    recaptchachallengehash?: string | null;
    /** Recaptcha challenge noscript image */
    recaptchachallengeimage?: string | null;
    /** Recaptcha challenge js url */
    recaptchachallengejs?: string | null;
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

export type AuthEmailGetSignupSettingsReturn = AuthEmailGetSignupSettingsReturns;
export type auth_email_get_signup_settings_returns = AuthEmailGetSignupSettingsReturns;
