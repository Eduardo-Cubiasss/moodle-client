/** Returns the complete list of grade items for users in a course */
export interface GradereportUserGetGradeItemsParams {
    /** Course Id */
    courseid: number | null;
    /** Return grades only for this user (optional) */
    userid?: number | null;
    /** Get users from this group only */
    groupid?: number | null;
}

export interface GradereportUserGetGradeItemsReturns {
    usergrades: Array<{
        /** course id */
        courseid: number | null;
        /** course idnumber */
        courseidnumber: string | null;
        /** user id */
        userid: number | null;
        /** user fullname */
        userfullname: string | null;
        /** user idnumber */
        useridnumber: string | null;
        /** table max depth (needed for printing it) */
        maxdepth: number | null;
        gradeitems: Array<{
            /** Grade item id */
            id: number | null;
            /** Grade item name */
            itemname: string | null;
            /** Grade item type */
            itemtype: string | null;
            /** Grade item module */
            itemmodule: string | null;
            /** Grade item instance */
            iteminstance: number | null;
            /** Grade item item number */
            itemnumber: number | null;
            /** Grade item idnumber */
            idnumber: string | null;
            /** Grade item category id */
            categoryid: number | null;
            /** Outcome id */
            outcomeid: number | null;
            /** Scale id */
            scaleid: number | null;
            /** Grade item for user locked? */
            locked?: boolean | null;
            /** Course module id (if type mod) */
            cmid?: number | null;
            /** Weight raw */
            weightraw?: number | null;
            /** Weight */
            weightformatted?: string | null;
            /** Status */
            status?: string | null;
            /** Grade raw */
            graderaw?: number | null;
            /** Grade submit date */
            gradedatesubmitted?: number | null;
            /** Grade graded date */
            gradedategraded?: number | null;
            /** Grade hidden by date? */
            gradehiddenbydate?: boolean | null;
            /** Grade needs update? */
            gradeneedsupdate?: boolean | null;
            /** Grade is hidden? */
            gradeishidden?: boolean | null;
            /** Grade is locked? */
            gradeislocked?: boolean | null;
            /** Grade overridden? */
            gradeisoverridden?: boolean | null;
            /** The grade formatted */
            gradeformatted?: string | null;
            /** Grade min */
            grademin?: number | null;
            /** Grade max */
            grademax?: number | null;
            /** Range formatted */
            rangeformatted?: string | null;
            /** Percentage */
            percentageformatted?: string | null;
            /** Letter grade */
            lettergradeformatted?: string | null;
            /** Rank in the course */
            rank?: number | null;
            /** Num users in course */
            numusers?: number | null;
            /** Grade average */
            averageformatted?: string | null;
            /** Grade feedback */
            feedback?: string | null;
            /** feedback format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
            feedbackformat?: number | null;
        }>;
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

export type GradereportUserGetGradeItemsReturn = GradereportUserGetGradeItemsReturns;
export type gradereport_user_get_grade_items_returns = GradereportUserGetGradeItemsReturns;
