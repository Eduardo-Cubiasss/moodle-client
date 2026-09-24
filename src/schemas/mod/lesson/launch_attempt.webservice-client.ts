/** Starts a new attempt or continues an existing one. */
export interface ModLessonLaunchAttemptParams {
    /** lesson instance id */
    lessonid: number | null;
    /** optional password (the lesson may be protected) */
    password?: string | null;
    /** page id to continue from (only when continuing an attempt) */
    pageid?: number | null;
    /** if we want to review just after finishing */
    review?: boolean | null;
}

export interface ModLessonLaunchAttemptReturns {
    messages: Array<{
        /** Message. */
        message: string | null;
        /** Message type: usually a CSS identifier like: success, info, warning, error, notifyproblem, notifyerror, notifytiny, notifysuccess */
        type: string | null;
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

export type ModLessonLaunchAttemptReturn = ModLessonLaunchAttemptReturns;
export type mod_lesson_launch_attempt_returns = ModLessonLaunchAttemptReturns;
