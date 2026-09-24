/** Gets a list of groups that the user is allowed to access within the specified activity. */
export interface CoreGroupGetActivityAllowedGroupsParams {
    /** course module id */
    cmid: number | null;
    /** id of user, empty for current user */
    userid?: number | null;
}

export interface CoreGroupGetActivityAllowedGroupsReturns {
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
    /** Whether the user will be able to access all the activity groups. */
    canaccessallgroups?: boolean | null;
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

export type CoreGroupGetActivityAllowedGroupsReturn = CoreGroupGetActivityAllowedGroupsReturns;
export type core_group_get_activity_allowed_groups_returns = CoreGroupGetActivityAllowedGroupsReturns;
