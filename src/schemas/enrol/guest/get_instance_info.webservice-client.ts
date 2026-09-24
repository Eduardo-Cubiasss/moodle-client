/** Return guest enrolment instance information. */
export interface EnrolGuestGetInstanceInfoParams {
    /** Instance id of guest enrolment plugin. */
    instanceid: number | null;
}

export interface EnrolGuestGetInstanceInfoReturns {
    instanceinfo: {
        /** Id of course enrolment instance */
        id: number | null;
        /** Id of course */
        courseid: number | null;
        /** Type of enrolment plugin */
        type: string | null;
        /** Name of enrolment plugin */
        name: string | null;
        /** Is the enrolment enabled? */
        status: boolean | null;
        /** Is a password required? */
        passwordrequired: boolean | null;
    };
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

export type EnrolGuestGetInstanceInfoReturn = EnrolGuestGetInstanceInfoReturns;
export type enrol_guest_get_instance_info_returns = EnrolGuestGetInstanceInfoReturns;
