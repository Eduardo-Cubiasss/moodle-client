/** Perform password validation. */
export interface EnrolGuestValidatePasswordParams {
    /** instance id of guest enrolment plugin */
    instanceid: number | null;
    /** the course password */
    password: string | null;
}

export interface EnrolGuestValidatePasswordReturns {
    /** Whether the password was successfully validated */
    validated: boolean | null;
    /** Password hint (if enabled) */
    hint?: string | null;
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

export type EnrolGuestValidatePasswordReturn = EnrolGuestValidatePasswordReturns;
export type enrol_guest_validate_password_returns = EnrolGuestValidatePasswordReturns;
