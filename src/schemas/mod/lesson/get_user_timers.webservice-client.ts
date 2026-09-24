/** Return the timers in the current lesson for the given user. */
export interface ModLessonGetUserTimersParams {
    /** lesson instance id */
    lessonid: number | null;
    /** the user id (empty for current user) */
    userid?: number | null;
}

export interface ModLessonGetUserTimersReturns {
    timers: Array<{
        /** The attempt id */
        id: number | null;
        /** The lesson id */
        lessonid: number | null;
        /** The user id */
        userid: number | null;
        /** First access time for a new timer session */
        starttime: number | null;
        /** Last access time to the lesson during the timer session */
        lessontime: number | null;
        /** If the lesson for this timer was completed */
        completed: number | null;
        /** Last modified time via webservices. */
        timemodifiedoffline: number | null;
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

export type ModLessonGetUserTimersReturn = ModLessonGetUserTimersReturns;
export type mod_lesson_get_user_timers_returns = ModLessonGetUserTimersReturns;
