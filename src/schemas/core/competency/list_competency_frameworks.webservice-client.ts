/** Load a list of a competency frameworks. */
export interface CoreCompetencyListCompetencyFrameworksParams {
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
    /** What other contextes to fetch the frameworks from. (children, parents, self) */
    includes?: string | null;
    /** Only visible frameworks will be returned if visible true */
    onlyvisible?: boolean | null;
    /** A query string to filter the results */
    query?: string | null;
}

export type CoreCompetencyListCompetencyFrameworksReturns = Array<{
    /** shortname */
    shortname: string;
    /** idnumber */
    idnumber: string;
    /** description */
    description: string;
    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
    descriptionformat?: number | null;
    /** visible */
    visible: boolean;
    /** scaleid */
    scaleid: number;
    /** scaleconfiguration */
    scaleconfiguration: string;
    /** contextid */
    contextid: number;
    /** taxonomies */
    taxonomies: string;
    /** id */
    id: number;
    /** timecreated */
    timecreated: number;
    /** timemodified */
    timemodified: number;
    /** usermodified */
    usermodified: number;
    /** canmanage */
    canmanage: boolean;
    /** competenciescount */
    competenciescount: number;
    /** contextname */
    contextname: string;
    /** contextnamenoprefix */
    contextnamenoprefix: string;
}>;

export type CoreCompetencyListCompetencyFrameworksReturn = CoreCompetencyListCompetencyFrameworksReturns;
export type core_competency_list_competency_frameworks_returns = CoreCompetencyListCompetencyFrameworksReturns;
