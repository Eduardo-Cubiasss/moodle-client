/** Prepares a draft area for editing a post. */
export interface ModForumPrepareDraftAreaForPostParams {
    /** Post to prepare the draft area for. */
    postid: number | null;
    /** Area to prepare: attachment or post. */
    area: string | null;
    /** The draft item id to use. 0 to generate one. */
    draftitemid?: number | null;
    /** Only keep these files in the draft file area. Empty for keeping all. */
    filestokeep?: Array<{
        /** File name. */
        filename: string | null;
        /** File path. */
        filepath: string | null;
    }>;
}

export interface ModForumPrepareDraftAreaForPostReturns {
    /** Draft item id for the file area. */
    draftitemid: number | null;
    /** Draft area files. */
    files?: Array<{
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
    /** Draft file area options. */
    areaoptions: Array<{
        /** Name of option. */
        name: string | null;
        /** Value of option. */
        value: string | null;
    }>;
    /** Message text with URLs rewritten. */
    messagetext: string | null;
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

export type ModForumPrepareDraftAreaForPostReturn = ModForumPrepareDraftAreaForPostReturns;
export type mod_forum_prepare_draft_area_for_post_returns = ModForumPrepareDraftAreaForPostReturns;
