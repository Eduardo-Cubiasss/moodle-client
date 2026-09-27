/** Get the list of course enrolment methods */
export interface CoreEnrolGetCourseEnrolmentMethodsParams {
    /** Course id */
    courseid: number | null;
}

export type CoreEnrolGetCourseEnrolmentMethodsReturns = Array<{
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
    /** webservice function to get more information */
    wsfunction?: string | null;
}>;

export type CoreEnrolGetCourseEnrolmentMethodsReturn = CoreEnrolGetCourseEnrolmentMethodsReturns;
export type core_enrol_get_course_enrolment_methods_returns = CoreEnrolGetCourseEnrolmentMethodsReturns;
