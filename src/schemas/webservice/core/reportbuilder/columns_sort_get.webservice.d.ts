/** Retrieve column sorting for report */
export interface CoreReportbuilderColumnsSortGetParams {
    /** Report ID */
    reportid: number | null;
}

export interface CoreReportbuilderColumnsSortGetReturns {
    /** hassortablecolumns */
    hassortablecolumns: boolean;
    /** sortablecolumns */
    sortablecolumns: Array<{
        /** id */
        id: number;
        /** title */
        title: string;
        /** heading */
        heading: string;
        /** sortdirection */
        sortdirection: number;
        /** sortenabled */
        sortenabled: boolean;
        /** sortorder */
        sortorder: number;
        sorticon: {
            /** key */
            key: string;
            /** component */
            component: string;
            /** title */
            title: string;
        };
        /** movetitle */
        movetitle: string;
        /** sortenabledtitle */
        sortenabledtitle: string;
    }>;
    /** helpicon */
    helpicon: string;
}

export type CoreReportbuilderColumnsSortGetReturn = CoreReportbuilderColumnsSortGetReturns;
export type core_reportbuilder_columns_sort_get_returns = CoreReportbuilderColumnsSortGetReturns;
