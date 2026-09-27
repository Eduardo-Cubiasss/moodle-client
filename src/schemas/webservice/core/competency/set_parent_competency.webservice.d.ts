/** Set a new parent for a competency. */
export interface CoreCompetencySetParentCompetencyParams {
    /** The competency id */
    competencyid: number | null;
    /** The new competency parent id */
    parentid: number | null;
}

/** True if the update was successful */
export type CoreCompetencySetParentCompetencyReturns = boolean | null;

export type CoreCompetencySetParentCompetencyReturn = CoreCompetencySetParentCompetencyReturns;
export type core_competency_set_parent_competency_returns = CoreCompetencySetParentCompetencyReturns;
