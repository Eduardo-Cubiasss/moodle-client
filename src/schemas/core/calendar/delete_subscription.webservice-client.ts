/** Delete the calendar subscription */
export interface CoreCalendarDeleteSubscriptionParams {
    /** The id of the subscription */
    subscriptionid: number | null;
}

export interface CoreCalendarDeleteSubscriptionReturns {
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

export type CoreCalendarDeleteSubscriptionReturn = CoreCalendarDeleteSubscriptionReturns;
export type core_calendar_delete_subscription_returns = CoreCalendarDeleteSubscriptionReturns;
