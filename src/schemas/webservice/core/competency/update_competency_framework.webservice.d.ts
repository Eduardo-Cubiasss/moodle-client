/** Update a competency framework. */
export interface CoreCompetencyUpdateCompetencyFrameworkParams {
    competencyframework: {
        /** shortname */
        shortname?: string;
        /** idnumber */
        idnumber?: string;
        /** description */
        description?: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** visible */
        visible?: boolean;
        /** scaleid */
        scaleid?: number;
        /** scaleconfiguration */
        scaleconfiguration?: string;
        /** The context id */
        contextid?: number | null;
        /** The context level */
        contextlevel?: string | null;
        /** The Instance id */
        instanceid?: number | null;
        /** taxonomies */
        taxonomies?: string;
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
export type CoreCompetencyUpdateCompetencyFrameworkReturns = boolean | null;

export type CoreCompetencyUpdateCompetencyFrameworkReturn = CoreCompetencyUpdateCompetencyFrameworkReturns;
export type core_competency_update_competency_framework_returns = CoreCompetencyUpdateCompetencyFrameworkReturns;
