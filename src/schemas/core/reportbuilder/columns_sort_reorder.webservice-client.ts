/** Re-order column sorting within report */
export interface CoreReportbuilderColumnsSortReorderParams {
    /** Report ID */
    reportid: number | null;
    /** Column ID */
    columnid: number | null;
    /** New column sort position */
    position: number | null;
}

export interface CoreReportbuilderColumnsSortReorderReturns {
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

export type CoreReportbuilderColumnsSortReorderReturn = CoreReportbuilderColumnsSortReorderReturns;
export type core_reportbuilder_columns_sort_reorder_returns = CoreReportbuilderColumnsSortReorderReturns;
