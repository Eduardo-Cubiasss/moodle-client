/** Load a list of a learning plan templates for a given competency. */
export interface CoreCompetencyListTemplatesUsingCompetencyParams {
    /** The competency id */
    id: number | null;
}

export type CoreCompetencyListTemplatesUsingCompetencyReturns = Array<{
    /** shortname */
    shortname: string;
    /** description */
    description: string;
    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
    descriptionformat?: number | null;
    /** duedate */
    duedate: number;
    /** visible */
    visible: boolean;
    /** contextid */
    contextid: number;
    /** id */
    id: number;
    /** timecreated */
    timecreated: number;
    /** timemodified */
    timemodified: number;
    /** usermodified */
    usermodified: number;
    /** duedateformatted */
    duedateformatted: string;
    /** cohortscount */
    cohortscount: number;
    /** planscount */
    planscount: number;
    /** canmanage */
    canmanage: boolean;
    /** canread */
    canread: boolean;
    /** contextname */
    contextname: string;
    /** contextnamenoprefix */
    contextnamenoprefix: string;
}>;

export type CoreCompetencyListTemplatesUsingCompetencyReturn = CoreCompetencyListTemplatesUsingCompetencyReturns;
export type core_competency_list_templates_using_competency_returns = CoreCompetencyListTemplatesUsingCompetencyReturns;
