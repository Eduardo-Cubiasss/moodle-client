/** Returns the submissions for assignments */
export interface ModAssignGetSubmissionsParams {
    /** 1 or more assignment ids */
    assignmentids: number | null[];
    /** status */
    status?: string | null;
    /** submitted since */
    since?: number | null;
    /** submitted before */
    before?: number | null;
}

export interface ModAssignGetSubmissionsReturns {
    /** assignment submissions */
    assignments: Array<{
        /** assignment id */
        assignmentid: number | null;
        submissions: Array<{
            /** submission id */
            id: number | null;
            /** student id */
            userid: number | null;
            /** attempt number */
            attemptnumber: number | null;
            /** submission creation time */
            timecreated: number | null;
            /** submission last modified time */
            timemodified: number | null;
            /** submission start time */
            timestarted?: number | null;
            /** submission status */
            status: string | null;
            /** group id */
            groupid: number | null;
            /** assignment id */
            assignment?: number | null;
            /** latest attempt */
            latest?: number | null;
            /** plugins */
            plugins?: Array<{
                /** submission plugin type */
                type: string | null;
                /** submission plugin name */
                name: string | null;
                /** fileareas */
                fileareas?: Array<{
                    /** file area */
                    area: string | null;
                    /** files */
                    files?: Array<{
                        /** File name. */
                        filename?: string | null;
                        /** File path. */
                        filepath?: string | null;
                        /** File size. */
                        filesize?: number | null;
                        /** Downloadable file url. */
                        fileurl?: string | null;
                        /** Time modified. */
                        timemodified?: number | null;
                        /** File mime type. */
                        mimetype?: string | null;
                        /** Whether is an external file. */
                        isexternalfile?: boolean | null;
                        /** The repository type for external files. */
                        repositorytype?: string | null;
                        /** The relative path to the relevant file type icon based on the file's mime type. */
                        icon?: string | null;
                    }>;
                }>;
                /** editorfields */
                editorfields?: Array<{
                    /** field name */
                    name: string | null;
                    /** field description */
                    description: string | null;
                    /** field value */
                    text: string | null;
                    /** text format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                    format: number | null;
                }>;
            }>;
            /** Grading status. */
            gradingstatus?: string | null;
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

export type ModAssignGetSubmissionsReturn = ModAssignGetSubmissionsReturns;
export type mod_assign_get_submissions_returns = ModAssignGetSubmissionsReturns;
