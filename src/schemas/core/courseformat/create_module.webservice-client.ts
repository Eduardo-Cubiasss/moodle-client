/** Add module to course. */
export interface CoreCourseformatCreateModuleParams {
    /** course id */
    courseid: number | null;
    /** module name */
    modname: string | null;
    /** target section number */
    targetsectionnum: number | null;
    /** Optional target cm id */
    targetcmid?: number | null;
}

/** Encoded course update JSON */
export type CoreCourseformatCreateModuleReturns = string | null;

export type CoreCourseformatCreateModuleReturn = CoreCourseformatCreateModuleReturns;
export type core_courseformat_create_module_returns = CoreCourseformatCreateModuleReturns;
