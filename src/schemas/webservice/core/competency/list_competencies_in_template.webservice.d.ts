/** Load a list of a competencies for a given template. */
export interface CoreCompetencyListCompetenciesInTemplateParams {
    /** The template id */
    id: number | null;
}

export type CoreCompetencyListCompetenciesInTemplateReturns = Array<{
    /** shortname */
    shortname: string;
    /** idnumber */
    idnumber: string;
    /** description */
    description: string;
    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
    descriptionformat?: number | null;
    /** sortorder */
    sortorder: number;
    /** parentid */
    parentid: number;
    /** path */
    path: string;
    /** ruleoutcome */
    ruleoutcome: number;
    /** ruletype */
    ruletype: string | null;
    /** ruleconfig */
    ruleconfig: string | null;
    /** scaleid */
    scaleid: number | null;
    /** scaleconfiguration */
    scaleconfiguration: string | null;
    /** competencyframeworkid */
    competencyframeworkid: number;
    /** id */
    id: number;
    /** timecreated */
    timecreated: number;
    /** timemodified */
    timemodified: number;
    /** usermodified */
    usermodified: number;
}>;

export type CoreCompetencyListCompetenciesInTemplateReturn = CoreCompetencyListCompetenciesInTemplateReturns;
export type core_competency_list_competencies_in_template_returns = CoreCompetencyListCompetenciesInTemplateReturns;
