/** Save a list of assignment extensions */
export interface ModAssignSaveUserExtensionsParams {
    /** The assignment id to operate on */
    assignmentid: number | null;
    /** 1 or more user ids */
    userids: number | null[];
    /** 1 or more extension dates (timestamp) */
    dates: number | null[];
}

/** list of warnings */
export type ModAssignSaveUserExtensionsReturns = Array<{
    /** item */
    item?: string | null;
    /** item id */
    itemid?: number | null;
    /** the warning code can be used by the client app to implement specific behaviour */
    warningcode: string | null;
    /** untranslated english message to explain the warning */
    message: string | null;
}>;

export type ModAssignSaveUserExtensionsReturn = ModAssignSaveUserExtensionsReturns;
export type mod_assign_save_user_extensions_returns = ModAssignSaveUserExtensionsReturns;
