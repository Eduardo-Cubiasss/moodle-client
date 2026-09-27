/** Get enrolled users by course id. */
export interface CoreEnrolGetEnrolledUsersParams {
    /** course id */
    courseid: number | null;
    /** Option names: * withcapability (string) return only users with this capability. This option requires 'moodle/role:review' on the course context. * groupid (integer) return only users in this group id. If the course has groups enabled and this param isn't defined, returns all the viewable users. This option requires 'moodle/site:accessallgroups' on the course context if the user doesn't belong to the group. * onlyactive (integer) return only users with active enrolments and matching time restrictions. This option requires 'moodle/course:enrolreview' on the course context. Please note that this option can't be used together with onlysuspended (only one can be active). * onlysuspended (integer) return only suspended users. This option requires 'moodle/course:enrolreview' on the course context. Please note that this option can't be used together with onlyactive (only one can be active). * userfields ('string, string, ...') return only the values of these user fields. * limitfrom (integer) sql limit from. * limitnumber (integer) maximum number of returned users. * sortby (string) sort by id, firstname or lastname. For ordering like the site does, use siteorder. * sortdirection (string) ASC or DESC */
    options?: Array<{
        /** option name */
        name: string | null;
        /** option value */
        value: string | null;
    }>;
}

export type CoreEnrolGetEnrolledUsersReturns = Array<{
    /** ID of the user */
    id: number | null;
    /** Username policy is defined in Moodle security config */
    username?: string | null;
    /** The first name(s) of the user */
    firstname?: string | null;
    /** The family name of the user */
    lastname?: string | null;
    /** The fullname of the user */
    fullname: string | null;
    /** An email address - allow email as root@localhost */
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
    /** An arbitrary ID code number perhaps from the institution */
    idnumber?: string | null;
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
    /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
    descriptionformat?: number | null;
    /** Home city of the user */
    city?: string | null;
    /** Home country code of the user, such as AU or CZ */
    country?: string | null;
    /** User image profile URL - small version */
    profileimageurlsmall?: string | null;
    /** User image profile URL - big version */
    profileimageurl?: string | null;
    /** User custom fields (also known as user profil fields) */
    customfields?: Array<{
        /** The type of the custom field - text field, checkbox... */
        type: string | null;
        /** The value of the custom field */
        value: string | null;
        /** The name of the custom field */
        name: string | null;
        /** The shortname of the custom field - to be able to build the field class in the code */
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
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat: number | null;
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

export type CoreEnrolGetEnrolledUsersReturn = CoreEnrolGetEnrolledUsersReturns;
export type core_enrol_get_enrolled_users_returns = CoreEnrolGetEnrolledUsersReturns;
