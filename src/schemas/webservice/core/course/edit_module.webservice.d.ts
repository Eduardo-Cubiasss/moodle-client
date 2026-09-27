/** Performs an action on course module (change visibility, duplicate, delete, etc.) */
export interface CoreCourseEditModuleParams {
    /** action: hide, show, stealth, duplicate, delete, moveleft, moveright, group... */
    action: string | null;
    /** course module id */
    id: number | null;
    /** section to return to */
    sectionreturn?: number | null;
}

/** html to replace the current module with */
export type CoreCourseEditModuleReturns = string | null;

export type CoreCourseEditModuleReturn = CoreCourseEditModuleReturns;
export type core_course_edit_module_returns = CoreCourseEditModuleReturns;
