/** Get the dynamic table content raw html */
export interface CoreTableGetDynamicTableContentParams {
    /** Component */
    component: string | null;
    /** Handler */
    handler: string | null;
    /** Unique ID for the container */
    uniqueid: string | null;
    /** The combined sort order of the table. Multiple fields can be specified. */
    sortdata?: Array<{
        /** The name of a sortable column */
        sortby: string | null;
        /** The direction that this column should be sorted by */
        sortorder: string | null;
    }>;
    /** The filters that will be applied in the request */
    filters?: Array<{
        /** Name of the filter */
        name: string | null;
        /** Type of join for filter values */
        jointype: number | null;
        /** The value to filter on */
        values: string | null[];
        /** Additional options for this filter */
        filteroptions?: Array<{
            /** Name of the filter option */
            name: string | null;
            /** Value of the filter option */
            value: string | null;
        }>;
    }>;
    /** Type of join to join all filters together */
    jointype: number | null;
    /** The first initial to sort filter on */
    firstinitial: string | null;
    /** The last initial to sort filter on */
    lastinitial: string | null;
    /** The page number */
    pagenumber: number | null;
    /** The number of records per page */
    pagesize: number | null;
    hiddencolumns: string | null[];
    /** Whether the table preferences should be reset */
    resetpreferences: boolean | null;
}

export interface CoreTableGetDynamicTableContentReturns {
    /** The raw html of the requested table. */
    html: string | null;
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

export type CoreTableGetDynamicTableContentReturn = CoreTableGetDynamicTableContentReturns;
export type core_table_get_dynamic_table_content_returns = CoreTableGetDynamicTableContentReturns;
