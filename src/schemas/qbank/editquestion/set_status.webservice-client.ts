/** Update the question status. */
export interface QbankEditquestionSetStatusParams {
    /** The question id */
    questionid: number | null;
    /** The updated question status */
    status: string | null;
}

export interface QbankEditquestionSetStatusReturns {
    /** status: true if success */
    status: boolean | null;
    /** statusname: name of the status */
    statusname: string | null;
    /** Error message if error exists */
    error: string | null;
}

export type QbankEditquestionSetStatusReturn = QbankEditquestionSetStatusReturns;
export type qbank_editquestion_set_status_returns = QbankEditquestionSetStatusReturns;
