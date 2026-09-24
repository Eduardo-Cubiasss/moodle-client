/** Duplicate a competency framework. */
export interface CoreCompetencyDuplicateCompetencyFrameworkParams {
    /** Data base record id for the framework */
    id: number | null;
}

export interface CoreCompetencyDuplicateCompetencyFrameworkReturns {
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

export type CoreCompetencyDuplicateCompetencyFrameworkReturn = CoreCompetencyDuplicateCompetencyFrameworkReturns;
export type core_competency_duplicate_competency_framework_returns = CoreCompetencyDuplicateCompetencyFrameworkReturns;
