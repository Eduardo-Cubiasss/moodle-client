/** Load a summary of a competency framework. */
export interface CoreCompetencyReadCompetencyFrameworkParams {
    /** Data base record id for the framework */
    id: number | null;
}

export interface CoreCompetencyReadCompetencyFrameworkReturns {
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
}

export type CoreCompetencyReadCompetencyFrameworkReturn = CoreCompetencyReadCompetencyFrameworkReturns;
export type core_competency_read_competency_framework_returns = CoreCompetencyReadCompetencyFrameworkReturns;
