/** Processes page responses. */
export interface ModLessonProcessPageParams {
    /** lesson instance id */
    lessonid: number | null;
    /** the page id */
    pageid: number | null;
    /** the data to be saved */
    data: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
    /** optional password (the lesson may be protected) */
    password?: string | null;
    /** if we want to review just after finishing (1 hour margin) */
    review?: boolean | null;
}

export interface ModLessonProcessPageReturns {
    /** New page id (if a jump was made). */
    newpageid: number | null;
    /** Whether the page processing redirect directly to anoter page. */
    inmediatejump: boolean | null;
    /** Whether there is not a default response. */
    nodefaultresponse: boolean | null;
    /** The response feedback. */
    feedback: string | null;
    /** Number of attempts remaining. */
    attemptsremaining: number | null;
    /** Whether the answer is correct. */
    correctanswer: boolean | null;
    /** Whether there aren't answers. */
    noanswer: boolean | null;
    /** Whether is a essay question. */
    isessayquestion: boolean | null;
    /** Whether we reachered the max number of attempts. */
    maxattemptsreached: boolean | null;
    /** The response. */
    response: string | null;
    /** The student answer. */
    studentanswer: string | null;
    /** The user response. */
    userresponse: string | null;
    /** Whether the user is reviewing. */
    reviewmode: boolean | null;
    /** The ongoing message. */
    ongoingscore: string | null;
    /** Progress percentage in the lesson. */
    progress: number | null;
    /** Whether we should display the menu or not in this page. */
    displaymenu: boolean | null;
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

export type ModLessonProcessPageReturn = ModLessonProcessPageReturns;
export type mod_lesson_process_page_returns = ModLessonProcessPageReturns;
