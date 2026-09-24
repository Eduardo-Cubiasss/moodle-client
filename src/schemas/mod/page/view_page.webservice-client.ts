/** Simulate the view.php web interface page: trigger events, completion, etc... */
export interface ModPageViewPageParams {
    /** page instance id */
    pageid: number | null;
}

export interface ModPageViewPageReturns {
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

export type ModPageViewPageReturn = ModPageViewPageReturns;
export type mod_page_view_page_returns = ModPageViewPageReturns;
