/** Enable badges */
export interface CoreBadgesEnableBadgesParams {
    badgeids: string | null[];
}

export interface CoreBadgesEnableBadgesReturns {
    result: Array<{
        /** The badge identifier */
        badgeid: number | null;
        /** The processing result */
        awards: string | null;
    }>;
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

export type CoreBadgesEnableBadgesReturn = CoreBadgesEnableBadgesReturns;
export type core_badges_enable_badges_returns = CoreBadgesEnableBadgesReturns;
