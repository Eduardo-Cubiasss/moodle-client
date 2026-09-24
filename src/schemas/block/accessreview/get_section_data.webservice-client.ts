/** Gets error data for course sections. */
export interface BlockAccessreviewGetSectionDataParams {
    /** The course id to obtain results for. */
    courseid: number | null;
}

export type BlockAccessreviewGetSectionDataReturns = Array<{
    /** ID */
    section: number | null;
    /** Number of errors. */
    numerrors: number | null;
    /** Number of checks. */
    numchecks: number | null;
}>;

export type BlockAccessreviewGetSectionDataReturn = BlockAccessreviewGetSectionDataReturns;
export type block_accessreview_get_section_data_returns = BlockAccessreviewGetSectionDataReturns;
