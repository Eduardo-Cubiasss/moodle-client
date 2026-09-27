/** Change the editing mode */
export interface CoreChangeEditmodeParams {
    /** Set edit mode to */
    setmode: boolean | null;
    /** Page context id */
    context: number | null;
}

/** editmode */
export interface CoreChangeEditmodeReturns {
    /** The edit mode was changed */
    success: boolean | null;
}

export type CoreChangeEditmodeReturn = CoreChangeEditmodeReturns;
export type core_change_editmode_returns = CoreChangeEditmodeReturns;
