/** Move a template competency to a new relative sort order. */
export interface CoreCompetencyReorderTemplateCompetencyParams {
    /** The template id */
    templateid: number | null;
    /** The competency id we are moving */
    competencyidfrom: number | null;
    /** The competency id we are moving to */
    competencyidto: number | null;
}

/** True if successful. */
export type CoreCompetencyReorderTemplateCompetencyReturns = boolean | null;

export type CoreCompetencyReorderTemplateCompetencyReturn = CoreCompetencyReorderTemplateCompetencyReturns;
export type core_competency_reorder_template_competency_returns = CoreCompetencyReorderTemplateCompetencyReturns;
