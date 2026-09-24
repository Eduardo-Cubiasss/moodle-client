/** Count a list of a learning plan templates. */
export interface CoreCompetencyCountTemplatesParams {
    context: {
        /** Context ID. Either use this value, or level and instanceid. */
        contextid?: number | null;
        /** Context level. To be used with instanceid. */
        contextlevel?: string | null;
        /** Context instance ID. To be used with level */
        instanceid?: number | null;
    };
    /** What other contextes to fetch the frameworks from. (children, parents, self) */
    includes?: string | null;
}

/** The number of learning plan templates found. */
export type CoreCompetencyCountTemplatesReturns = number | null;

export type CoreCompetencyCountTemplatesReturn = CoreCompetencyCountTemplatesReturns;
export type core_competency_count_templates_returns = CoreCompetencyCountTemplatesReturns;
