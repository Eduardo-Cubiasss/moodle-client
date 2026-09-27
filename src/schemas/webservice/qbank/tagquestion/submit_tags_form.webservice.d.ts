/** Update the question tags. */
export interface QbankTagquestionSubmitTagsFormParams {
    /** The question id */
    questionid: number | null;
    /** The editing context id */
    contextid: number | null;
    /** The data from the tag form */
    formdata: string | null;
}

export interface QbankTagquestionSubmitTagsFormReturns {
    /** status: true if success */
    status: boolean | null;
}

export type QbankTagquestionSubmitTagsFormReturn = QbankTagquestionSubmitTagsFormReturns;
export type qbank_tagquestion_submit_tags_form_returns = QbankTagquestionSubmitTagsFormReturns;
