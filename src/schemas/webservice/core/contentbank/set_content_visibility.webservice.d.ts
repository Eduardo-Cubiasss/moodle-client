/** Set the visibility of a content in the content bank. */
export interface CoreContentbankSetContentVisibilityParams {
    /** The content id to rename */
    contentid: number | null;
    /** The new visibility for the content */
    visibility: number | null;
}

export interface CoreContentbankSetContentVisibilityReturns {
    /** The processing result */
    result: boolean | null;
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

export type CoreContentbankSetContentVisibilityReturn = CoreContentbankSetContentVisibilityReturns;
export type core_contentbank_set_content_visibility_returns = CoreContentbankSetContentVisibilityReturns;
