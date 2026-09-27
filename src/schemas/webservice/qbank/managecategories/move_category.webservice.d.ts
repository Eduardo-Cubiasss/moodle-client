/** Move a question category */
export interface QbankManagecategoriesMoveCategoryParams {
    /** The context of the current page */
    pagecontextid: number | null;
    /** Category being moved */
    categoryid: number | null;
    /** The ID of the parent category to move to. */
    targetparentid: number | null;
    /** The ID of the preceding category. Null if this is being moved to top of its parent */
    precedingsiblingid: number | null;
}

/** Category state updates */
export type QbankManagecategoriesMoveCategoryReturns = Array<{
    /** State object name (always "categories" from this function). */
    name: string | null;
    /** State update type (always "put" from this function). */
    action: string | null;
    fields: {
        /** The ID of the category that was updated. */
        id: number | null;
        /** The new sortorder */
        sortorder?: number | null;
        /** The ID of the new parent category. */
        parent?: number | null;
        /** The ID of the new context. */
        context?: number | null;
        /** Should this category have a drag handle? */
        draghandle?: boolean | null;
    };
}>;

export type QbankManagecategoriesMoveCategoryReturn = QbankManagecategoriesMoveCategoryReturns;
export type qbank_managecategories_move_category_returns = QbankManagecategoriesMoveCategoryReturns;
