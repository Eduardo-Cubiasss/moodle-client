/** Get the group/(s) for a course */
export interface CoreGroupGetGroupsForSelectorParams {
    /** Course Id */
    courseid: number | null;
    /** Course module Id */
    cmid?: number | null;
}

export interface CoreGroupGetGroupsForSelectorReturns {
    groups: Array<{
        /** An ID for the group */
        id: string | null;
        /** The full name of the group */
        name: string | null;
        /** Group image URL */
        groupimageurl?: string | null;
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

export type CoreGroupGetGroupsForSelectorReturn = CoreGroupGetGroupsForSelectorReturns;
export type core_group_get_groups_for_selector_returns = CoreGroupGetGroupsForSelectorReturns;
