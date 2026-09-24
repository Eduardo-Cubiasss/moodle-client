/** Delete a content from the content bank. */
export interface CoreContentbankDeleteContentParams {
    contentids: number | null[];
}

export interface CoreContentbankDeleteContentReturns {
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

export type CoreContentbankDeleteContentReturn = CoreContentbankDeleteContentReturns;
export type core_contentbank_delete_content_returns = CoreContentbankDeleteContentReturns;
