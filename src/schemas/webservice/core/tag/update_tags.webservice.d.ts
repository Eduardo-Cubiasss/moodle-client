/** Updates tags */
export interface CoreTagUpdateTagsParams {
    tags: Array<{
        /** tag id */
        id: number | null;
        /** tag raw name (may contain capital letters) */
        rawname?: string | null;
        /** tag description */
        description?: string | null;
        /** tag description format */
        descriptionformat?: number | null;
        /** flag */
        flag?: number | null;
        /** (deprecated, use isstandard) whether this flag is standard */
        official?: number | null;
        /** whether this flag is standard */
        isstandard?: number | null;
    }>;
}

export interface CoreTagUpdateTagsReturns {
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

export type CoreTagUpdateTagsReturn = CoreTagUpdateTagsReturns;
export type core_tag_update_tags_returns = CoreTagUpdateTagsReturns;
