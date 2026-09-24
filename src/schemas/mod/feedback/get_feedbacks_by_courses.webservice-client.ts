/** Returns a list of feedbacks in a provided list of courses, if no list is provided all feedbacks that the user can view will be returned. */
export interface ModFeedbackGetFeedbacksByCoursesParams {
    /** Array of course ids */
    courseids?: number | null[];
}

export interface ModFeedbackGetFeedbacksByCoursesReturns {
    feedbacks: Array<{
        /** The primary key of the record. */
        id: number;
        /** Course id this feedback is part of. */
        course: number;
        /** Feedback name. */
        name: string;
        /** Feedback introduction text. */
        intro: string;
        /** intro format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        introformat?: number | null;
        /** Forced activity language */
        lang: string | null;
        /** Whether the feedback is anonymous. */
        anonymous: number;
        /** Whether email notifications will be sent to teachers. */
        email_notification?: boolean;
        /** Whether multiple submissions are allowed. */
        multiple_submit: boolean;
        /** Whether questions should be auto-numbered. */
        autonumbering: boolean;
        /** Link to next page after submission. */
        site_after_submit?: string;
        /** Text to display after submission. */
        page_after_submit?: string;
        /** page_after_submit format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        page_after_submitformat?: number | null;
        /** Whether stats should be published. */
        publish_stats: boolean;
        /** Allow answers from this time. */
        timeopen?: number;
        /** Allow answers until this time. */
        timeclose?: number;
        /** The time this record was modified. */
        timemodified?: number;
        /** If this field is set to 1, then the activity will be automatically marked as complete on submission. */
        completionsubmit: boolean;
        /** coursemodule */
        coursemodule: number;
        /** introfiles */
        introfiles: Array<{
            /** File name. */
            filename?: string;
            /** File path. */
            filepath?: string;
            /** File size. */
            filesize?: number;
            /** Downloadable file url. */
            fileurl?: string;
            /** Time modified. */
            timemodified?: number;
            /** File mime type. */
            mimetype?: string;
            /** Whether is an external file. */
            isexternalfile?: boolean;
            /** The repository type for the external files. */
            repositorytype?: string | null;
            /** Relative path to the relevant file type icon based on the file's mime type. */
            icon?: string | null;
        }>;
        /** pageaftersubmitfiles */
        pageaftersubmitfiles?: Array<{
            /** File name. */
            filename?: string;
            /** File path. */
            filepath?: string;
            /** File size. */
            filesize?: number;
            /** Downloadable file url. */
            fileurl?: string;
            /** Time modified. */
            timemodified?: number;
            /** File mime type. */
            mimetype?: string;
            /** Whether is an external file. */
            isexternalfile?: boolean;
            /** The repository type for the external files. */
            repositorytype?: string | null;
            /** Relative path to the relevant file type icon based on the file's mime type. */
            icon?: string | null;
        }>;
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

export type ModFeedbackGetFeedbacksByCoursesReturn = ModFeedbackGetFeedbacksByCoursesReturns;
export type mod_feedback_get_feedbacks_by_courses_returns = ModFeedbackGetFeedbacksByCoursesReturns;
