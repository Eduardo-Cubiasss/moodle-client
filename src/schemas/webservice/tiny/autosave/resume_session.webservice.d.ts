/** Resume an autosave session */
export interface TinyAutosaveResumeSessionParams {
    /** The context id that owns the editor */
    contextid: number | null;
    /** The page hash */
    pagehash: string | null;
    /** The page instance */
    pageinstance: string | null;
    /** The ID of the element */
    elementid: string | null;
    /** The new draft item id to resume files to */
    draftid: number | null;
}

export interface TinyAutosaveResumeSessionReturns {
    /** The draft text */
    drafttext: string | null;
}

export type TinyAutosaveResumeSessionReturn = TinyAutosaveResumeSessionReturns;
export type tiny_autosave_resume_session_returns = TinyAutosaveResumeSessionReturns;
