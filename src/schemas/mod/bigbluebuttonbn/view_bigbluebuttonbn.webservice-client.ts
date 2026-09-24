/** Trigger the course module viewed event and update the module completion status. */
export interface ModBigbluebuttonbnViewBigbluebuttonbnParams {
    /** bigbluebuttonbn instance id */
    bigbluebuttonbnid: number | null;
}

export interface ModBigbluebuttonbnViewBigbluebuttonbnReturns {
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

export type ModBigbluebuttonbnViewBigbluebuttonbnReturn = ModBigbluebuttonbnViewBigbluebuttonbnReturns;
export type mod_bigbluebuttonbn_view_bigbluebuttonbn_returns = ModBigbluebuttonbnViewBigbluebuttonbnReturns;
