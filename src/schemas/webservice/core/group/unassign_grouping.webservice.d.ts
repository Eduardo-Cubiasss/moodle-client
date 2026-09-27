/** Unassing groups from groupings */
export interface CoreGroupUnassignGroupingParams {
    unassignments: Array<{
        /** grouping record id */
        groupingid: number | null;
        /** group record id */
        groupid: number | null;
    }>;
}

export type CoreGroupUnassignGroupingReturns = unknown;

export type CoreGroupUnassignGroupingReturn = CoreGroupUnassignGroupingReturns;
export type core_group_unassign_grouping_returns = CoreGroupUnassignGroupingReturns;
