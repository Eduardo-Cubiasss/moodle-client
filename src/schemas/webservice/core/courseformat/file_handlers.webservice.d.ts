/** Get the current course file hanlders. */
export interface CoreCourseformatFileHandlersParams {
    /** course id */
    courseid: number | null;
}

export type CoreCourseformatFileHandlersReturns = Array<{
    /** File extension */
    extension: string | null;
    /** Target module */
    module: string | null;
    /** Output message */
    message: string | null;
}>;

export type CoreCourseformatFileHandlersReturn = CoreCourseformatFileHandlersReturns;
export type core_courseformat_file_handlers_returns = CoreCourseformatFileHandlersReturns;
