/** Reset an autosave session */
export interface TinyAutosaveResetSessionParams {
    /** The context id that owns the editor */
    contextid: number | null;
    /** The page hash */
    pagehash: string | null;
    /** The page instance */
    pageinstance: string | null;
    /** The ID of the element */
    elementid: string | null;
}

export interface TinyAutosaveResetSessionReturns {}

export type TinyAutosaveResetSessionReturn = TinyAutosaveResetSessionReturns;
export type tiny_autosave_reset_session_returns = TinyAutosaveResetSessionReturns;
