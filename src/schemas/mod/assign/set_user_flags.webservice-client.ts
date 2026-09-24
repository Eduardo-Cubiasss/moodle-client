/** Creates or updates user flags */
export interface ModAssignSetUserFlagsParams {
    /** assignment id */
    assignmentid: number | null;
    userflags: Array<{
        /** student id */
        userid: number | null;
        /** locked */
        locked?: number | null;
        /** mailed */
        mailed?: number | null;
        /** extension due date */
        extensionduedate?: number | null;
        /** marking workflow state */
        workflowstate?: string | null;
        /** allocated marker */
        allocatedmarker?: number | null;
    }>;
}

export type ModAssignSetUserFlagsReturns = Array<{
    /** id of record if successful, -1 for failure */
    id: number | null;
    /** userid of record */
    userid: number | null;
    /** Failure error message */
    errormessage?: string | null;
}>;

export type ModAssignSetUserFlagsReturn = ModAssignSetUserFlagsReturns;
export type mod_assign_set_user_flags_returns = ModAssignSetUserFlagsReturns;
