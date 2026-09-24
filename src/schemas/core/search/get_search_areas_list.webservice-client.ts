/** Get search areas. */
export interface CoreSearchGetSearchAreasListParams {
    /** category to filter areas */
    cat?: string | null;
}

export interface CoreSearchGetSearchAreasListReturns {
    /** Search areas */
    areas: Array<{
        /** search area id */
        id: string | null;
        /** category id */
        categoryid: string | null;
        /** category name */
        categoryname: string | null;
        /** search area name */
        name: string | null;
    }>;
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

export type CoreSearchGetSearchAreasListReturn = CoreSearchGetSearchAreasListReturns;
export type core_search_get_search_areas_list_returns = CoreSearchGetSearchAreasListReturns;
