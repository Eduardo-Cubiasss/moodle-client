/** Return access information for a given quiz. */
export interface ModQuizGetQuizAccessInformationParams {
    /** quiz instance id */
    quizid: number | null;
}

export interface ModQuizGetQuizAccessInformationReturns {
    /** Whether the user can do the quiz or not. */
    canattempt: boolean | null;
    /** Whether the user can edit the quiz settings or not. */
    canmanage: boolean | null;
    /** Whether the user can preview the quiz or not. */
    canpreview: boolean | null;
    /** Whether the users can review their previous attempts or not. */
    canreviewmyattempts: boolean | null;
    /** Whether the user can view the quiz reports or not. */
    canviewreports: boolean | null;
    /** list of rules */
    accessrules: string | null[];
    /** list of active rules */
    activerulenames: string | null[];
    /** list of reasons */
    preventaccessreasons: string | null[];
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type ModQuizGetQuizAccessInformationReturn = ModQuizGetQuizAccessInformationReturns;
export type mod_quiz_get_quiz_access_information_returns = ModQuizGetQuizAccessInformationReturns;
