/** Move a plan competency to a new relative sort order. */
export interface CoreCompetencyReorderPlanCompetencyParams {
    /** The plan id */
    planid: number | null;
    /** The competency id we are moving */
    competencyidfrom: number | null;
    /** The competency id we are moving to */
    competencyidto: number | null;
}

/** True if successful. */
export type CoreCompetencyReorderPlanCompetencyReturns = boolean | null;

export type CoreCompetencyReorderPlanCompetencyReturn = CoreCompetencyReorderPlanCompetencyReturns;
export type core_competency_reorder_plan_competency_returns = CoreCompetencyReorderPlanCompetencyReturns;
