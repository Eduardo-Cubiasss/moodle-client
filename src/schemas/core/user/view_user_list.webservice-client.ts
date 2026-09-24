/** Simulates the web-interface view of user/index.php (triggering events),. */
export interface CoreUserViewUserListParams {
    /** id of the course, 0 for site */
    courseid: number | null;
}

export interface CoreUserViewUserListReturns {
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

export type CoreUserViewUserListReturn = CoreUserViewUserListReturns;
export type core_user_view_user_list_returns = CoreUserViewUserListReturns;
