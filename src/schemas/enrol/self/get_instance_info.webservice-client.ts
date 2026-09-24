/** self enrolment instance information. */
export interface EnrolSelfGetInstanceInfoParams {
    /** instance id of self enrolment plugin. */
    instanceid: number | null;
}

export interface EnrolSelfGetInstanceInfoReturns {
    /** id of course enrolment instance */
    id: number | null;
    /** id of course */
    courseid: number | null;
    /** type of enrolment plugin */
    type: string | null;
    /** name of enrolment plugin */
    name: string | null;
    /** status of enrolment plugin */
    status: string | null;
    /** password required for enrolment */
    enrolpassword?: string | null;
}

export type EnrolSelfGetInstanceInfoReturn = EnrolSelfGetInstanceInfoReturns;
export type enrol_self_get_instance_info_returns = EnrolSelfGetInstanceInfoReturns;
