/** Starts a new attempt at a quiz. */
export interface ModQuizStartAttemptParams {
    /** quiz instance id */
    quizid: number | null;
    /** Preflight required data (like passwords) */
    preflightdata?: Array<{
        /** data name */
        name: string | null;
        /** data value */
        value: string | null;
    }>;
    /** Whether to force a new attempt or not. */
    forcenew?: boolean | null;
}

export interface ModQuizStartAttemptReturns {
    attempt: {
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
    };
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

export type ModQuizStartAttemptReturn = ModQuizStartAttemptReturns;
export type mod_quiz_start_attempt_returns = ModQuizStartAttemptReturns;
