/** Create a new module to course. */
export interface CoreCourseformatNewModuleParams {
    /** course id */
    courseid: number | null;
    /** module name */
    modname: string | null;
    /** target section id */
    targetsectionid: number | null;
    /** Optional target cm id */
    targetcmid?: number | null;
}

/** Encoded course update JSON */
export type CoreCourseformatNewModuleReturns = string | null;

export type CoreCourseformatNewModuleReturn = CoreCourseformatNewModuleReturns;
export type core_courseformat_new_module_returns = CoreCourseformatNewModuleReturns;
