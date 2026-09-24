/** Add column to report */
export interface CoreReportbuilderColumnsAddParams {
    /** Report ID */
    reportid: number | null;
    /** Unique identifier of the column */
    uniqueidentifier: string | null;
}

export interface CoreReportbuilderColumnsAddReturns {
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

export type CoreReportbuilderColumnsAddReturn = CoreReportbuilderColumnsAddReturns;
export type core_reportbuilder_columns_add_returns = CoreReportbuilderColumnsAddReturns;
