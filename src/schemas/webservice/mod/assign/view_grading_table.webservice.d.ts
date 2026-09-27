/** Trigger the grading_table_viewed event. */
export interface ModAssignViewGradingTableParams {
    /** assign instance id */
    assignid: number | null;
}

export interface ModAssignViewGradingTableReturns {
    /** status: true if success */
    status: boolean | null;
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type ModAssignViewGradingTableReturn = ModAssignViewGradingTableReturns;
export type mod_assign_view_grading_table_returns = ModAssignViewGradingTableReturns;
