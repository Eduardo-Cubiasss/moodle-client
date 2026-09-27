/** Simulate the view.php web interface resource: trigger events, completion, etc... */
export interface ModResourceViewResourceParams {
    /** resource instance id */
    resourceid: number | null;
}

export interface ModResourceViewResourceReturns {
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

export type ModResourceViewResourceReturn = ModResourceViewResourceReturns;
export type mod_resource_view_resource_returns = ModResourceViewResourceReturns;
