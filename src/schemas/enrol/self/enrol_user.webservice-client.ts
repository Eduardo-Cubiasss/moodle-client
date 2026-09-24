/** Self enrol the current user in the given course. */
export interface EnrolSelfEnrolUserParams {
    /** Id of the course */
    courseid: number | null;
    /** Enrolment key */
    password?: string | null;
    /** Instance id of self enrolment plugin. */
    instanceid?: number | null;
}

export interface EnrolSelfEnrolUserReturns {
    /** status: true if the user is enrolled, false otherwise */
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

export type EnrolSelfEnrolUserReturn = EnrolSelfEnrolUserReturns;
export type enrol_self_enrol_user_returns = EnrolSelfEnrolUserReturns;
