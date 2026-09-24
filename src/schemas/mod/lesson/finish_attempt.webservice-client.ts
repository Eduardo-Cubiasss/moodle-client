/** Finishes the current attempt. */
export interface ModLessonFinishAttemptParams {
    /** Lesson instance id. */
    lessonid: number | null;
    /** Optional password (the lesson may be protected). */
    password?: string | null;
    /** If the user run out of time. */
    outoftime?: boolean | null;
    /** If we want to review just after finishing (1 hour margin). */
    review?: boolean | null;
}

export interface ModLessonFinishAttemptReturns {
    /** The EOL page information data. */
    data: Array<{
        /** Data name. */
        name: string | null;
        /** Data value. */
        value: string | null;
        /** Data message (translated string). */
        message: string | null;
    }>;
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

export type ModLessonFinishAttemptReturn = ModLessonFinishAttemptReturns;
export type mod_lesson_finish_attempt_returns = ModLessonFinishAttemptReturns;
