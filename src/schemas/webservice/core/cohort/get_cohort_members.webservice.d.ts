/** Returns cohort members. */
export interface CoreCohortGetCohortMembersParams {
    cohortids: Array<number | null>;
}

export type CoreCohortGetCohortMembersReturns = Array<{
    /** cohort record id */
    cohortid: number | null;
    userids: Array<number | null>;
}>;

export type CoreCohortGetCohortMembersReturn = CoreCohortGetCohortMembersReturns;
export type core_cohort_get_cohort_members_returns = CoreCohortGetCohortMembersReturns;
