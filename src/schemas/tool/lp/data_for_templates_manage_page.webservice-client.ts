/** Load the data for the learning plan templates manage page template */
export interface ToolLpDataForTemplatesManagePageParams {
    pagecontext: {
        /** Context ID. Either use this value, or level and instanceid. */
        contextid?: number | null;
        /** Context level. To be used with instanceid. */
        contextlevel?: string | null;
        /** Context instance ID. To be used with level */
        instanceid?: number | null;
    };
}

export interface ToolLpDataForTemplatesManagePageReturns {
    templates: Array<{
        /** shortname */
        shortname: string;
        /** description */
        description: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** duedate */
        duedate: number;
        /** visible */
        visible: boolean;
        /** contextid */
        contextid: number;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
        /** duedateformatted */
        duedateformatted: string;
        /** cohortscount */
        cohortscount: number;
        /** planscount */
        planscount: number;
        /** canmanage */
        canmanage: boolean;
        /** canread */
        canread: boolean;
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
    /** Whether the user manage the templates */
    canmanage: boolean | null;
}

export type ToolLpDataForTemplatesManagePageReturn = ToolLpDataForTemplatesManagePageReturns;
export type tool_lp_data_for_templates_manage_page_returns = ToolLpDataForTemplatesManagePageReturns;
