/** Delete a learning plan template. */
export interface CoreCompetencyDeleteTemplateParams {
    /** Data base record id for the template */
    id: number | null;
    /** Boolean to indicate if plans must be deleted */
    deleteplans: boolean | null;
}

/** True if the delete was successful */
export type CoreCompetencyDeleteTemplateReturns = boolean | null;

export type CoreCompetencyDeleteTemplateReturn = CoreCompetencyDeleteTemplateReturns;
export type core_competency_delete_template_returns = CoreCompetencyDeleteTemplateReturns;
