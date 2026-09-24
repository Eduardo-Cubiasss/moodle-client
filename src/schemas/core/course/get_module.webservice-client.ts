/** Returns html with one activity module on course page */
export interface CoreCourseGetModuleParams {
    /** course module id */
    id: number | null;
    /** section to return to */
    sectionreturn?: number | null;
}

/** html to replace the current module with */
export type CoreCourseGetModuleReturns = string | null;

export type CoreCourseGetModuleReturn = CoreCourseGetModuleReturns;
export type core_course_get_module_returns = CoreCourseGetModuleReturns;
