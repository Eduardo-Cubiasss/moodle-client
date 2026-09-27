/** Submit the current students assignment for grading */
export interface ModAssignSubmitForGradingParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
    /** Accept the assignment submission statement */
    acceptsubmissionstatement: boolean | null;
}

/** list of warnings */
export type ModAssignSubmitForGradingReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignSubmitForGradingReturn = ModAssignSubmitForGradingReturns;
export type mod_assign_submit_for_grading_returns = ModAssignSubmitForGradingReturns;
