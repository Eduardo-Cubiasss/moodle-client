/** Get a single feedback page items. */
export interface ModFeedbackGetPageItemsParams {
    /** Feedback instance id */
    feedbackid: number | null;
    /** The page to get starting by 0 */
    page: number | null;
    /** Course where user completes the feedback (for site feedbacks only). */
    courseid?: number | null;
}

export interface ModFeedbackGetPageItemsReturns {
    items: Array<{
        /** The record id. */
        id: number;
        /** The feedback instance id this records belongs to. */
        feedback: number;
        /** If it belogns to a template, the template id. */
        template: number;
        /** The item name. */
        name: string;
        /** name format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        nameformat?: number | null;
        /** The item label. */
        label: string;
        /** The text describing the item or the available possible answers. */
        presentation: string;
        /** presentation format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        presentationformat?: number | null;
        /** The type of the item. */
        typ: string;
        /** Whether it has a value or not. */
        hasvalue: number;
        /** The position in the list of questions. */
        position: number;
        /** Whether is a item (question) required or not. */
        required: boolean;
        /** The item id this item depend on. */
        dependitem: number;
        /** The depend value. */
        dependvalue: string;
        /** Different additional settings for the item (question). */
        options: string;
        /** itemfiles */
        itemfiles: Array<{
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
        /** The item position number */
        itemnumber: number | null;
        /** Additional data that may be required by external functions */
        otherdata: string | null;
    }>;
    /** Whether is a previous page. */
    hasprevpage: boolean | null;
    /** Whether there are more pages. */
    hasnextpage: boolean | null;
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

export type ModFeedbackGetPageItemsReturn = ModFeedbackGetPageItemsReturns;
export type mod_feedback_get_page_items_returns = ModFeedbackGetPageItemsReturns;
