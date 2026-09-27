/** Get information about an activity being shared */
export interface CoreMoodlenetGetShareInfoActivityParams {
    /** The cmid of the activity */
    cmid: number | null;
}

export interface CoreMoodlenetGetShareInfoActivityReturns {
    /** Activity name */
    name: string | null;
    /** Activity type */
    type: string | null;
    /** MoodleNet server */
    server: string | null;
    /** Support page URL */
    supportpageurl: string | null;
    /** MoodleNet issuer id */
    issuerid: number | null;
    /** status: true if success */
    status: boolean | null;
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

export type CoreMoodlenetGetShareInfoActivityReturn = CoreMoodlenetGetShareInfoActivityReturns;
export type core_moodlenet_get_share_info_activity_returns = CoreMoodlenetGetShareInfoActivityReturns;
