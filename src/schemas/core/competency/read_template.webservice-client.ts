/** Load a summary of a learning plan template. */
export interface CoreCompetencyReadTemplateParams {
    /** Data base record id for the template */
    id: number | null;
}

export interface CoreCompetencyReadTemplateReturns {
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
}

export type CoreCompetencyReadTemplateReturn = CoreCompetencyReadTemplateReturns;
export type core_competency_read_template_returns = CoreCompetencyReadTemplateReturns;
