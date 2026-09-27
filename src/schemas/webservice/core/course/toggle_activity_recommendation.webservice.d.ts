/** Adds or removes an activity as a recommendation in the activity chooser. */
export interface CoreCourseToggleActivityRecommendationParams {
    /** The favourite area (itemtype) */
    area: string | null;
    /** id of the activity or whatever */
    id: number | null;
}

export interface CoreCourseToggleActivityRecommendationReturns {
    /** id of the activity or whatever */
    id: number | null;
    /** The favourite area (itemtype) */
    area: string | null;
    /** If created or deleted */
    status: boolean | null;
}

export type CoreCourseToggleActivityRecommendationReturn = CoreCourseToggleActivityRecommendationReturns;
export type core_course_toggle_activity_recommendation_returns = CoreCourseToggleActivityRecommendationReturns;
