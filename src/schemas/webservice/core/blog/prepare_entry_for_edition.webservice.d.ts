/** Prepare a draft area for editing a blog entry.. */
export interface CoreBlogPrepareEntryForEditionParams {
    /** The entry id to edit. */
    entryid: number | null;
}

export interface CoreBlogPrepareEntryForEditionReturns {
    /** Draft item id for the text editor. */
    inlineattachmentsid: number | null;
    /** Draft item id for the file manager. */
    attachmentsid: number | null;
    /** File areas including options */
    areas: Array<{
        /** File area name. */
        area: string | null;
        /** Draft file area options. */
        options: Array<{
            /** Name of option. */
            name: string | null;
            /** Value of option. */
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

export type CoreBlogPrepareEntryForEditionReturn = CoreBlogPrepareEntryForEditionReturns;
export type core_blog_prepare_entry_for_edition_returns = CoreBlogPrepareEntryForEditionReturns;
