/** Toggle sorting of column within report */
export interface CoreReportbuilderColumnsSortToggleParams {
    /** Report ID */
    reportid: number | null;
    /** Column ID */
    columnid: number | null;
    /** Sort enabled */
    enabled: boolean | null;
    /** Sort direction */
    direction?: number | null;
}

export interface CoreReportbuilderColumnsSortToggleReturns {
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

export type CoreReportbuilderColumnsSortToggleReturn = CoreReportbuilderColumnsSortToggleReturns;
export type core_reportbuilder_columns_sort_toggle_returns = CoreReportbuilderColumnsSortToggleReturns;
