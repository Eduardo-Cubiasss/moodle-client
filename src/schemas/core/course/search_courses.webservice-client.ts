/** Search courses by (name, module, block, tag) */
export interface CoreCourseSearchCoursesParams {
    /** criteria name (search, modulelist (only admins), blocklist (only admins), tagid) */
    criterianame: string | null;
    /** criteria value */
    criteriavalue: string | null;
    /** page number (0 based) */
    page?: number | null;
    /** items per page */
    perpage?: number | null;
    /** Optional list of required capabilities (used to filter the list) */
    requiredcapabilities?: string | null[];
    /** limit to enrolled courses */
    limittoenrolled?: boolean | null;
    /** limit to courses where completion is enabled */
    onlywithcompletion?: boolean | null;
}

export interface CoreCourseSearchCoursesReturns {
    /** total course count */
    total: number | null;
    /** course */
    courses: Array<{
        /** course id */
        id: number | null;
        /** course full name */
        fullname: string | null;
        /** course display name */
        displayname: string | null;
        /** course short name */
        shortname: string | null;
        /** Course image */
        courseimage?: string | null;
        /** category id */
        categoryid: number | null;
        /** category name */
        categoryname: string | null;
        /** Sort order in the category */
        sortorder?: number | null;
        /** summary */
        summary: string | null;
        /** summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        summaryformat: number | null;
        /** summary files in the summary field */
        summaryfiles?: Array<{
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
        /** additional overview files attached to this course */
        overviewfiles: Array<{
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
        /** Whether the activity dates are shown or not */
        showactivitydates: boolean | null;
        /** Whether the activity completion conditions are shown or not */
        showcompletionconditions: boolean | null;
        /** contact users */
        contacts: Array<{
            /** contact user id */
            id: number | null;
            /** contact user fullname */
            fullname: string | null;
        }>;
        /** enrollment methods list */
        enrollmentmethods: string | null[];
        /** Custom fields */
        customfields?: Array<{
            /** The name of the custom field */
            name: string | null;
            /** The shortname of the custom field - to be able to build the field class in the code */
            shortname: string | null;
            /** The type of the custom field - text field, checkbox... */
            type: string | null;
            /** The raw value of the custom field */
            valueraw: string | null;
            /** The value of the custom field */
            value: string | null;
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

export type CoreCourseSearchCoursesReturn = CoreCourseSearchCoursesReturns;
export type core_course_search_courses_returns = CoreCourseSearchCoursesReturns;
