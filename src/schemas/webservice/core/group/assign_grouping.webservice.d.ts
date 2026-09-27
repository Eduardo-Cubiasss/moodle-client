/** Assing groups from groupings */
export interface CoreGroupAssignGroupingParams {
    assignments: Array<{
        /** grouping record id */
        groupingid: number | null;
        /** group record id */
        groupid: number | null;
    }>;
}

export type CoreGroupAssignGroupingReturns = unknown;

export type CoreGroupAssignGroupingReturn = CoreGroupAssignGroupingReturns;
export type core_group_assign_grouping_returns = CoreGroupAssignGroupingReturns;
