/** Count a list of a competencies. */
export interface CoreCompetencyCountCompetenciesParams {
    filters: Array<{
        /** Column name to filter by */
        column: string | null;
        /** Value to filter by. Must be exact match */
        value: string | null;
    }>;
}

/** The number of competencies found. */
export type CoreCompetencyCountCompetenciesReturns = number | null;

export type CoreCompetencyCountCompetenciesReturn = CoreCompetencyCountCompetenciesReturns;
export type core_competency_count_competencies_returns = CoreCompetencyCountCompetenciesReturns;
