/** Returns a list of forum posts for a discussion. */
export interface ModForumGetDiscussionPostsParams {
    /** The ID of the discussion from which to fetch posts. */
    discussionid: number | null;
    /** Sort by this element: id, created or modified */
    sortby?: string | null;
    /** Sort direction: ASC or DESC */
    sortdirection?: string | null;
    /** Whether inline attachments should be included or not */
    includeinlineattachments?: boolean | null;
}

export interface ModForumGetDiscussionPostsReturns {
    posts: Array<{
        /** id */
        id: number;
        /** subject */
        subject: string;
        /** replysubject */
        replysubject: string;
        /** message */
        message: string;
        /** message format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        messageformat: number | null;
        author: {
            /** id */
            id?: number | null;
            /** fullname */
            fullname?: string | null;
            /** isdeleted */
            isdeleted?: boolean | null;
            /** groups */
            groups?: Array<{
                /** id */
                id: number;
                /** name */
                name: string;
                urls: {
                    /** image */
                    image?: string | null;
                };
            }>;
            urls: {
                /** The URL for the use profile page */
                profile?: string | null;
                /** The URL for the use profile image */
                profileimage?: string | null;
            };
        };
        /** discussionid */
        discussionid: number;
        /** hasparent */
        hasparent: boolean;
        /** parentid */
        parentid?: number | null;
        /** timecreated */
        timecreated: number | null;
        /** timemodified */
        timemodified: number | null;
        /** unread */
        unread?: boolean | null;
        /** isdeleted */
        isdeleted: boolean;
        /** isprivatereply */
        isprivatereply: boolean;
        /** haswordcount */
        haswordcount: boolean;
        /** wordcount */
        wordcount?: number | null;
        /** charcount */
        charcount?: number | null;
        capabilities: {
            /** Whether the user can view the post */
            view: boolean | null;
            /** Whether the user can edit the post */
            edit: boolean | null;
            /** Whether the user can delete the post */
            delete: boolean | null;
            /** Whether the user can split the post */
            split: boolean | null;
            /** Whether the user can reply to the post */
            reply: boolean | null;
            /** Whether the user can self enrol into the course */
            selfenrol: boolean | null;
            /** Whether the user can export the post */
            export: boolean | null;
            /** Whether the user can control the read status of the post */
            controlreadstatus: boolean | null;
            /** Whether the user can post a private reply */
            canreplyprivately: boolean | null;
        };
        urls?: {
            /** The URL used to view the post */
            view?: string | null;
            /** The URL used to view the post in isolation */
            viewisolated?: string | null;
            /** The URL used to view the parent of the post */
            viewparent?: string | null;
            /** The URL used to edit the post */
            edit?: string | null;
            /** The URL used to delete the post */
            delete?: string | null;
            /** The URL used to split the discussion with the selected post being the first post in the new discussion */
            split?: string | null;
            /** The URL used to reply to the post */
            reply?: string | null;
            /** The URL used to export the post */
            export?: string | null;
            /** The URL used to mark the post as read */
            markasread?: string | null;
            /** The URL used to mark the post as unread */
            markasunread?: string | null;
            /** discuss */
            discuss?: string | null;
        };
        /** attachments */
        attachments: Array<{
            /** contextid */
            contextid: number;
            /** component */
            component: string;
            /** filearea */
            filearea: string;
            /** itemid */
            itemid: number;
            /** filepath */
            filepath: string;
            /** filename */
            filename: string;
            /** isdir */
            isdir: boolean;
            /** isimage */
            isimage: boolean;
            /** timemodified */
            timemodified: number;
            /** timecreated */
            timecreated: number;
            /** filesize */
            filesize: number;
            /** author */
            author: string;
            /** license */
            license: string;
            /** filenameshort */
            filenameshort: string;
            /** filesizeformatted */
            filesizeformatted: string;
            /** icon */
            icon: string;
            /** timecreatedformatted */
            timecreatedformatted: string;
            /** timemodifiedformatted */
            timemodifiedformatted: string;
            /** url */
            url: string;
            urls: {
                /** The URL used to export the attachment */
                export?: string | null;
            };
            html: {
                /** The HTML source for the Plagiarism Response */
                plagiarism?: string | null;
            };
        }>;
        /** messageinlinefiles */
        messageinlinefiles?: Array<{
            /** contextid */
            contextid: number;
            /** component */
            component: string;
            /** filearea */
            filearea: string;
            /** itemid */
            itemid: number;
            /** filepath */
            filepath: string;
            /** filename */
            filename: string;
            /** isdir */
            isdir: boolean;
            /** isimage */
            isimage: boolean;
            /** timemodified */
            timemodified: number;
            /** timecreated */
            timecreated: number;
            /** filesize */
            filesize: number;
            /** author */
            author: string;
            /** license */
            license: string;
            /** filenameshort */
            filenameshort: string;
            /** filesizeformatted */
            filesizeformatted: string;
            /** icon */
            icon: string;
            /** timecreatedformatted */
            timecreatedformatted: string;
            /** timemodifiedformatted */
            timemodifiedformatted: string;
            /** url */
            url: string;
        }>;
        /** tags */
        tags?: Array<{
            /** The ID of the Tag */
            id: number;
            /** The tagid */
            tagid: number;
            /** Whether this is a standard tag */
            isstandard: boolean;
            /** The display name of the tag */
            displayname: string;
            /** Wehther this tag is flagged */
            flag: boolean;
            urls: {
                /** The URL to view the tag */
                view: string;
            };
        }>;
        html?: {
            /** The HTML source to rate the post */
            rating?: string | null;
            /** The HTML source to view the list of tags */
            taglist?: string | null;
            /** The HTML source to view the author details */
            authorsubheading?: string | null;
        };
    }>;
    /** The forum id */
    forumid: number | null;
    /** The forum course id */
    courseid: number | null;
    /** Rating information */
    ratinginfo?: {
        /** Context id. */
        contextid: number | null;
        /** Context name. */
        component: string | null;
        /** Rating area name. */
        ratingarea: string | null;
        /** Whether the user can view all the individual ratings. */
        canviewall?: boolean | null;
        /** Whether the user can view aggregate of ratings of others. */
        canviewany?: boolean | null;
        /** Different scales used information */
        scales?: Array<{
            /** Scale id. */
            id: number | null;
            /** Course id. */
            courseid?: number | null;
            /** Scale name (when a real scale is used). */
            name?: string | null;
            /** Max value for the scale. */
            max: number | null;
            /** Whether is a numeric scale. */
            isnumeric: boolean | null;
            /** Scale items. Only returned for not numerical scales. */
            items?: Array<{
                /** Scale value/option id. */
                value: number | null;
                /** Scale name. */
                name: string | null;
            }>;
        }>;
        /** The ratings */
        ratings?: Array<{
            /** Item id. */
            itemid: number | null;
            /** Scale id. */
            scaleid?: number | null;
            /** User who rated id. */
            userid?: number | null;
            /** Aggregated ratings grade. */
            aggregate?: number | null;
            /** Aggregated ratings as string. */
            aggregatestr?: string | null;
            /** The aggregation label. */
            aggregatelabel?: string | null;
            /** Ratings count (used when aggregating). */
            count?: number | null;
            /** The rating the user gave. */
            rating?: number | null;
            /** Whether the user can rate the item. */
            canrate?: boolean | null;
            /** Whether the user can view the aggregated grade. */
            canviewaggregate?: boolean | null;
        }>;
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

export type ModForumGetDiscussionPostsReturn = ModForumGetDiscussionPostsReturns;
export type mod_forum_get_discussion_posts_returns = ModForumGetDiscussionPostsReturns;
