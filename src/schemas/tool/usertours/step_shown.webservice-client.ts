/** Mark the specified step as completed for the current user */
export interface ToolUsertoursStepShownParams {
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

export interface ToolUsertoursStepShownReturns {}

export type ToolUsertoursStepShownReturn = ToolUsertoursStepShownReturns;
export type tool_usertours_step_shown_returns = ToolUsertoursStepShownReturns;
