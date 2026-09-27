/** Get the feedback text that should be show to a student who got the given grade in the given quiz. */
export interface ModQuizGetQuizFeedbackForGradeParams {
    /** quiz instance id */
    quizid: number | null;
    /** the grade to check */
    grade: number | null;
}

export interface ModQuizGetQuizFeedbackForGradeReturns {
    /** the comment that corresponds to this grade (empty for none) */
    feedbacktext: string | null;
    /** feedbacktext format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
    feedbacktextformat?: number | null;
    /** feedback inline files */
    feedbackinlinefiles?: Array<{
        /** File name. */
        filename?: string | null;
        /** File path. */
        filepath?: string | null;
        /** File size. */
        filesize?: number | null;
        /** Downloadable file url. */
        fileurl?: string | null;
        /** Time modified. */
        timemodified?: number | null;
        /** File mime type. */
        mimetype?: string | null;
        /** Whether is an external file. */
        isexternalfile?: boolean | null;
        /** The repository type for external files. */
        repositorytype?: string | null;
        /** The relative path to the relevant file type icon based on the file's mime type. */
        icon?: string | null;
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

export type ModQuizGetQuizFeedbackForGradeReturn = ModQuizGetQuizFeedbackForGradeReturns;
export type mod_quiz_get_quiz_feedback_for_grade_returns = ModQuizGetQuizFeedbackForGradeReturns;
