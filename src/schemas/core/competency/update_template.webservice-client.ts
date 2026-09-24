/** Update a learning plan template. */
export interface CoreCompetencyUpdateTemplateParams {
    template: {
        /** shortname */
        shortname?: string;
        /** description */
        description?: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** duedate */
        duedate?: number;
        /** visible */
        visible?: boolean;
        /** The context id */
        contextid?: number | null;
        /** The context level */
        contextlevel?: string | null;
        /** The Instance id */
        instanceid?: number | null;
        /** id */
        id: number;
        /** timecreated */
        timecreated?: number;
        /** timemodified */
        timemodified?: number;
        /** usermodified */
        usermodified?: number;
    };
}

/** True if the update was successful */
export type CoreCompetencyUpdateTemplateReturns = boolean | null;

export type CoreCompetencyUpdateTemplateReturn = CoreCompetencyUpdateTemplateReturns;
export type core_competency_update_template_returns = CoreCompetencyUpdateTemplateReturns;
