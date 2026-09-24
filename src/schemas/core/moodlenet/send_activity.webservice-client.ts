/** Send activity to MoodleNet */
export interface CoreMoodlenetSendActivityParams {
    /** OAuth 2 issuer ID */
    issuerid: number | null;
    /** Course module ID */
    cmid: number | null;
    /** Share format */
    shareformat: number | null;
}

export interface CoreMoodlenetSendActivityReturns {
    /** Status: true if success */
    status: boolean | null;
    /** Resource URL from MoodleNet */
    resourceurl: string | null;
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type CoreMoodlenetSendActivityReturn = CoreMoodlenetSendActivityReturns;
export type core_moodlenet_send_activity_returns = CoreMoodlenetSendActivityReturns;
