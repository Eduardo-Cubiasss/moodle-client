/** Move a course competency to a new relative sort order. */
export interface CoreCompetencyReorderCourseCompetencyParams {
    /** The course id */
    courseid: number | null;
    /** The competency id we are moving */
    competencyidfrom: number | null;
    /** The competency id we are moving to */
    competencyidto: number | null;
}

/** True if successful. */
export type CoreCompetencyReorderCourseCompetencyReturns = boolean | null;

export type CoreCompetencyReorderCourseCompetencyReturn = CoreCompetencyReorderCourseCompetencyReturns;
export type core_competency_reorder_course_competency_returns = CoreCompetencyReorderCourseCompetencyReturns;
