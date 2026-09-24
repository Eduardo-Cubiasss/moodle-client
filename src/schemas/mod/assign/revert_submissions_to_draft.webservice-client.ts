/** Reverts the list of submissions to draft status */
export interface ModAssignRevertSubmissionsToDraftParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
    /** 1 or more user ids */
    userids: number | null[];
}

/** list of warnings */
export type ModAssignRevertSubmissionsToDraftReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignRevertSubmissionsToDraftReturn = ModAssignRevertSubmissionsToDraftReturns;
export type mod_assign_revert_submissions_to_draft_returns = ModAssignRevertSubmissionsToDraftReturns;
