/** For each course and capability specified, return a list of the users that are enrolled in the course and have that capability */
export interface CoreEnrolGetEnrolledUsersWithCapabilityParams {
    /** course id and associated capability name */
    coursecapabilities: Array<{
        /** Course ID number in the Moodle course table */
        courseid: number | null;
        capabilities: string | null[];
    }>;
    /** Option names: * groupid (integer) return only users in this group id. Requires 'moodle/site:accessallgroups' . * onlyactive (integer) only users with active enrolments. Requires 'moodle/course:enrolreview' . * userfields ('string, string, ...') return only the values of these user fields. * limitfrom (integer) sql limit from. * limitnumber (integer) max number of users per course and capability. */
    options?: Array<{
        /** option name */
        name: string | null;
        /** option value */
        value: string | null;
    }>;
}

export type CoreEnrolGetEnrolledUsersWithCapabilityReturns = Array<{
    /** Course ID number in the Moodle course table */
    courseid: number | null;
    /** Capability name */
    capability: string | null;
    /** List of users that are enrolled in the course and have the specified capability */
    users: Array<{
        /** ID of the user */
        id: number | null;
        /** Username */
        username?: string | null;
        /** The first name(s) of the user */
        firstname?: string | null;
        /** The family name of the user */
        lastname?: string | null;
        /** The fullname of the user */
        fullname: string | null;
        /** Email address */
        email?: string | null;
        /** Postal address */
        address?: string | null;
        /** Phone 1 */
        phone1?: string | null;
        /** Phone 2 */
        phone2?: string | null;
        /** department */
        department?: string | null;
        /** institution */
        institution?: string | null;
        /** user interests (separated by commas) */
        interests?: string | null;
        /** first access to the site (0 if never) */
        firstaccess?: number | null;
        /** last access to the site (0 if never) */
        lastaccess?: number | null;
        /** last access to the course (0 if never) */
        lastcourseaccess?: number | null;
        /** User profile description */
        description?: string | null;
        /** User profile description format */
        descriptionformat?: number | null;
        /** Home city of the user */
        city?: string | null;
        /** Country code of the user, such as AU or CZ */
        country?: string | null;
        /** User image profile URL - small */
        profileimageurlsmall?: string | null;
        /** User image profile URL - big */
        profileimageurl?: string | null;
        /** User custom fields (also known as user profil fields) */
        customfields?: Array<{
            /** The type of the custom field */
            type: string | null;
            /** The value of the custom field */
            value: string | null;
            /** The name of the custom field */
            name: string | null;
            /** The shortname of the custom field */
            shortname: string | null;
        }>;
        /** user groups */
        groups?: Array<{
            /** group id */
            id: number | null;
            /** group name */
            name: string | null;
            /** group description */
            description: string | null;
        }>;
        /** user roles */
        roles?: Array<{
            /** role id */
            roleid: number | null;
            /** role name */
            name: string | null;
            /** role shortname */
            shortname: string | null;
            /** role sortorder */
            sortorder: number | null;
        }>;
        /** User preferences */
        preferences?: Array<{
            /** The name of the preferences */
            name: string | null;
            /** The value of the custom field */
            value: string | null;
        }>;
        /** Courses where the user is enrolled - limited by which courses the user is able to see */
        enrolledcourses?: Array<{
            /** Id of the course */
            id: number | null;
            /** Fullname of the course */
            fullname: string | null;
            /** Shortname of the course */
            shortname: string | null;
        }>;
    }>;
}>;

export type CoreEnrolGetEnrolledUsersWithCapabilityReturn = CoreEnrolGetEnrolledUsersWithCapabilityReturns;
export type core_enrol_get_enrolled_users_with_capability_returns = CoreEnrolGetEnrolledUsersWithCapabilityReturns;
