/** List the competencies in a plan */
export interface CoreCompetencyListPlanCompetenciesParams {
    /** The plan ID. */
    id: number | null;
}

export type CoreCompetencyListPlanCompetenciesReturns = Array<{
    competency: {
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
    };
    usercompetency?: {
        /** userid */
        userid: number;
        /** competencyid */
        competencyid: number;
        /** status */
        status: number;
        /** reviewerid */
        reviewerid: number | null;
        /** proficiency */
        proficiency: boolean | null;
        /** grade */
        grade: number | null;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
        /** canrequestreview */
        canrequestreview: boolean;
        /** canreview */
        canreview: boolean;
        /** gradename */
        gradename: string;
        /** isrequestreviewallowed */
        isrequestreviewallowed: boolean;
        /** iscancelreviewrequestallowed */
        iscancelreviewrequestallowed: boolean;
        /** isstartreviewallowed */
        isstartreviewallowed: boolean;
        /** isstopreviewallowed */
        isstopreviewallowed: boolean;
        /** isstatusidle */
        isstatusidle: boolean;
        /** isstatusinreview */
        isstatusinreview: boolean;
        /** isstatuswaitingforreview */
        isstatuswaitingforreview: boolean;
        /** proficiencyname */
        proficiencyname: string;
        reviewer?: {
            /** id */
            id: number;
            /** email */
            email: string;
            /** idnumber */
            idnumber: string;
            /** phone1 */
            phone1: string;
            /** phone2 */
            phone2: string;
            /** department */
            department: string;
            /** institution */
            institution: string;
            /** fullname */
            fullname: string;
            /** identity */
            identity: string;
            /** profileurl */
            profileurl: string;
            /** profileimageurl */
            profileimageurl: string;
            /** profileimageurlsmall */
            profileimageurlsmall: string;
        };
        /** statusname */
        statusname: string;
        /** url */
        url: string;
    };
    usercompetencyplan?: {
        /** userid */
        userid: number;
        /** competencyid */
        competencyid: number;
        /** proficiency */
        proficiency: boolean | null;
        /** grade */
        grade: number | null;
        /** planid */
        planid: number;
        /** sortorder */
        sortorder: number;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
        /** gradename */
        gradename: string;
        /** proficiencyname */
        proficiencyname: string;
    };
}>;

export type CoreCompetencyListPlanCompetenciesReturn = CoreCompetencyListPlanCompetenciesReturns;
export type core_competency_list_plan_competencies_returns = CoreCompetencyListPlanCompetenciesReturns;
