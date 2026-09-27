/** Manual unenrol users */
export interface EnrolManualUnenrolUsersParams {
    enrolments: Array<{
        /** The user that is going to be unenrolled */
        userid: number | null;
        /** The course to unenrol the user from */
        courseid: number | null;
        /** The user role */
        roleid?: number | null;
    }>;
}

export type EnrolManualUnenrolUsersReturns = unknown;

export type EnrolManualUnenrolUsersReturn = EnrolManualUnenrolUsersReturns;
export type enrol_manual_unenrol_users_returns = EnrolManualUnenrolUsersReturns;
