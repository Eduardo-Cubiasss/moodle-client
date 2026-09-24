/** Fetch the specified tour */
export interface ToolUsertoursFetchAndStartTourParams {
    /** Tour ID */
    tourid: number | null;
    /** Context ID */
    context: number | null;
    /** Page URL */
    pageurl: string | null;
}

export interface ToolUsertoursFetchAndStartTourReturns {
    /** Tour config */
    tourconfig?: {
        /** Tour Name */
        name: string | null;
        steps: Array<{
            /** Step Title */
            title: string | null;
            /** Step Content */
            content: string | null;
            /** Step Target */
            element: string | null;
            /** Step Placement */
            placement: string | null;
            /** Delay before showing the step (ms) */
            delay?: number | null;
            /** Whether a backdrop should be used */
            backdrop?: boolean | null;
            /** Whether to move to the next step when the target element is clicked */
            reflex?: boolean | null;
            /** Whether to display the step even if it could not be found */
            orphan?: boolean | null;
            /** The actual ID of the step */
            stepid?: number | null;
        }>;
        /** Label of the end tour button */
        endtourlabel: string | null;
        /** display step number */
        displaystepnumbers: boolean | null;
    };
}

export type ToolUsertoursFetchAndStartTourReturn = ToolUsertoursFetchAndStartTourReturns;
export type tool_usertours_fetch_and_start_tour_returns = ToolUsertoursFetchAndStartTourReturns;
