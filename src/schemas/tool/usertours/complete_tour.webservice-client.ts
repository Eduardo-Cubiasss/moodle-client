/** Mark the specified tour as completed for the current user */
export interface ToolUsertoursCompleteTourParams {
    /** Tour ID */
    tourid: number | null;
    /** Context ID */
    context: number | null;
    /** Page URL */
    pageurl: string | null;
    /** Step ID */
    stepid: number | null;
    /** Step Number */
    stepindex: number | null;
}

export interface ToolUsertoursCompleteTourReturns {}

export type ToolUsertoursCompleteTourReturn = ToolUsertoursCompleteTourReturns;
export type tool_usertours_complete_tour_returns = ToolUsertoursCompleteTourReturns;
