/** Return a list of attempts for the given quiz and user. */
export interface ModQuizGetUserAttemptsParams {
    /** quiz instance id */
    quizid: number | null;
    /** user id, empty for current user */
    userid?: number | null;
    /** quiz status: all, finished or unfinished */
    status?: string | null;
    /** whether to include previews or not */
    includepreviews?: boolean | null;
}

export interface ModQuizGetUserAttemptsReturns {
    attempts: Array<{
        /** Attempt id. */
        id?: number | null;
        /** Foreign key reference to the quiz that was attempted. */
        quiz?: number | null;
        /** Foreign key reference to the user whose attempt this is. */
        userid?: number | null;
        /** Sequentially numbers this students attempts at this quiz. */
        attempt?: number | null;
        /** Foreign key reference to the question_usage that holds the details of the the question_attempts that make up this quiz attempt. */
        uniqueid?: number | null;
        /** Attempt layout. */
        layout?: string | null;
        /** Attempt current page. */
        currentpage?: number | null;
        /** Whether is a preview attempt or not. */
        preview?: number | null;
        /** The current state of the attempts. 'inprogress', 'overdue', 'finished' or 'abandoned'. */
        state?: string | null;
        /** Time when the attempt was started. */
        timestart?: number | null;
        /** Time when the attempt was submitted. 0 if the attempt has not been submitted yet. */
        timefinish?: number | null;
        /** Last modified time. */
        timemodified?: number | null;
        /** Last modified time via webservices. */
        timemodifiedoffline?: number | null;
        /** Next time quiz cron should check attempt for state changes. NULL means never check. */
        timecheckstate?: number | null;
        /** Total marks for this attempt. */
        sumgrades?: number | null;
        /** If the quiz has additional grades set up, the mark for each grade for this attempt. */
        gradeitemmarks?: Array<{
            /** The name of this grade item. */
            name: string | null;
            /** The grade this attempt earned for this item. */
            grade: number | null;
            /** The total this grade is out of. */
            maxgrade: number | null;
        }>;
        /** Time when the student was notified that manual grading of their attempt was complete. */
        gradednotificationsenttime?: number | null;
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

export type ModQuizGetUserAttemptsReturn = ModQuizGetUserAttemptsReturns;
export type mod_quiz_get_user_attempts_returns = ModQuizGetUserAttemptsReturns;
