/** Remove the competency from a learning plan */
export interface CoreCompetencyRemoveCompetencyFromPlanParams {
    /** The plan id */
    planid: number | null;
    /** The competency id */
    competencyid: number | null;
}

/** True if successful. */
export type CoreCompetencyRemoveCompetencyFromPlanReturns = boolean | null;

export type CoreCompetencyRemoveCompetencyFromPlanReturn = CoreCompetencyRemoveCompetencyFromPlanReturns;
export type core_competency_remove_competency_from_plan_returns = CoreCompetencyRemoveCompetencyFromPlanReturns;
