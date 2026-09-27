/** Remove the specified tour */
export interface ToolUsertoursResetTourParams {
    /** Tour ID */
    tourid: number | null;
    /** Context ID */
    context: number | null;
    /** Current page location */
    pageurl: string | null;
}

export interface ToolUsertoursResetTourReturns {
    /** Tour ID */
    startTour?: number | null;
}

export type ToolUsertoursResetTourReturn = ToolUsertoursResetTourReturns;
export type tool_usertours_reset_tour_returns = ToolUsertoursResetTourReturns;
