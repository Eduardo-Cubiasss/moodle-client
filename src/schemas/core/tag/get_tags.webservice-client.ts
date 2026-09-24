/** Gets tags by their ids */
export interface CoreTagGetTagsParams {
    tags: Array<{
        /** tag id */
        id: number | null;
    }>;
}

export interface CoreTagGetTagsReturns {
    tags: Array<{
        /** tag id */
        id: number | null;
        /** tag collection id */
        tagcollid: number | null;
        /** name */
        name: string | null;
        /** tag raw name (may contain capital letters) */
        rawname: string | null;
        /** tag description */
        description: string | null;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat: number | null;
        /** flag */
        flag?: number | null;
        /** whether this flag is standard (deprecated, use isstandard) */
        official?: number | null;
        /** whether this flag is standard */
        isstandard?: number | null;
        /** URL to view */
        viewurl: string | null;
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

export type CoreTagGetTagsReturn = CoreTagGetTagsReturns;
export type core_tag_get_tags_returns = CoreTagGetTagsReturns;
