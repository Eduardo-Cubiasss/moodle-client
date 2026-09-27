/** Simulate the view.php web interface book: trigger events, completion, etc... */
export interface ModBookViewBookParams {
    /** book instance id */
    bookid: number | null;
    /** chapter id */
    chapterid?: number | null;
}

export interface ModBookViewBookReturns {
    /** status: true if success */
    status: boolean | null;
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

export type ModBookViewBookReturn = ModBookViewBookReturns;
export type mod_book_view_book_returns = ModBookViewBookReturns;
