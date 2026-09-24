/** Check a user has authorized for a given MoodleNet site */
export interface CoreMoodlenetAuthCheckParams {
    /** OAuth 2 issuer ID */
    issuerid: number | null;
    /** Course ID */
    courseid: number | null;
}

export interface CoreMoodlenetAuthCheckReturns {
    /** Login url */
    loginurl: string | null;
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

export type CoreMoodlenetAuthCheckReturn = CoreMoodlenetAuthCheckReturns;
export type core_moodlenet_auth_check_returns = CoreMoodlenetAuthCheckReturns;
