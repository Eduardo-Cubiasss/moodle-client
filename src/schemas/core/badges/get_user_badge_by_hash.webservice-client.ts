/** Returns the badge awarded to a user by hash. */
export interface CoreBadgesGetUserBadgeByHashParams {
    /** Badge issued hash */
    hash: string | null;
}

export interface CoreBadgesGetUserBadgeByHashReturns {
    badge: Array<{
        /** Badge id */
        id?: number;
        /** Badge name */
        name: string;
        /** Badge description */
        description: string | null;
        /** Time created */
        timecreated?: number;
        /** Time modified */
        timemodified?: number;
        /** User created */
        usercreated?: number;
        /** User modified */
        usermodified?: number;
        /** Issuer name */
        issuername: string;
        /** Issuer URL */
        issuerurl: string;
        /** Issuer contact */
        issuercontact: string | null;
        /** Expire date */
        expiredate?: number | null;
        /** Expire period */
        expireperiod?: number | null;
        /** Type */
        type?: number;
        /** Course id */
        courseid?: number | null;
        /** Message */
        message?: string;
        /** Message subject */
        messagesubject?: string;
        /** Attachment */
        attachment?: number;
        /** Whether to notify when badge is awarded */
        notification?: number;
        /** Next cron */
        nextcron?: number | null;
        /** Status */
        status?: number;
        /** Issued id */
        issuedid?: number;
        /** Unique hash */
        uniquehash: string;
        /** Date issued */
        dateissued: number;
        /** Date expire */
        dateexpire: number | null;
        /** Visible */
        visible?: number;
        /** Id of the awarded user */
        recipientid: number;
        /** Full name of the awarded user */
        recipientfullname: string;
        /** User email */
        email?: string;
        /** Version */
        version?: string | null;
        /** Language */
        language?: string | null;
        /** Name of the image author */
        imageauthorname?: string | null;
        /** Email of the image author */
        imageauthoremail?: string | null;
        /** URL of the image author */
        imageauthorurl?: string | null;
        /** Caption of the image */
        imagecaption?: string | null;
        /** Badge URL */
        badgeurl: string;
        endorsement?: {
            /** Endorsement id */
            id: number;
            /** Badge id */
            badgeid: number;
            /** Endorsement issuer name */
            issuername: string;
            /** Endorsement issuer URL */
            issuerurl: string;
            /** Endorsement issuer email */
            issueremail: string;
            /** Claim URL */
            claimid: string | null;
            /** Claim comment */
            claimcomment: string | null;
            /** Date issued */
            dateissued: number;
        };
        /** Badge alignments */
        alignment: Array<{
            /** Alignment id */
            id?: number;
            /** Badge id */
            badgeid?: number;
            /** Target name */
            targetName?: string;
            /** Target URL */
            targetUrl?: string;
            /** Target description */
            targetDescription?: string | null;
            /** Target framework */
            targetFramework?: string | null;
            /** Target code */
            targetCode?: string | null;
        }>;
        /** Related badges */
        relatedbadges: Array<{
            /** Badge id */
            id: number;
            /** Badge name */
            name: string;
            /** Version */
            version?: string | null;
            /** Language */
            language?: string | null;
            /** Type */
            type?: number;
        }>;
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

export type CoreBadgesGetUserBadgeByHashReturn = CoreBadgesGetUserBadgeByHashReturns;
export type core_badges_get_user_badge_by_hash_returns = CoreBadgesGetUserBadgeByHashReturns;
