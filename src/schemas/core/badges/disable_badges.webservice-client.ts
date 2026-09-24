/** Disable badges */
export interface CoreBadgesDisableBadgesParams {
    badgeids: string | null[];
}

export interface CoreBadgesDisableBadgesReturns {
    /** The processing result */
    result: boolean | null;
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

export type CoreBadgesDisableBadgesReturn = CoreBadgesDisableBadgesReturns;
export type core_badges_disable_badges_returns = CoreBadgesDisableBadgesReturns;
