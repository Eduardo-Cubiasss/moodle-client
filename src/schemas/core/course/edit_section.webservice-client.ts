/** Performs an action on course section (change visibility, set marker, delete) */
export interface CoreCourseEditSectionParams {
    /** action: hide, show, stealth, setmarker, removemarker */
    action: string | null;
    /** course section id */
    id: number | null;
    /** section to return to */
    sectionreturn?: number | null;
}

/** Additional data for javascript (JSON-encoded string) */
export type CoreCourseEditSectionReturns = string | null;

export type CoreCourseEditSectionReturn = CoreCourseEditSectionReturns;
export type core_course_edit_section_returns = CoreCourseEditSectionReturns;
