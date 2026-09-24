/** Check if there are updates affecting the user for the given course since the given time stamp. */
export interface CoreCourseGetUpdatesSinceParams {
    /** Course id to check */
    courseid: number | null;
    /** Check updates since this time stamp */
    since: number | null;
    /** Check only for updates in these areas */
    filter?: string | null[];
}

export interface CoreCourseGetUpdatesSinceReturns {
    instances: Array<{
        /** The context level */
        contextlevel: string | null;
        /** Instance id */
        id: number | null;
        updates: Array<{
            /** Name of the area updated. */
            name: string | null;
            /** Last time was updated */
            timeupdated?: number | null;
            /** The ids of the items updated */
            itemids?: number | null[];
        }>;
    }>;
    /** list of warnings */
    warnings?: Array<{
        /** item */
        item?: string | null;
        /** item id */
        itemid?: number | null;
        /** the warning code can be used by the client app to implement specific behaviour */
        warningcode: string | null;
        /** untranslated english message to explain the warning */
        message: string | null;
    }>;
}

export type CoreCourseGetUpdatesSinceReturn = CoreCourseGetUpdatesSinceReturns;
export type core_course_get_updates_since_returns = CoreCourseGetUpdatesSinceReturns;
