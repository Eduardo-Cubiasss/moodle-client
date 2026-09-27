/** Get custom report */
export interface CoreReportbuilderReportsGetParams {
    /** Report ID */
    reportid: number | null;
    /** Whether editing mode is enabled */
    editmode?: boolean | null;
    /** Page size */
    pagesize?: number | null;
}

export interface CoreReportbuilderReportsGetReturns {
    /** name */
    name: string | null;
    /** source */
    source: string;
    /** type */
    type: number;
    /** uniquerows */
    uniquerows: boolean;
    /** conditiondata */
    conditiondata: string | null;
    /** settingsdata */
    settingsdata: string | null;
    /** contextid */
    contextid: number;
    /** component */
    component: string;
    /** area */
    area: string;
    /** itemid */
    itemid: number;
    /** usercreated */
    usercreated: number;
    /** id */
    id: number;
    /** timecreated */
    timecreated: number;
    /** timemodified */
    timemodified: number;
    /** usermodified */
    usermodified: number;
    /** table */
    table: string;
    /** filtersapplied */
    filtersapplied: number;
    /** filterspresent */
    filterspresent: boolean;
    /** filtersform */
    filtersform: string;
    /** attributes */
    attributes: Array<{
        /** name */
        name: string;
        /** value */
        value: string;
    }>;
    /** classes */
    classes: string;
    /** editmode */
    editmode: boolean;
    sidebarmenucards?: {
        /** menucards */
        menucards?: Array<{
            /** name */
            name: string;
            /** key */
            key: string;
            /** items */
            items?: Array<{
                /** name */
                name: string;
                /** identifier */
                identifier: string;
                /** title */
                title: string;
                /** action */
                action: string;
                /** disabled */
                disabled?: boolean;
            }>;
        }>;
    };
    conditions?: {
        /** hasavailableconditions */
        hasavailableconditions: boolean;
        /** availableconditions */
        availableconditions: Array<{
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
        /** hasactiveconditions */
        hasactiveconditions: boolean;
        /** activeconditionsform */
        activeconditionsform: string;
        /** helpicon */
        helpicon: string;
        /** javascript */
        javascript?: string;
    };
    filters?: {
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
    };
    sorting?: {
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
    };
    cardview?: {
        /** form */
        form: string;
        /** helpicon */
        helpicon: string;
    };
    /** javascript */
    javascript: string;
}

export type CoreReportbuilderReportsGetReturn = CoreReportbuilderReportsGetReturns;
export type core_reportbuilder_reports_get_returns = CoreReportbuilderReportsGetReturns;
