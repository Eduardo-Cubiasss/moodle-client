/** Update course contents. */
export interface CoreCourseformatUpdateCourseParams {
    /** action: cm_hide, cm_show, section_hide, section_show, cm_moveleft... */
    action: string | null;
    /** course id */
    courseid: number | null;
    /** Affected ids */
    ids?: number | null[];
    /** Optional target section id */
    targetsectionid?: number | null;
    /** Optional target cm id */
    targetcmid?: number | null;
}

/** Encoded course update JSON */
export type CoreCourseformatUpdateCourseReturns = string | null;

export type CoreCourseformatUpdateCourseReturn = CoreCourseformatUpdateCourseReturns;
export type core_courseformat_update_course_returns = CoreCourseformatUpdateCourseReturns;
