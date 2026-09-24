export interface CoreGradesGetGroupsForSearchWidgetParams {
    /** Course Id */
    courseid: number | null;
    /** Course module Id */
    cmid?: number | null;
}

export interface CoreGradesGetGroupsForSearchWidgetReturns {
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

export type CoreGradesGetGroupsForSearchWidgetReturn = CoreGradesGetGroupsForSearchWidgetReturns;
export type core_grades_get_groups_for_search_widget_returns = CoreGradesGetGroupsForSearchWidgetReturns;
