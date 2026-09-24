/** Delete course categories */
export interface CoreCourseDeleteCategoriesParams {
    categories: Array<{
        /** category id to delete */
        id: number | null;
        /** the parent category to move the contents to, if specified */
        newparent?: number | null;
        /** 1: recursively delete all contents inside this category, 0 (default): move contents to newparent or current parent category (except if parent is root) */
        recursive?: boolean | null;
    }>;
}

export type CoreCourseDeleteCategoriesReturns = unknown;

export type CoreCourseDeleteCategoriesReturn = CoreCourseDeleteCategoriesReturns;
export type core_course_delete_categories_returns = CoreCourseDeleteCategoriesReturns;
