/** Delete meta enrolment instances */
export interface EnrolMetaDeleteInstancesParams {
    /** List of course meta enrolment instances to delete. */
    instances?: Array<{
        /** ID of the course with meta enrolment. */
        metacourseid: number | null;
        /** ID of the course where meta enrolment is linked to. */
        courseid: string | null;
    }>;
}

/** List of course meta enrolment instances that were deleted. */
export type EnrolMetaDeleteInstancesReturns = Array<{
    /** ID of the course where meta enrolment is deleted. */
    metacourseid: number | null;
    /** ID of the course that was meta linked. */
    courseid: string | null;
    /** True on success, false if meta link did not exist. */
    status: boolean | null;
}>;

export type EnrolMetaDeleteInstancesReturn = EnrolMetaDeleteInstancesReturns;
export type enrol_meta_delete_instances_returns = EnrolMetaDeleteInstancesReturns;
