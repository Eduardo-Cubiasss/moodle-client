/** Copy a students previous attempt to a new attempt. */
export interface ModAssignCopyPreviousAttemptParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
}

/** list of warnings */
export type ModAssignCopyPreviousAttemptReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignCopyPreviousAttemptReturn = ModAssignCopyPreviousAttemptReturns;
export type mod_assign_copy_previous_attempt_returns = ModAssignCopyPreviousAttemptReturns;
