/** Rename a content in the content bank. */
export interface CoreContentbankRenameContentParams {
    /** The content id to rename */
    contentid: number | null;
    /** The new name for the content */
    name: string | null;
}

export interface CoreContentbankRenameContentReturns {
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

export type CoreContentbankRenameContentReturn = CoreContentbankRenameContentReturns;
export type core_contentbank_rename_content_returns = CoreContentbankRenameContentReturns;
