/** Returns cohort members. */
export interface CoreCohortGetCohortMembersParams {
    cohortids: number | null[];
}

export type CoreCohortGetCohortMembersReturns = Array<{
    /** cohort record id */
    cohortid: number | null;
    userids: number | null[];
}>;

export type CoreCohortGetCohortMembersReturn = CoreCohortGetCohortMembersReturns;
export type core_cohort_get_cohort_members_returns = CoreCohortGetCohortMembersReturns;
