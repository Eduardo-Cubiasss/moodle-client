/** Return access information for a given lesson. */
export interface ModLessonGetLessonAccessInformationParams {
    /** lesson instance id */
    lessonid: number | null;
}

export interface ModLessonGetLessonAccessInformationReturns {
    /** Whether the user can manage the lesson or not. */
    canmanage: boolean | null;
    /** Whether the user can grade the lesson or not. */
    cangrade: boolean | null;
    /** Whether the user can view the lesson reports or not. */
    canviewreports: boolean | null;
    /** Whether the lesson is in review mode for the current user. */
    reviewmode: boolean | null;
    /** The number of attempts done by the user. */
    attemptscount: number | null;
    /** The last page seen id. */
    lastpageseen: number | null;
    /** Whether the user left during a timed session. */
    leftduringtimedsession: boolean | null;
    /** The lesson first page id. */
    firstpageid: number | null;
    preventaccessreasons: Array<{
        /** Reason lang string code */
        reason: string | null;
        /** Additional data */
        data: string | null;
        /** Complete html message */
        message: string | null;
    }>;
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

export type ModLessonGetLessonAccessInformationReturn = ModLessonGetLessonAccessInformationReturns;
export type mod_lesson_get_lesson_access_information_returns = ModLessonGetLessonAccessInformationReturns;
