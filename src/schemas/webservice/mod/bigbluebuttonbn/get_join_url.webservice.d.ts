/** Get the join URL for the meeting and create if it does not exist. */
export interface ModBigbluebuttonbnGetJoinUrlParams {
    /** course module id */
    cmid: number | null;
    /** bigbluebuttonbn group id */
    groupid?: number | null;
}

export interface ModBigbluebuttonbnGetJoinUrlReturns {
    /** Can join session */
    join_url?: string | null;
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

export type ModBigbluebuttonbnGetJoinUrlReturn = ModBigbluebuttonbnGetJoinUrlReturns;
export type mod_bigbluebuttonbn_get_join_url_returns = ModBigbluebuttonbnGetJoinUrlReturns;
