/** Get the user/s report grades table for a course */
export interface GradereportUserGetGradesTableParams {
    /** Course Id */
    courseid: number | null;
    /** Return grades only for this user (optional) */
    userid?: number | null;
    /** Get users from this group only */
    groupid?: number | null;
}

export interface GradereportUserGetGradesTableReturns {
    tables: Array<{
        /** course id */
        courseid: number | null;
        /** user id */
        userid: number | null;
        /** user fullname */
        userfullname: string | null;
        /** table max depth (needed for printing it) */
        maxdepth: number | null;
        tabledata: Array<{
            /** The item returned data */
            itemname?: {
                /** class */
                class: string | null;
                /** col span */
                colspan: number | null;
                /** cell content */
                content: string | null;
                /** id */
                id: string | null;
            };
            /** The item returned data */
            leader?: {
                /** class */
                class: string | null;
                /** row span */
                rowspan: number | null;
            };
            /** weight column */
            weight?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** grade column */
            grade?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** range column */
            range?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** percentage column */
            percentage?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** lettergrade column */
            lettergrade?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** rank column */
            rank?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** average column */
            average?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** feedback column */
            feedback?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            /** contributiontocoursetotal column */
            contributiontocoursetotal?: {
                /** class */
                class: string | null;
                /** cell content */
                content: string | null;
                /** headers */
                headers: string | null;
            };
            parentcategories: number | null[];
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

export type GradereportUserGetGradesTableReturn = GradereportUserGetGradesTableReturns;
export type gradereport_user_get_grades_table_returns = GradereportUserGetGradesTableReturns;
