/** Update a competency. */
export interface CoreCompetencyUpdateCompetencyParams {
    competency: {
        /** shortname */
        shortname?: string;
        /** idnumber */
        idnumber?: string;
        /** description */
        description?: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** sortorder */
        sortorder?: number;
        /** parentid */
        parentid?: number;
        /** path */
        path?: string;
        /** ruleoutcome */
        ruleoutcome?: number;
        /** ruletype */
        ruletype?: string | null;
        /** ruleconfig */
        ruleconfig?: string | null;
        /** scaleid */
        scaleid?: number | null;
        /** scaleconfiguration */
        scaleconfiguration?: string | null;
        /** competencyframeworkid */
        competencyframeworkid?: number;
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
export type CoreCompetencyUpdateCompetencyReturns = boolean | null;

export type CoreCompetencyUpdateCompetencyReturn = CoreCompetencyUpdateCompetencyReturns;
export type core_competency_update_competency_returns = CoreCompetencyUpdateCompetencyReturns;
