/** Search for cohorts. This method is deprecated, please call 'core_cohort_search_cohorts' instead */
export interface ToolLpSearchCohortsParams {
    /** Query string */
    query: string | null;
    context: {
        /** Context ID. Either use this value, or level and instanceid. */
        contextid?: number | null;
        /** Context level. To be used with instanceid. */
        contextlevel?: string | null;
        /** Context instance ID. To be used with level */
        instanceid?: number | null;
    };
    /** What other contexts to fetch the frameworks from. (all, parents, self) */
    includes?: string | null;
    /** limitfrom we are fetching the records from */
    limitfrom?: number | null;
    /** Number of records to fetch */
    limitnum?: number | null;
}

export interface ToolLpSearchCohortsReturns {
    cohorts: Array<{
        /** ID of the cohort */
        id: number | null;
        /** cohort name */
        name: string | null;
        /** cohort idnumber */
        idnumber: string | null;
        /** cohort description */
        description: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat: number | null;
        /** cohort visible */
        visible: boolean | null;
        /** cohort theme */
        theme?: string | null;
        /** Custom fields */
        customfields?: Array<{
            /** The name of the custom field */
            name: string | null;
            /** The shortname of the custom field - to be able to build the field class in the code */
            shortname: string | null;
            /** The type of the custom field - text field, checkbox... */
            type: string | null;
            /** The raw value of the custom field */
            valueraw: string | null;
            /** The value of the custom field */
            value: string | null;
        }>;
    }>;
}

export type ToolLpSearchCohortsReturn = ToolLpSearchCohortsReturns;
export type tool_lp_search_cohorts_returns = ToolLpSearchCohortsReturns;
