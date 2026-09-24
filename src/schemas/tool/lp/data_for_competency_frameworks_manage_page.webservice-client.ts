/** Load the data for the competency frameworks manage page template */
export interface ToolLpDataForCompetencyFrameworksManagePageParams {
    pagecontext: {
        /** Context ID. Either use this value, or level and instanceid. */
        contextid?: number | null;
        /** Context level. To be used with instanceid. */
        contextlevel?: string | null;
        /** Context instance ID. To be used with level */
        instanceid?: number | null;
    };
}

export interface ToolLpDataForCompetencyFrameworksManagePageReturns {
    competencyframeworks: Array<{
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
    }>;
    /** Url to the tool_lp plugin folder on this Moodle site */
    pluginbaseurl: string | null;
    navigation: string | null[];
    /** The page context id */
    pagecontextid: number | null;
}

export type ToolLpDataForCompetencyFrameworksManagePageReturn = ToolLpDataForCompetencyFrameworksManagePageReturns;
export type tool_lp_data_for_competency_frameworks_manage_page_returns = ToolLpDataForCompetencyFrameworksManagePageReturns;
