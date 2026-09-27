/** Get the gradeitem/(s) for a course */
export interface GradereportSingleviewGetGradeItemsForSearchWidgetParams {
    /** Course Id */
    courseid: number | null;
}

export interface GradereportSingleviewGetGradeItemsForSearchWidgetReturns {
    gradeitems: Array<{
        /** ID of the grade item */
        id?: number | null;
        /** The full name of the grade item */
        name?: string | null;
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

export type GradereportSingleviewGetGradeItemsForSearchWidgetReturn = GradereportSingleviewGetGradeItemsForSearchWidgetReturns;
export type gradereport_singleview_get_grade_items_for_search_widget_returns = GradereportSingleviewGetGradeItemsForSearchWidgetReturns;
