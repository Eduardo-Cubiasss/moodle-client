/** Add the competency to a learning plan */
export interface CoreCompetencyAddCompetencyToPlanParams {
    /** The plan id */
    planid: number | null;
    /** The competency id */
    competencyid: number | null;
}

/** True if successful. */
export type CoreCompetencyAddCompetencyToPlanReturns = boolean | null;

export type CoreCompetencyAddCompetencyToPlanReturn = CoreCompetencyAddCompetencyToPlanReturns;
export type core_competency_add_competency_to_plan_returns = CoreCompetencyAddCompetencyToPlanReturns;
