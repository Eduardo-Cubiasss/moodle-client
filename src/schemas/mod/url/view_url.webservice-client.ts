/** Trigger the course module viewed event and update the module completion status. */
export interface ModUrlViewUrlParams {
    /** url instance id */
    urlid: number | null;
}

export interface ModUrlViewUrlReturns {
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

export type ModUrlViewUrlReturn = ModUrlViewUrlReturns;
export type mod_url_view_url_returns = ModUrlViewUrlReturns;
