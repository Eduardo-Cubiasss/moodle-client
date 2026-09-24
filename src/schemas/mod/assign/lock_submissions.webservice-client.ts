/** Prevent students from making changes to a list of submissions */
export interface ModAssignLockSubmissionsParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
    /** 1 or more user ids */
    userids: number | null[];
}

/** list of warnings */
export type ModAssignLockSubmissionsReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignLockSubmissionsReturn = ModAssignLockSubmissionsReturns;
export type mod_assign_lock_submissions_returns = ModAssignLockSubmissionsReturns;
