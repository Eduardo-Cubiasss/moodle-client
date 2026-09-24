/** Returns a list of folders in a provided list of courses, if no list is provided all folders that the user can view will be returned. Please note that this WS is not returning the folder contents. */
export interface ModFolderGetFoldersByCoursesParams {
    /** Array of course ids */
    courseids?: number | null[];
}

export interface ModFolderGetFoldersByCoursesReturns {
    folders: Array<{
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
        /** Incremented when after each file changes, to avoid cache */
        revision: number | null;
        /** Last time the folder was modified */
        timemodified: number | null;
        /** Display type of folder contents on a separate page or inline */
        display: number | null;
        /** 1 = expanded, 0 = collapsed for sub-folders */
        showexpanded: number | null;
        /** Whether to show the download folder button */
        showdownloadfolder: number | null;
        /** Whether file download is forced */
        forcedownload: number | null;
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

export type ModFolderGetFoldersByCoursesReturn = ModFolderGetFoldersByCoursesReturns;
export type mod_folder_get_folders_by_courses_returns = ModFolderGetFoldersByCoursesReturns;
