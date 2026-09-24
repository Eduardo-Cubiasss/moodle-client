/** Retrieves permission information for the current user. */
export interface CoreBlogGetAccessInformationParams {}

export interface CoreBlogGetAccessInformationReturns {
    /** Whether the user can view blogs */
    canview: boolean | null;
    /** Whether the user can search blogs */
    cansearch: boolean | null;
    /** Whether the user can view drafts */
    canviewdrafts: boolean | null;
    /** Whether the user can create blog entries */
    cancreate: boolean | null;
    /** Whether the user can manage blog entries */
    canmanageentries: boolean | null;
    /** Whether the user can manage external blogs */
    canmanageexternal: boolean | null;
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

export type CoreBlogGetAccessInformationReturn = CoreBlogGetAccessInformationReturns;
export type core_blog_get_access_information_returns = CoreBlogGetAccessInformationReturns;
