/** Gets error data for course modules. */
export interface BlockAccessreviewGetModuleDataParams {
    /** The course id to obtain results for. */
    courseid: number | null;
}

export type BlockAccessreviewGetModuleDataReturns = Array<{
    /** ID */
    cmid: number | null;
    /** Number of errors. */
    numerrors: number | null;
    /** Number of checks. */
    numchecks: number | null;
}>;

export type BlockAccessreviewGetModuleDataReturn = BlockAccessreviewGetModuleDataReturns;
export type block_accessreview_get_module_data_returns = BlockAccessreviewGetModuleDataReturns;
