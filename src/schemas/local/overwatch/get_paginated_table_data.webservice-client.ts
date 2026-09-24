/** Paginated table query web service */
export interface LocalOverwatchGetPaginatedTableDataParams {
    /** Table name to query */
    table: string | null;
    /** Pagination parameters */
    pagination?: {
        /** Page number (starting from 1) */
        page?: number | null;
        /** Number of records per page (1-10000) */
        limit?: number | null;
    };
    /** Sorting parameters */
    sorting?: {
        /** Field name to sort by */
        field?: string | null;
        /** Sort order (ASC or DESC) */
        order?: string | null;
    };
    /** Filter parameters (field-value pairs) */
    filters?: Array<{
        /** Field name to filter by */
        field?: string | null;
        /** Filter value */
        value?: string | null;
        /** How to compare: eq, ne, gt, gte, lt, lte. Equality when omitted. */
        operator?: string | null;
    }>;
}

export interface LocalOverwatchGetPaginatedTableDataReturns {
    /** Table name that was queried */
    table: string | null;
    /** All records as a single JSON string */
    data: string | null;
    /** Pagination metadata */
    pagination: {
        /** Current page number */
        page: number | null;
        /** Records per page */
        limit: number | null;
        /** Total number of records */
        total_records: number | null;
        /** Total number of pages */
        total_pages: number | null;
        /** Whether there is a next page */
        has_next: boolean | null;
        /** Whether there is a previous page */
        has_previous: boolean | null;
    };
}

export type LocalOverwatchGetPaginatedTableDataReturn = LocalOverwatchGetPaginatedTableDataReturns;
export type local_overwatch_get_paginated_table_data_returns = LocalOverwatchGetPaginatedTableDataReturns;
