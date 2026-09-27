/** Get the H5P file cleaned for Mobile App. */
export interface CoreH5pGetTrustedH5pFileParams {
    /** H5P file url. */
    url: string | null;
    /** The frame allow to show the bar options below the content */
    frame?: number | null;
    /** The export allow to download the package */
    export?: number | null;
    /** The embed allow to copy the code to your site */
    embed?: number | null;
    /** The copyright option */
    copyright?: number | null;
}

export interface CoreH5pGetTrustedH5pFileReturns {
    /** H5P file trusted. */
    files: Array<{
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

export type CoreH5pGetTrustedH5pFileReturn = CoreH5pGetTrustedH5pFileReturns;
export type core_h5p_get_trusted_h5p_file_returns = CoreH5pGetTrustedH5pFileReturns;
