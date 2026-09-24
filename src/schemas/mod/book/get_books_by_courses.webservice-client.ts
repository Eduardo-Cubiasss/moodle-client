/** Returns a list of book instances in a provided set of courses, if no courses are provided then all the book instances the user has access to will be returned. */
export interface ModBookGetBooksByCoursesParams {
    /** Array of course ids */
    courseids?: number | null[];
}

export interface ModBookGetBooksByCoursesReturns {
    books: Array<{
        /** Activity instance id */
        id: number | null;
        /** Course module id */
        coursemodule: number | null;
        /** Course id */
        course: number | null;
        /** Activity name */
        name: string | null;
        /** Activity introduction */
        intro: string | null;
        /** intro format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        introformat: number | null;
        /** Files in the introduction */
        introfiles?: Array<{
            /** File name. */
            filename?: string | null;
            /** File path. */
            filepath?: string | null;
            /** File size. */
            filesize?: number | null;
            /** Downloadable file url. */
            fileurl?: string | null;
            /** Time modified. */
            timemodified?: number | null;
            /** File mime type. */
            mimetype?: string | null;
            /** Whether is an external file. */
            isexternalfile?: boolean | null;
            /** The repository type for external files. */
            repositorytype?: string | null;
            /** The relative path to the relevant file type icon based on the file's mime type. */
            icon?: string | null;
        }>;
        /** Course section id */
        section?: number | null;
        /** Visible */
        visible?: boolean | null;
        /** Group mode */
        groupmode?: number | null;
        /** Group id */
        groupingid?: number | null;
        /** Forced activity language */
        lang?: string | null;
        /** Book numbering configuration */
        numbering: number | null;
        /** Book navigation style configuration */
        navstyle: number | null;
        /** Book custom titles type */
        customtitles: number | null;
        /** Book revision */
        revision?: number | null;
        /** Time of creation */
        timecreated?: number | null;
        /** Time of last modification */
        timemodified?: number | null;
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

export type ModBookGetBooksByCoursesReturn = ModBookGetBooksByCoursesReturns;
export type mod_book_get_books_by_courses_returns = ModBookGetBooksByCoursesReturns;
