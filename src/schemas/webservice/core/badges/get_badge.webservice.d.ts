/** Retrieves a badge by id. */
export interface CoreBadgesGetBadgeParams {
    /** Badge id */
    id: number | null;
}

export interface CoreBadgesGetBadgeReturns {
    badge: {
        /** BadgeClass */
        type: string;
        /** Unique identifier for this badgeclass */
        id: string;
        /** Unique identifier for this badgeclass */
        issuer?: string;
        /** Name of the badgeclass */
        name: string;
        /** URL to the image. */
        image: string;
        /** Description of the badge class. */
        description: string;
        /** Identifier of the open badge for this assertion */
        hostedUrl?: string;
        /** alignment */
        alignment?: Array<{
            /** Alignment id */
            id?: number;
            /** Badge id */
            badgeid?: number;
            /** Target name */
            targetName?: string;
            /** Target URL */
            targetUrl?: string;
            /** Target description */
            targetDescription?: string | null;
            /** Target framework */
            targetFramework?: string | null;
            /** Target code */
            targetCode?: string | null;
        }>;
        /** criteriaUrl */
        criteriaUrl?: string;
        /** criteriaNarrative */
        criteriaNarrative?: string;
    };
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

export type CoreBadgesGetBadgeReturn = CoreBadgesGetBadgeReturns;
export type core_badges_get_badge_returns = CoreBadgesGetBadgeReturns;
