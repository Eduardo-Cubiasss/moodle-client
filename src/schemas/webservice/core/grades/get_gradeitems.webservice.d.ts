/** Get the gradeitems for a course */
export interface CoreGradesGetGradeitemsParams {
    /** Course ID */
    courseid: number | null;
}

export interface CoreGradesGetGradeitemsReturns {
    gradeItems: Array<{
        /** An ID for the grade item */
        id: string | null;
        /** The full name of the grade item */
        itemname: string | null;
        /** The grade category of the grade item */
        category?: string | null;
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

export type CoreGradesGetGradeitemsReturn = CoreGradesGetGradeitemsReturns;
export type core_grades_get_gradeitems_returns = CoreGradesGetGradeitemsReturns;
