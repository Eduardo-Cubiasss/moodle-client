/** Load competency data for summary template. */
export interface ToolLpDataForCompetencySummaryParams {
    /** The competency id */
    competencyid: number | null;
    /** Include or not related competencies */
    includerelated?: boolean | null;
    /** Include or not competency courses */
    includecourses?: boolean | null;
}

export interface ToolLpDataForCompetencySummaryReturns {
    /** linkedcourses */
    linkedcourses: Array<{
        /** id */
        id: number;
        /** fullname */
        fullname: string;
        /** shortname */
        shortname: string;
        /** idnumber */
        idnumber: string;
        /** summary */
        summary: string | null;
        /** summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        summaryformat?: number | null;
        /** startdate */
        startdate: number;
        /** enddate */
        enddate: number;
        /** visible */
        visible: boolean;
        /** showactivitydates */
        showactivitydates: boolean | null;
        /** showcompletionconditions */
        showcompletionconditions: boolean | null;
        /** pdfexportfont */
        pdfexportfont: string | null;
        /** fullnamedisplay */
        fullnamedisplay: string;
        /** viewurl */
        viewurl: string;
        /** courseimage */
        courseimage: string;
        /** progress */
        progress?: number;
        /** hasprogress */
        hasprogress: boolean;
        /** isfavourite */
        isfavourite: boolean;
        /** hidden */
        hidden: boolean;
        /** timeaccess */
        timeaccess?: number;
        /** showshortname */
        showshortname: boolean;
        /** coursecategory */
        coursecategory: string;
    }>;
    /** relatedcompetencies */
    relatedcompetencies: Array<{
        /** shortname */
        shortname: string;
        /** idnumber */
        idnumber: string;
        /** description */
        description: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** sortorder */
        sortorder: number;
        /** parentid */
        parentid: number;
        /** path */
        path: string;
        /** ruleoutcome */
        ruleoutcome: number;
        /** ruletype */
        ruletype: string | null;
        /** ruleconfig */
        ruleconfig: string | null;
        /** scaleid */
        scaleid: number | null;
        /** scaleconfiguration */
        scaleconfiguration: string | null;
        /** competencyframeworkid */
        competencyframeworkid: number;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
    }>;
    competency: {
        /** shortname */
        shortname: string;
        /** idnumber */
        idnumber: string;
        /** description */
        description: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** sortorder */
        sortorder: number;
        /** parentid */
        parentid: number;
        /** path */
        path: string;
        /** ruleoutcome */
        ruleoutcome: number;
        /** ruletype */
        ruletype: string | null;
        /** ruleconfig */
        ruleconfig: string | null;
        /** scaleid */
        scaleid: number | null;
        /** scaleconfiguration */
        scaleconfiguration: string | null;
        /** competencyframeworkid */
        competencyframeworkid: number;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
    };
    framework: {
        /** shortname */
        shortname: string;
        /** idnumber */
        idnumber: string;
        /** description */
        description: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** visible */
        visible: boolean;
        /** scaleid */
        scaleid: number;
        /** scaleconfiguration */
        scaleconfiguration: string;
        /** contextid */
        contextid: number;
        /** taxonomies */
        taxonomies: string;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
        /** canmanage */
        canmanage: boolean;
        /** competenciescount */
        competenciescount: number;
        /** contextname */
        contextname: string;
        /** contextnamenoprefix */
        contextnamenoprefix: string;
    };
    /** hascourses */
    hascourses: boolean;
    /** hasrelatedcompetencies */
    hasrelatedcompetencies: boolean;
    /** scaleid */
    scaleid: number;
    /** scaleconfiguration */
    scaleconfiguration: string;
    /** taxonomyterm */
    taxonomyterm: string;
    comppath: {
        /** ancestors */
        ancestors: Array<{
            /** id */
            id: number | null;
            /** name */
            name: string;
            /** first */
            first: boolean;
            /** last */
            last: boolean;
            /** position */
            position: number;
        }>;
        framework: {
            /** id */
            id: number | null;
            /** name */
            name: string;
            /** first */
            first: boolean;
            /** last */
            last: boolean;
            /** position */
            position: number;
        };
        /** pluginbaseurl */
        pluginbaseurl: string;
        /** pagecontextid */
        pagecontextid: number;
        /** showlinks */
        showlinks: boolean;
    };
    /** pluginbaseurl */
    pluginbaseurl: string;
}

export type ToolLpDataForCompetencySummaryReturn = ToolLpDataForCompetencySummaryReturns;
export type tool_lp_data_for_competency_summary_returns = ToolLpDataForCompetencySummaryReturns;
