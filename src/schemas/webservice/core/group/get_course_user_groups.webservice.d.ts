/** Returns all groups in specified course for the specified user. */
export interface CoreGroupGetCourseUserGroupsParams {
    /** Id of course (empty or 0 for all the courses where the user is enrolled). */
    courseid?: number | null;
    /** Id of user (empty or 0 for current user). */
    userid?: number | null;
    /** returns only groups in the specified grouping */
    groupingid?: number | null;
}

export interface CoreGroupGetCourseUserGroupsReturns {
    groups: Array<{
        /** group record id */
        id: number | null;
        /** group name */
        name: string | null;
        /** group description text */
        description: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat: number | null;
        /** id number */
        idnumber: string | null;
        /** course id */
        courseid?: number | null;
    }>;
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

export type CoreGroupGetCourseUserGroupsReturn = CoreGroupGetCourseUserGroupsReturns;
export type core_group_get_course_user_groups_returns = CoreGroupGetCourseUserGroupsReturns;
