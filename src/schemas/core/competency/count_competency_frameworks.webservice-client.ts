/** Count a list of a competency frameworks. */
export interface CoreCompetencyCountCompetencyFrameworksParams {
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

/** The number of competency frameworks found. */
export type CoreCompetencyCountCompetencyFrameworksReturns = number | null;

export type CoreCompetencyCountCompetencyFrameworksReturn = CoreCompetencyCountCompetencyFrameworksReturns;
export type core_competency_count_competency_frameworks_returns = CoreCompetencyCountCompetencyFrameworksReturns;
