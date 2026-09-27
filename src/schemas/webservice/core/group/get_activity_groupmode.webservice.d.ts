/** Returns effective groupmode used in a given activity. */
export interface CoreGroupGetActivityGroupmodeParams {
    /** course module id */
    cmid: number | null;
}

export interface CoreGroupGetActivityGroupmodeReturns {
    /** group mode: 0 for no groups, 1 for separate groups, 2 for visible groups */
    groupmode: number | null;
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

export type CoreGroupGetActivityGroupmodeReturn = CoreGroupGetActivityGroupmodeReturns;
export type core_group_get_activity_groupmode_returns = CoreGroupGetActivityGroupmodeReturns;
