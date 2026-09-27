/** Get the feedback data for a grade item */
export interface CoreGradesGetFeedbackParams {
    /** Course ID */
    courseid: number | null;
    /** User ID */
    userid: number | null;
    /** Grade Item ID */
    itemid: number | null;
}

export interface CoreGradesGetFeedbackReturns {
    /** The full feedback text */
    feedbacktext: string | null;
    /** Title of the grade item that the feedback is for */
    title: string | null;
    /** Students name */
    fullname: string | null;
    /** Students picture */
    picture: string | null;
    /** Additional field for the user (email or ID number, for example) */
    additionalfield: string | null;
}

export type CoreGradesGetFeedbackReturn = CoreGradesGetFeedbackReturns;
export type core_grades_get_feedback_returns = CoreGradesGetFeedbackReturns;
