/** Delete filter from report */
export interface CoreReportbuilderFiltersDeleteParams {
    /** Report ID */
    reportid: number | null;
    /** Filter ID */
    filterid: number | null;
}

export interface CoreReportbuilderFiltersDeleteReturns {
    /** hasavailablefilters */
    hasavailablefilters: boolean;
    /** availablefilters */
    availablefilters: Array<{
        optiongroup: {
            /** text */
            text: string;
            /** values */
            values: Array<{
                /** value */
                value: string;
                /** visiblename */
                visiblename: string;
            }>;
        };
    }>;
    /** hasactivefilters */
    hasactivefilters: boolean;
    /** activefilters */
    activefilters: Array<{
        /** id */
        id: number;
        /** heading */
        heading: string;
        /** headingeditable */
        headingeditable: string;
        /** sortorder */
        sortorder: number;
        /** movetitle */
        movetitle: string;
        /** entityname */
        entityname: string;
    }>;
    /** helpicon */
    helpicon: string;
}

export type CoreReportbuilderFiltersDeleteReturn = CoreReportbuilderFiltersDeleteReturns;
export type core_reportbuilder_filters_delete_returns = CoreReportbuilderFiltersDeleteReturns;
