/** Returns the blind marking mappings for assignments */
export interface ModAssignGetUserMappingsParams {
    /** 1 or more assignment ids */
    assignmentids: number | null[];
}

export interface ModAssignGetUserMappingsReturns {
    /** list of assign user mapping data */
    assignments: Array<{
        /** assignment id */
        assignmentid: number | null;
        mappings: Array<{
            /** user mapping id */
            id: number | null;
            /** student id */
            userid: number | null;
        }>;
    }>;
    /** list of warnings */
    warnings?: Array<{
        /** item is always 'assignment' */
        item?: string | null;
        /** when errorcode is 3 then itemid is an assignment id. When errorcode is 1, itemid is a course module id */
        itemid?: number | null;
        /** errorcode can be 3 (no user mappings found) or 1 (no permission to get user mappings) */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type ModAssignGetUserMappingsReturn = ModAssignGetUserMappingsReturns;
export type mod_assign_get_user_mappings_returns = ModAssignGetUserMappingsReturns;
