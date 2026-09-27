/** Validate a Safe Exam Browser config key or a browser exam key. */
export interface QuizaccessSebValidateQuizKeysParams {
    /** Course module ID */
    cmid: number;
    /** Page URL to check */
    url: string;
    /** SEB config key */
    configkey?: string | null;
    /** SEB browser exam key */
    browserexamkey?: string | null;
}

export interface QuizaccessSebValidateQuizKeysReturns {
    /** Is a provided config key valid? */
    configkey: boolean;
    /** Is a provided browser exam key valid? */
    browserexamkey: boolean;
}

export type QuizaccessSebValidateQuizKeysReturn = QuizaccessSebValidateQuizKeysReturns;
export type quizaccess_seb_validate_quiz_keys_returns = QuizaccessSebValidateQuizKeysReturns;
