/** Verify if the passed information resolves into a WebFinger profile URL */
export interface ToolMoodlenetVerifyWebfingerParams {
    /** The profile url that the user has given us */
    profileurl: string | null;
    /** The course we are adding to */
    course: number | null;
    /** The section within the course we are adding to */
    section: number | null;
}

export interface ToolMoodlenetVerifyWebfingerReturns {
    /** Was the passed content a valid WebFinger? */
    result: boolean | null;
    /** Our message for the user */
    message: string | null;
    /** Domain to redirect the user to */
    domain?: string | null;
}

export type ToolMoodlenetVerifyWebfingerReturn = ToolMoodlenetVerifyWebfingerReturns;
export type tool_moodlenet_verify_webfinger_returns = ToolMoodlenetVerifyWebfingerReturns;
