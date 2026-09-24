/** External function that unenrols a given user enrolment */
export interface CoreEnrolUnenrolUserEnrolmentParams {
    /** User enrolment ID */
    ueid: number | null;
}

export interface CoreEnrolUnenrolUserEnrolmentReturns {
    /** True if the user's enrolment was successfully updated */
    result: boolean | null;
    /** List of validation errors */
    errors: Array<{
        /** The data that failed the validation */
        key: string | null;
        /** The error message */
        message: string | null;
    }>;
}

export type CoreEnrolUnenrolUserEnrolmentReturn = CoreEnrolUnenrolUserEnrolmentReturns;
export type core_enrol_unenrol_user_enrolment_returns = CoreEnrolUnenrolUserEnrolmentReturns;
