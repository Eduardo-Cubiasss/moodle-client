/** Gets data request. */
export interface ToolDataprivacyGetDataRequestsParams {
    /** The id of the user to get the data requests for. Empty for all users. */
    userid?: number | null;
    /** The statuses of the data requests to get. 0 for pending 1 preprocessing, 2 awaiting approval, 3 approved, 4 processed, 5 completed, 6 cancelled, 7 rejected. */
    statuses?: number | null[];
    /** The types of the data requests to get. 1 for export, 2 for data deletion. */
    types?: number | null[];
    /** The creation methods of the data requests to get. 0 for manual, 1 for automatic. */
    creationmethods?: number | null[];
    /** The field to sort the data requests by. */
    sort?: string | null;
    /** The number to start getting the data requests from. */
    limitfrom?: number | null;
    /** The number of data requests to get. */
    limitnum?: number | null;
}

export interface ToolDataprivacyGetDataRequestsReturns {
    /** The data requests. */
    requests: Array<{
        /** type */
        type: number;
        /** comments */
        comments: string;
        /** commentsformat */
        commentsformat: number;
        /** userid */
        userid: number;
        /** requestedby */
        requestedby: number;
        /** status */
        status: number;
        /** dpo */
        dpo: number | null;
        /** dpocomment */
        dpocomment: string | null;
        /** dpocommentformat */
        dpocommentformat: number;
        /** systemapproved */
        systemapproved: boolean;
        /** creationmethod */
        creationmethod: number;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
        foruser: {
            /** id */
            id: number;
            /** email */
            email: string;
            /** idnumber */
            idnumber: string;
            /** phone1 */
            phone1: string;
            /** phone2 */
            phone2: string;
            /** department */
            department: string;
            /** institution */
            institution: string;
            /** fullname */
            fullname: string;
            /** identity */
            identity: string;
            /** profileurl */
            profileurl: string;
            /** profileimageurl */
            profileimageurl: string;
            /** profileimageurlsmall */
            profileimageurlsmall: string;
        };
        requestedbyuser?: {
            /** id */
            id: number;
            /** email */
            email: string;
            /** idnumber */
            idnumber: string;
            /** phone1 */
            phone1: string;
            /** phone2 */
            phone2: string;
            /** department */
            department: string;
            /** institution */
            institution: string;
            /** fullname */
            fullname: string;
            /** identity */
            identity: string;
            /** profileurl */
            profileurl: string;
            /** profileimageurl */
            profileimageurl: string;
            /** profileimageurlsmall */
            profileimageurlsmall: string;
        };
        dpouser?: {
            /** id */
            id: number;
            /** email */
            email: string;
            /** idnumber */
            idnumber: string;
            /** phone1 */
            phone1: string;
            /** phone2 */
            phone2: string;
            /** department */
            department: string;
            /** institution */
            institution: string;
            /** fullname */
            fullname: string;
            /** identity */
            identity: string;
            /** profileurl */
            profileurl: string;
            /** profileimageurl */
            profileimageurl: string;
            /** profileimageurlsmall */
            profileimageurlsmall: string;
        };
        /** messagehtml */
        messagehtml?: string;
        /** typename */
        typename: string;
        /** typenameshort */
        typenameshort: string;
        /** statuslabel */
        statuslabel: string;
        /** statuslabelclass */
        statuslabelclass: string;
        /** canreview */
        canreview?: boolean;
        /** approvedeny */
        approvedeny?: boolean;
        /** allowfiltering */
        allowfiltering?: boolean;
        /** canmarkcomplete */
        canmarkcomplete?: boolean;
        /** downloadlink */
        downloadlink?: string;
    }>;
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

export type ToolDataprivacyGetDataRequestsReturn = ToolDataprivacyGetDataRequestsReturns;
export type tool_dataprivacy_get_data_requests_returns = ToolDataprivacyGetDataRequestsReturns;
