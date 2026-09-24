/** Return the list of pages in a lesson (based on the user permissions). */
export interface ModLessonGetPagesParams {
    /** lesson instance id */
    lessonid: number | null;
    /** optional password (the lesson may be protected) */
    password?: string | null;
}

export interface ModLessonGetPagesReturns {
    pages: Array<{
        /** Page fields */
        page: {
            /** The id of this lesson page */
            id: number | null;
            /** The id of the lesson this page belongs to */
            lessonid: number | null;
            /** The id of the page before this one */
            prevpageid: number | null;
            /** The id of the next page in the page sequence */
            nextpageid: number | null;
            /** Identifies the page type of this page */
            qtype: number | null;
            /** Used to record page type specific options */
            qoption: number | null;
            /** Used to record page specific layout selections */
            layout: number | null;
            /** Used to record page specific display selections */
            display: number | null;
            /** Timestamp for when the page was created */
            timecreated: number | null;
            /** Timestamp for when the page was last modified */
            timemodified: number | null;
            /** The title of this page */
            title?: string | null;
            /** The contents of this page */
            contents?: string | null;
            /** contents format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
            contentsformat?: number | null;
            /** Toggles display in the left menu block */
            displayinmenublock: boolean | null;
            /** The type of the page [question | structure] */
            type: number | null;
            /** The unique identifier for the page type */
            typeid: number | null;
            /** The string that describes this page type */
            typestring: string | null;
        };
        /** List of answers ids (empty for content pages in Moodle 1.9) */
        answerids: number | null[];
        /** List of possible page jumps */
        jumps: number | null[];
        /** The total number of files attached to the page */
        filescount: number | null;
        /** The total size of the files */
        filessizetotal: number | null;
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

export type ModLessonGetPagesReturn = ModLessonGetPagesReturns;
export type mod_lesson_get_pages_returns = ModLessonGetPagesReturns;
