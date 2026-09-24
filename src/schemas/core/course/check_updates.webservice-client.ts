/** Check if there is updates affecting the user for the given course and contexts. */
export interface CoreCourseCheckUpdatesParams {
    /** Course id to check */
    courseid: number | null;
    /** Instances to check */
    tocheck: Array<{
        /** The context level for the file location. Only module supported right now. */
        contextlevel: string | null;
        /** Context instance id */
        id: number | null;
        /** Check updates since this time stamp */
        since: number | null;
    }>;
    /** Check only for updates in these areas */
    filter?: string | null[];
}

export interface CoreCourseCheckUpdatesReturns {
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

export type CoreCourseCheckUpdatesReturn = CoreCourseCheckUpdatesReturns;
export type core_course_check_updates_returns = CoreCourseCheckUpdatesReturns;
