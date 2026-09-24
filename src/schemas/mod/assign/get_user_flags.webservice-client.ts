/** Returns the user flags for assignments */
export interface ModAssignGetUserFlagsParams {
    /** 1 or more assignment ids */
    assignmentids: number | null[];
}

export interface ModAssignGetUserFlagsReturns {
    /** list of assign user flag information */
    assignments: Array<{
        /** assignment id */
        assignmentid: number | null;
        userflags: Array<{
            /** user flag id */
            id: number | null;
            /** student id */
            userid: number | null;
            /** locked */
            locked: number | null;
            /** mailed */
            mailed: number | null;
            /** extension due date */
            extensionduedate: number | null;
            /** marking workflow state */
            workflowstate?: string | null;
            /** allocated marker */
            allocatedmarker: number | null;
        }>;
    }>;
    /** list of warnings */
    warnings?: Array<{
        /** item is always 'assignment' */
        item?: string | null;
        /** when errorcode is 3 then itemid is an assignment id. When errorcode is 1, itemid is a course module id */
        itemid?: number | null;
        /** errorcode can be 3 (no user flags found) or 1 (no permission to get user flags) */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type ModAssignGetUserFlagsReturn = ModAssignGetUserFlagsReturns;
export type mod_assign_get_user_flags_returns = ModAssignGetUserFlagsReturns;
