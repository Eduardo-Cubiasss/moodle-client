/** Updates existing groups. */
export interface CoreGroupUpdateGroupsParams {
    /** List of group objects. A group is found by the id, then all other details provided will be updated. */
    groups: Array<{
        /** ID of the group */
        id: number | null;
        /** multilang compatible name, course unique */
        name: string | null;
        /** group description text */
        description?: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** group enrol secret phrase */
        enrolmentkey?: string | null;
        /** id number */
        idnumber?: string | null;
        /** group visibility mode. 0 = Visible to all. 1 = Visible to members. 2 = See own membership. 3 = Membership is hidden. */
        visibility?: string | null;
        /** activity participation enabled? Only for "all" and "members" visibility */
        participation?: boolean | null;
        /** Custom fields */
        customfields?: Array<{
            /** The shortname of the custom field */
            shortname: string | null;
            /** The value of the custom field */
            value: string | null;
        }>;
    }>;
}

export type CoreGroupUpdateGroupsReturns = unknown;

export type CoreGroupUpdateGroupsReturn = CoreGroupUpdateGroupsReturns;
export type core_group_update_groups_returns = CoreGroupUpdateGroupsReturns;
