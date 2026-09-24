/** Returns a list of h5p activities in a list of provided courses, if no list is provided all h5p activities that the user can view will be returned. */
export interface ModH5pactivityGetH5pactivitiesByCoursesParams {
    /** Array of course ids */
    courseids?: number | null[];
}

export interface ModH5pactivityGetH5pactivitiesByCoursesReturns {
    h5pactivities: Array<{
        /** The primary key of the record. */
        id: number;
        /** Course id this h5p activity is part of. */
        course: number;
        /** The name of the activity module instance. */
        name: string;
        /** Timestamp of when the instance was added to the course. */
        timecreated?: number;
        /** Timestamp of when the instance was last modified. */
        timemodified?: number;
        /** H5P activity description. */
        intro: string | null;
        /** intro format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        introformat?: number | null;
        /** The maximum grade for submission. */
        grade?: number;
        /** H5P Button display options. */
        displayoptions: number;
        /** Enable xAPI tracking. */
        enabletracking: number;
        /** Which H5P attempt is used for grading. */
        grademethod: number;
        /** Sha1 hash of file content. */
        contenthash?: string;
        /** coursemodule */
        coursemodule: number;
        /** context */
        context: number;
        /** introfiles */
        introfiles: Array<{
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
        /** package */
        package: Array<{
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
        deployedfile?: {
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
        };
    }>;
    /** H5P global settings */
    h5pglobalsettings?: {
        /** Whether saving state is enabled. */
        enablesavestate: boolean | null;
        /** How often (in seconds) state is saved. */
        savestatefreq?: number | null;
    };
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

export type ModH5pactivityGetH5pactivitiesByCoursesReturn = ModH5pactivityGetH5pactivitiesByCoursesReturns;
export type mod_h5pactivity_get_h5pactivities_by_courses_returns = ModH5pactivityGetH5pactivitiesByCoursesReturns;
