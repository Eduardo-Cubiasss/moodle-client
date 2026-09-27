/** Returns user access information for the user grade report. */
export interface GradereportUserGetAccessInformationParams {
    /** Course to check. */
    courseid: number | null;
}

export interface GradereportUserGetAccessInformationReturns {
    /** Whether the user can view the user grade report. */
    canviewusergradereport: boolean | null;
    /** Whether the user can view his grades in the course. */
    canviewmygrades: boolean | null;
    /** Whether the user can view all users grades in the course. */
    canviewallgrades: boolean | null;
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

export type GradereportUserGetAccessInformationReturn = GradereportUserGetAccessInformationReturns;
export type gradereport_user_get_access_information_returns = GradereportUserGetAccessInformationReturns;
