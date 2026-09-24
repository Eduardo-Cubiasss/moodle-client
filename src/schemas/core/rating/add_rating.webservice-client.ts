/** Rates an item. */
export interface CoreRatingAddRatingParams {
    /** context level: course, module, user, etc... */
    contextlevel: string | null;
    /** the instance id of item associated with the context level */
    instanceid: number | null;
    /** component */
    component: string | null;
    /** rating area */
    ratingarea: string | null;
    /** associated id */
    itemid: number | null;
    /** scale id */
    scaleid: number | null;
    /** user rating */
    rating: number | null;
    /** rated user id */
    rateduserid: number | null;
    /** agreggation method */
    aggregation?: number | null;
}

export interface CoreRatingAddRatingReturns {
    /** Whether the rate was successfully created */
    success: boolean | null;
    /** New aggregate */
    aggregate?: string | null;
    /** Ratings count */
    count?: number | null;
    /** Rating item id */
    itemid?: number | null;
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

export type CoreRatingAddRatingReturn = CoreRatingAddRatingReturns;
export type core_rating_add_rating_returns = CoreRatingAddRatingReturns;
