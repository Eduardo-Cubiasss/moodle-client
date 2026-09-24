/** Add filter to report */
export interface CoreReportbuilderFiltersAddParams {
    /** Report ID */
    reportid: number | null;
    /** Unique identifier of the filter */
    uniqueidentifier: string | null;
}

export interface CoreReportbuilderFiltersAddReturns {
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

export type CoreReportbuilderFiltersAddReturn = CoreReportbuilderFiltersAddReturns;
export type core_reportbuilder_filters_add_returns = CoreReportbuilderFiltersAddReturns;
