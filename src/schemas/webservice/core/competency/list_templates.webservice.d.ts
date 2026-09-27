/** Load a list of a learning plan templates. */
export interface CoreCompetencyListTemplatesParams {
    /** Column to sort by. */
    sort?: string | null;
    /** Sort direction. Should be either ASC or DESC */
    order?: string | null;
    /** Skip this number of records before returning results */
    skip?: number | null;
    /** Return this number of records at most. */
    limit?: number | null;
    context: {
        /** Context ID. Either use this value, or level and instanceid. */
        contextid?: number | null;
        /** Context level. To be used with instanceid. */
        contextlevel?: string | null;
        /** Context instance ID. To be used with level */
        instanceid?: number | null;
    };
    /** What other contexts to fetch the templates from. (children, parents, self) */
    includes?: string | null;
    /** If should list only visible templates */
    onlyvisible?: boolean | null;
}

export type CoreCompetencyListTemplatesReturns = Array<{
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

export type CoreCompetencyListTemplatesReturn = CoreCompetencyListTemplatesReturns;
export type core_competency_list_templates_returns = CoreCompetencyListTemplatesReturns;
