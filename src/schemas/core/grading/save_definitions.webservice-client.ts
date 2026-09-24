/** Save grading definitions */
export interface CoreGradingSaveDefinitionsParams {
    /** areas with definitions to save */
    areas: Array<{
        /** course module id */
        cmid: number | null;
        /** context id */
        contextid: number | null;
        /** component name */
        component: string | null;
        /** area name */
        areaname: string | null;
        /** active method */
        activemethod?: string | null;
        /** definitions */
        definitions: Array<{
            /** definition id */
            id?: number | null;
            /** method */
            method: string | null;
            /** name */
            name: string | null;
            /** description */
            description?: string | null;
            /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
            descriptionformat?: number | null;
            /** status */
            status: number | null;
            /** copied from id */
            copiedfromid?: number | null;
            /** creation time */
            timecreated: number | null;
            /** user who created definition */
            usercreated: number | null;
            /** last modified time */
            timemodified: number | null;
            /** user who modified definition */
            usermodified: number | null;
            /** time copied */
            timecopied?: number | null;
            /** items */
            guide?: {
                guide_criteria?: Array<{
                    /** criterion id */
                    id?: number | null;
                    /** sortorder */
                    sortorder?: number | null;
                    /** description */
                    description?: string | null;
                    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                    descriptionformat?: number | null;
                    /** description */
                    shortname: string | null;
                    /** markers description */
                    descriptionmarkers?: string | null;
                    /** descriptionmarkers format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                    descriptionmarkersformat?: number | null;
                    /** maximum score */
                    maxscore: number | null;
                }>;
                /** comments */
                guide_comments?: Array<{
                    /** criterion id */
                    id?: number | null;
                    /** sortorder */
                    sortorder?: number | null;
                    /** description */
                    description?: string | null;
                    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                    descriptionformat?: number | null;
                }>;
            };
            /** items */
            rubric?: {
                /** definition details */
                rubric_criteria?: Array<{
                    /** criterion id */
                    id?: number | null;
                    /** sortorder */
                    sortorder?: number | null;
                    /** description */
                    description?: string | null;
                    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                    descriptionformat?: number | null;
                    /** levels */
                    levels?: Array<{
                        /** level id */
                        id?: number | null;
                        /** score */
                        score?: number | null;
                        /** definition */
                        definition?: string | null;
                        /** definition format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                        definitionformat?: number | null;
                    }>;
                }>;
            };
        }>;
    }>;
}

export type CoreGradingSaveDefinitionsReturns = unknown;

export type CoreGradingSaveDefinitionsReturn = CoreGradingSaveDefinitionsReturns;
export type core_grading_save_definitions_returns = CoreGradingSaveDefinitionsReturns;
