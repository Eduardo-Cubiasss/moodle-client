/** List of items a user has accessed most recently. */
export interface BlockRecentlyaccesseditemsGetRecentItemsParams {
    /** result set limit */
    limit?: number | null;
}

/** The most recently accessed activities/resources by the logged user */
export type BlockRecentlyaccesseditemsGetRecentItemsReturns = Array<{
    /** id */
    id: number;
    /** courseid */
    courseid: number;
    /** cmid */
    cmid: number;
    /** userid */
    userid: number;
    /** modname */
    modname: string;
    /** name */
    name: string;
    /** coursename */
    coursename: string;
    /** timeaccess */
    timeaccess: number;
    /** viewurl */
    viewurl: string;
    /** courseviewurl */
    courseviewurl: string;
    /** icon */
    icon: string;
    /** purpose */
    purpose: string;
    /** branded */
    branded?: boolean;
}>;

export type BlockRecentlyaccesseditemsGetRecentItemsReturn = BlockRecentlyaccesseditemsGetRecentItemsReturns;
export type block_recentlyaccesseditems_get_recent_items_returns = BlockRecentlyaccesseditemsGetRecentItemsReturns;
