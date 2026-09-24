/** Polls for the current percentage progress of a stored progress object */
export interface CoreOutputPollStoredProgressParams {
    ids: number | null[];
}

export type CoreOutputPollStoredProgressReturns = Array<{
    /** stored_progress record id */
    id: number | null;
    /** unique element id */
    uniqueid: string | null;
    /** percentage progress */
    progress: number | null;
    /** estimated time left string */
    estimated: string | null;
    /** message to be displayed with the bar */
    message: string | null;
    /** error */
    error?: string | null;
    /** timeout to use in the polling */
    timeout?: string | null;
}>;

export type CoreOutputPollStoredProgressReturn = CoreOutputPollStoredProgressReturns;
export type core_output_poll_stored_progress_returns = CoreOutputPollStoredProgressReturns;
