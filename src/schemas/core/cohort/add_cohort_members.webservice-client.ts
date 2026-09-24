/** Adds cohort members. */
export interface CoreCohortAddCohortMembersParams {
    members: Array<{
        cohorttype: {
            /** The name of the field: id (numeric value of cohortid) or idnumber (alphanumeric value of idnumber) */
            type: string | null;
            /** The value of the cohort */
            value: string | null;
        };
        usertype: {
            /** The name of the field: id (numeric value of id) or username (alphanumeric value of username) */
            type: string | null;
            /** The value of the cohort */
            value: string | null;
        };
    }>;
}

export interface CoreCohortAddCohortMembersReturns {
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

export type CoreCohortAddCohortMembersReturn = CoreCohortAddCohortMembersReturns;
export type core_cohort_add_cohort_members_returns = CoreCohortAddCohortMembersReturns;
