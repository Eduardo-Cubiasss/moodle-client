/** Submit the grading form data via ajax */
export interface ModAssignSubmitGradingFormParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
    /** The user id the submission belongs to */
    userid: number | null;
    /** The data from the grading form, encoded as a json array */
    jsonformdata: string | null;
}

/** list of warnings */
export type ModAssignSubmitGradingFormReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignSubmitGradingFormReturn = ModAssignSubmitGradingFormReturns;
export type mod_assign_submit_grading_form_returns = ModAssignSubmitGradingFormReturns;
