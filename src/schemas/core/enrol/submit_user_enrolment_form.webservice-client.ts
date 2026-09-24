/** Submit form data for enrolment form */
export interface CoreEnrolSubmitUserEnrolmentFormParams {
    /** The data from the event form */
    formdata: string | null;
}

export interface CoreEnrolSubmitUserEnrolmentFormReturns {
    /** True if the user's enrolment was successfully updated */
    result: boolean | null;
    /** Indicates invalid form data */
    validationerror?: boolean | null;
}

export type CoreEnrolSubmitUserEnrolmentFormReturn = CoreEnrolSubmitUserEnrolmentFormReturns;
export type core_enrol_submit_user_enrolment_form_returns = CoreEnrolSubmitUserEnrolmentFormReturns;
