/** Save a grade update for a single student. */
export interface ModAssignSaveGradeParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
    /** The student id to operate on */
    userid: number | null;
    /** The new grade for this user. Ignored if advanced grading used */
    grade: number | null;
    /** The attempt number (-1 means latest attempt) */
    attemptnumber: number | null;
    /** Allow another attempt if the attempt reopen method is manual */
    addattempt: boolean | null;
    /** The next marking workflow state */
    workflowstate: string | null;
    /** If true, this grade will be applied to all members of the group (for group assignments). */
    applytoall: boolean | null;
    /** plugin data */
    plugindata?: {
        /** Editor structure */
        assignfeedbackcomments_editor?: {
            /** The text for this feedback. */
            text: string | null;
            /** The format for this feedback */
            format: number | null;
        };
        /** The id of a draft area containing files for this feedback. */
        files_filemanager?: number | null;
    };
    /** advanced grading data */
    advancedgradingdata?: {
        /** items */
        guide?: {
            criteria: Array<{
                /** criterion id */
                criterionid: number | null;
                /** filling */
                fillings?: Array<{
                    /** criterion id */
                    criterionid: number | null;
                    /** level id */
                    levelid?: number | null;
                    /** remark */
                    remark?: string | null;
                    /** remark format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                    remarkformat?: number | null;
                    /** maximum score */
                    score: number | null;
                }>;
            }>;
        };
        /** items */
        rubric?: {
            criteria: Array<{
                /** criterion id */
                criterionid: number | null;
                /** filling */
                fillings?: Array<{
                    /** criterion id */
                    criterionid: number | null;
                    /** level id */
                    levelid?: number | null;
                    /** remark */
                    remark?: string | null;
                    /** remark format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                    remarkformat?: number | null;
                }>;
            }>;
        };
    };
}

export type ModAssignSaveGradeReturns = unknown;

export type ModAssignSaveGradeReturn = ModAssignSaveGradeReturns;
export type mod_assign_save_grade_returns = ModAssignSaveGradeReturns;
