/** Simulates the web-interface view of user/view.php and user/profile.php (triggering events),. */
export interface CoreUserViewUserProfileParams {
    /** id of the user, 0 for current user */
    userid: number | null;
    /** id of the course, default site course */
    courseid?: number | null;
}

export interface CoreUserViewUserProfileReturns {
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

export type CoreUserViewUserProfileReturn = CoreUserViewUserProfileReturns;
export type core_user_view_user_profile_returns = CoreUserViewUserProfileReturns;
