/** Fetch the data for the activity chooser footer. */
export interface CoreCourseGetActivityChooserFooterParams {
    /** ID of the course */
    courseid: number | null;
    /** ID of the section */
    sectionid: number | null;
}

export interface CoreCourseGetActivityChooserFooterReturns {
    /** Is a footer being return by this request? */
    footer: boolean | null;
    /** The path to the plugin JS file */
    customfooterjs?: string | null;
    /** The prerendered footer */
    customfootertemplate?: string | null;
    /** Either "" or the prerendered carousel page */
    customcarouseltemplate?: string | null;
}

export type CoreCourseGetActivityChooserFooterReturn = CoreCourseGetActivityChooserFooterReturns;
export type core_course_get_activity_chooser_footer_returns = CoreCourseGetActivityChooserFooterReturns;
