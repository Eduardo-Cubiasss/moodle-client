/** Returns information about an assignment submission status for a given user. */
export interface ModAssignGetSubmissionStatusParams {
    /** assignment instance id */
    assignid: number | null;
    /** user id (empty for current user) */
    userid?: number | null;
    /** filter by users in group (used for generating the grading summary). 0 for all groups information, any other empty value will calculate currrent group. */
    groupid?: number | null;
}

export interface ModAssignGetSubmissionStatusReturns {
    /** Grading information. */
    gradingsummary?: {
        /** Number of users who can submit. */
        participantcount: number | null;
        /** Number of submissions in draft status. */
        submissiondraftscount: number | null;
        /** Whether submissions are enabled or not. */
        submissionsenabled: boolean | null;
        /** Number of submissions in submitted status. */
        submissionssubmittedcount: number | null;
        /** Number of submissions that need grading. */
        submissionsneedgradingcount: number | null;
        /** Whether we need to warn people that there are users without groups ('warningrequired'), warn people there are users who will submit in the default group ('warningoptional') or no warning (''). */
        warnofungroupedusers: string | null;
    };
    /** Last attempt information. */
    lastattempt?: {
        /** submission info */
        submission?: {
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
        };
        /** submission info */
        teamsubmission?: {
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
        };
        /** The submission group id (for group submissions only). */
        submissiongroup?: number | null;
        /** List of users who still need to submit (for group submissions only). */
        submissiongroupmemberswhoneedtosubmit?: number | null[];
        /** Whether submissions are enabled or not. */
        submissionsenabled: boolean | null;
        /** Whether new submissions are locked. */
        locked: boolean | null;
        /** Whether the submission is graded. */
        graded: boolean | null;
        /** Whether the user can edit the current submission. */
        canedit: boolean | null;
        /** Whether the owner of the submission can edit it. */
        caneditowner: boolean | null;
        /** Whether the user can submit. */
        cansubmit: boolean | null;
        /** Extension due date. */
        extensionduedate: number | null;
        /** Time limit for submission. */
        timelimit?: number | null;
        /** Whether blind marking is enabled. */
        blindmarking: boolean | null;
        /** Grading status. */
        gradingstatus: string | null;
        /** User groups in the course. */
        usergroups: number | null[];
    };
    /** Feedback for the last attempt. */
    feedback?: {
        /** grade information */
        grade?: {
            /** grade id */
            id: number | null;
            /** assignment id */
            assignment?: number | null;
            /** student id */
            userid: number | null;
            /** attempt number */
            attemptnumber: number | null;
            /** grade creation time */
            timecreated: number | null;
            /** grade last modified time */
            timemodified: number | null;
            /** grader, -1 if grader is hidden */
            grader: number | null;
            /** grade */
            grade: string | null;
            /** grade rendered into a format suitable for display */
            gradefordisplay?: string | null;
        };
        /** Grade rendered into a format suitable for display. */
        gradefordisplay: string | null;
        /** The date the user was graded. */
        gradeddate: number | null;
        /** Plugins info. */
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
    };
    /** List all the previous attempts did by the user. */
    previousattempts?: Array<{
        /** Attempt number. */
        attemptnumber: number | null;
        /** submission info */
        submission?: {
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
        };
        /** grade information */
        grade?: {
            /** grade id */
            id: number | null;
            /** assignment id */
            assignment?: number | null;
            /** student id */
            userid: number | null;
            /** attempt number */
            attemptnumber: number | null;
            /** grade creation time */
            timecreated: number | null;
            /** grade last modified time */
            timemodified: number | null;
            /** grader, -1 if grader is hidden */
            grader: number | null;
            /** grade */
            grade: string | null;
            /** grade rendered into a format suitable for display */
            gradefordisplay?: string | null;
        };
        /** Feedback info. */
        feedbackplugins?: Array<{
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
    }>;
    /** Extra information about assignment */
    assignmentdata?: {
        /** Intro and activity attachments */
        attachments?: {
            /** Intro attachments files */
            intro?: Array<{
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
            /** Activity attachments files */
            activity?: Array<{
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
        };
        /** Text of activity */
        activity?: string | null;
        /** activity format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        activityformat?: number | null;
    };
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

export type ModAssignGetSubmissionStatusReturn = ModAssignGetSubmissionStatusReturns;
export type mod_assign_get_submission_status_returns = ModAssignGetSubmissionStatusReturns;
