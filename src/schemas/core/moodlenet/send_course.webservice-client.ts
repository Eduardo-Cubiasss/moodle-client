/** Send course to MoodleNet */
export interface CoreMoodlenetSendCourseParams {
    /** OAuth 2 issuer ID */
    issuerid: number | null;
    /** Course ID */
    courseid: number | null;
    /** Share format */
    shareformat: number | null;
    /** List for course module ids */
    cmids?: number | null[];
}

export interface CoreMoodlenetSendCourseReturns {
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

export type CoreMoodlenetSendCourseReturn = CoreMoodlenetSendCourseReturns;
export type core_moodlenet_send_course_returns = CoreMoodlenetSendCourseReturns;
