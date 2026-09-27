/** Re-order filter within report */
export interface CoreReportbuilderFiltersReorderParams {
    /** Report ID */
    reportid: number | null;
    /** Filter ID */
    filterid: number | null;
    /** New filter position */
    position: number | null;
}

export interface CoreReportbuilderFiltersReorderReturns {
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

export type CoreReportbuilderFiltersReorderReturn = CoreReportbuilderFiltersReorderReturns;
export type core_reportbuilder_filters_reorder_returns = CoreReportbuilderFiltersReorderReturns;
