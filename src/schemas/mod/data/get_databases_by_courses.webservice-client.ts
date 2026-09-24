/** Returns a list of database instances in a provided set of courses, if no courses are provided then all the database instances the user has access to will be returned. */
export interface ModDataGetDatabasesByCoursesParams {
    /** Array of course ids */
    courseids?: number | null[];
}

export interface ModDataGetDatabasesByCoursesReturns {
    databases: Array<{
        /** Database id */
        id: number;
        /** Course id */
        course: number;
        /** Database name */
        name: string;
        /** The Database intro */
        intro: string;
        /** intro format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        introformat?: number | null;
        /** Forced activity language */
        lang: string | null;
        /** comments enabled */
        comments: boolean;
        /** timeavailablefrom field */
        timeavailablefrom: number;
        /** timeavailableto field */
        timeavailableto: number;
        /** timeviewfrom field */
        timeviewfrom: number;
        /** timeviewto field */
        timeviewto: number;
        /** requiredentries field */
        requiredentries: number;
        /** requiredentriestoview field */
        requiredentriestoview: number;
        /** maxentries field */
        maxentries: number;
        /** rssarticles field */
        rssarticles: number;
        /** singletemplate field */
        singletemplate: string | null;
        /** listtemplate field */
        listtemplate: string | null;
        /** listtemplateheader field */
        listtemplateheader: string | null;
        /** listtemplatefooter field */
        listtemplatefooter: string | null;
        /** addtemplate field */
        addtemplate: string | null;
        /** rsstemplate field */
        rsstemplate: string | null;
        /** rsstitletemplate field */
        rsstitletemplate: string | null;
        /** csstemplate field */
        csstemplate: string | null;
        /** jstemplate field */
        jstemplate: string | null;
        /** asearchtemplate field */
        asearchtemplate: string | null;
        /** approval field */
        approval: boolean;
        /** manageapproved field */
        manageapproved: boolean;
        /** scale field */
        scale?: number;
        /** assessed field */
        assessed?: number;
        /** assesstimestart field */
        assesstimestart?: number;
        /** assesstimefinish field */
        assesstimefinish?: number;
        /** defaultsort field */
        defaultsort: number;
        /** defaultsortdir field */
        defaultsortdir: number;
        /** editany field (not used any more) */
        editany?: boolean;
        /** notification field (not used any more) */
        notification?: number;
        /** Time modified */
        timemodified?: number;
        /** coursemodule */
        coursemodule: number;
        /** introfiles */
        introfiles?: Array<{
            /** File name. */
            filename?: string;
            /** File path. */
            filepath?: string;
            /** File size. */
            filesize?: number;
            /** Downloadable file url. */
            fileurl?: string;
            /** Time modified. */
            timemodified?: number;
            /** File mime type. */
            mimetype?: string;
            /** Whether is an external file. */
            isexternalfile?: boolean;
            /** The repository type for the external files. */
            repositorytype?: string | null;
            /** Relative path to the relevant file type icon based on the file's mime type. */
            icon?: string | null;
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

export type ModDataGetDatabasesByCoursesReturn = ModDataGetDatabasesByCoursesReturns;
export type mod_data_get_databases_by_courses_returns = ModDataGetDatabasesByCoursesReturns;
