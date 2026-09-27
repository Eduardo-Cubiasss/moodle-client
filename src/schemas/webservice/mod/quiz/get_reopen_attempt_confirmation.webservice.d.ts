/** Verify it is OK to re-open a given quiz attempt, and if so, return a suitable confirmation message. */
export interface ModQuizGetReopenAttemptConfirmationParams {
    /** The id of the attempt to reopen */
    attemptid: number | null;
}

/** Confirmation to show the user before the attempt is reopened. */
export type ModQuizGetReopenAttemptConfirmationReturns = string | null;

export type ModQuizGetReopenAttemptConfirmationReturn = ModQuizGetReopenAttemptConfirmationReturns;
export type mod_quiz_get_reopen_attempt_confirmation_returns = ModQuizGetReopenAttemptConfirmationReturns;
