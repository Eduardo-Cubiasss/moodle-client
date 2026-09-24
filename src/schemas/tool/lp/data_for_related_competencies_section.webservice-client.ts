/** Load the data for the related competencies template. */
export interface ToolLpDataForRelatedCompetenciesSectionParams {
    /** The competency id */
    competencyid: number | null;
}

export interface ToolLpDataForRelatedCompetenciesSectionReturns {
    relatedcompetencies: Array<{
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
    /** Whether to show the delete relation link or not */
    showdeleterelatedaction: boolean | null;
}

export type ToolLpDataForRelatedCompetenciesSectionReturn = ToolLpDataForRelatedCompetenciesSectionReturns;
export type tool_lp_data_for_related_competencies_section_returns = ToolLpDataForRelatedCompetenciesSectionReturns;
