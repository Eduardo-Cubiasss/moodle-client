/** Trigger view search results event. */
export interface CoreSearchViewResultsParams {
    /** the search query */
    query: string | null;
    /** filters to apply */
    filters?: {
        /** result title */
        title?: string | null;
        /** restrict results to these areas */
        areaids?: string | null[];
        /** restrict results to these courses */
        courseids?: number | null[];
        /** docs modified after this date */
        timestart?: number | null;
        /** docs modified before this date */
        timeend?: number | null;
    };
    /** results page number starting from 0, defaults to the first page */
    page?: number | null;
}

export interface CoreSearchViewResultsReturns {
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

export type CoreSearchViewResultsReturn = CoreSearchViewResultsReturns;
export type core_search_view_results_returns = CoreSearchViewResultsReturns;
