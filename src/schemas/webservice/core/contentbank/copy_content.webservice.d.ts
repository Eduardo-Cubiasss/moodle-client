/** Copy a content in the content bank. */
export interface CoreContentbankCopyContentParams {
    /** The content id to copy */
    contentid: number | null;
    /** The new name for the content */
    name: string | null;
}

export interface CoreContentbankCopyContentReturns {
    /** The id of the new content */
    id: number | null;
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

export type CoreContentbankCopyContentReturn = CoreContentbankCopyContentReturns;
export type core_contentbank_copy_content_returns = CoreContentbankCopyContentReturns;
