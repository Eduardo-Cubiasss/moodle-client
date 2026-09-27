/** Update the course competency settings */
export interface CoreCompetencyUpdateCourseCompetencySettingsParams {
    /** Course id for the course to update */
    courseid: number | null;
    settings: {
        /** New value of the setting */
        pushratingstouserplans: boolean | null;
    };
}

/** True if the update was successful. */
export type CoreCompetencyUpdateCourseCompetencySettingsReturns = boolean | null;

export type CoreCompetencyUpdateCourseCompetencySettingsReturn = CoreCompetencyUpdateCourseCompetencySettingsReturns;
export type core_competency_update_course_competency_settings_returns = CoreCompetencyUpdateCourseCompetencySettingsReturns;
