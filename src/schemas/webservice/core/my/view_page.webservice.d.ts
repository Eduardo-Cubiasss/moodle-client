/** Trigger the My or Dashboard viewed event. */
export interface CoreMyViewPageParams {
    /** My page to trigger a view event */
    page: string | null;
}

export interface CoreMyViewPageReturns {
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

export type CoreMyViewPageReturn = CoreMyViewPageReturns;
export type core_my_view_page_returns = CoreMyViewPageReturns;
