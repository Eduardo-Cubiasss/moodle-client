/** Fetch the details of a user's data request */
export interface ToolDataprivacyGetDataRequestParams {
    /** The request ID */
    requestid: number | null;
}

export interface ToolDataprivacyGetDataRequestReturns {
    result: {
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
    };
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

export type ToolDataprivacyGetDataRequestReturn = ToolDataprivacyGetDataRequestReturns;
export type tool_dataprivacy_get_data_request_returns = ToolDataprivacyGetDataRequestReturns;
