/** Update the properties of slots in a quiz. All slots must belong to the same quiz. */
export interface ModQuizUpdateSlotsParams {
    /** The quiz to update slots for. */
    quizid: number | null;
    slots: Array<{
        /** id of the slot */
        id: number | null;
        /** If passed, new customised question number. Empty string to clear customisation. Null, or not specified, to leave unchanged. */
        displaynumber?: string | null;
        /** Whether to make this slot dependent on the previous one. Null, or not specified, to leave unchanged. */
        requireprevious?: boolean | null;
        /** Mark that this questions is out of. Null, or not specified, to leave unchanged. */
        maxmark?: number | null;
        /** For quizzes with multiple grades, which grade this slot contributes to (quiz_grade_id). 0 to set to nothing. Null, or not specified, to leave unchanged. */
        quizgradeitemid?: number | null;
    }>;
}

export type ModQuizUpdateSlotsReturns = unknown;

export type ModQuizUpdateSlotsReturn = ModQuizUpdateSlotsReturns;
export type mod_quiz_update_slots_returns = ModQuizUpdateSlotsReturns;
