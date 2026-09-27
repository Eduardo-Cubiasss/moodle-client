/** Grade a competency from the user plan page. */
export interface CoreCompetencyGradeCompetencyInPlanParams {
    /** Plan id */
    planid: number | null;
    /** Competency id */
    competencyid: number | null;
    /** New grade */
    grade: number | null;
    /** A note to attach to the evidence */
    note?: string | null;
}

export interface CoreCompetencyGradeCompetencyInPlanReturns {
    /** usercompetencyid */
    usercompetencyid: number;
    /** contextid */
    contextid: number;
    /** action */
    action: number;
    /** actionuserid */
    actionuserid: number | null;
    /** descidentifier */
    descidentifier: string;
    /** desccomponent */
    desccomponent: string;
    /** desca */
    desca: string | null;
    /** url */
    url: string | null;
    /** grade */
    grade: number | null;
    /** note */
    note: string | null;
    /** id */
    id: number;
    /** timecreated */
    timecreated: number;
    /** timemodified */
    timemodified: number;
    /** usermodified */
    usermodified: number;
    actionuser?: {
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
    /** description */
    description: string;
    /** gradename */
    gradename: string;
    /** userdate */
    userdate: string;
    /** candelete */
    candelete: boolean;
}

export type CoreCompetencyGradeCompetencyInPlanReturn = CoreCompetencyGradeCompetencyInPlanReturns;
export type core_competency_grade_competency_in_plan_returns = CoreCompetencyGradeCompetencyInPlanReturns;
