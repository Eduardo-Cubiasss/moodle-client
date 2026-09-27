/** Update the module completion status. */
export interface ModAssignViewAssignParams {
    /** assign instance id */
    assignid: number | null;
}

export interface ModAssignViewAssignReturns {
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

export type ModAssignViewAssignReturn = ModAssignViewAssignReturns;
export type mod_assign_view_assign_returns = ModAssignViewAssignReturns;
