/** Load the data for the plan page template. */
export interface ToolLpDataForPlanPageParams {
    /** The plan id */
    planid: number | null;
}

export interface ToolLpDataForPlanPageReturns {
    plan: {
        /** name */
        name: string;
        /** description */
        description: string;
        /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        descriptionformat?: number | null;
        /** userid */
        userid: number;
        /** templateid */
        templateid: number | null;
        /** origtemplateid */
        origtemplateid: number | null;
        /** status */
        status: number;
        /** duedate */
        duedate: number;
        /** reviewerid */
        reviewerid: number | null;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
        /** statusname */
        statusname: string;
        /** isbasedontemplate */
        isbasedontemplate: boolean;
        /** canmanage */
        canmanage: boolean;
        /** canrequestreview */
        canrequestreview: boolean;
        /** canreview */
        canreview: boolean;
        /** canbeedited */
        canbeedited: boolean;
        /** isactive */
        isactive: boolean;
        /** isdraft */
        isdraft: boolean;
        /** iscompleted */
        iscompleted: boolean;
        /** isinreview */
        isinreview: boolean;
        /** iswaitingforreview */
        iswaitingforreview: boolean;
        /** isreopenallowed */
        isreopenallowed: boolean;
        /** iscompleteallowed */
        iscompleteallowed: boolean;
        /** isunlinkallowed */
        isunlinkallowed: boolean;
        /** isrequestreviewallowed */
        isrequestreviewallowed: boolean;
        /** iscancelreviewrequestallowed */
        iscancelreviewrequestallowed: boolean;
        /** isstartreviewallowed */
        isstartreviewallowed: boolean;
        /** isstopreviewallowed */
        isstopreviewallowed: boolean;
        /** isapproveallowed */
        isapproveallowed: boolean;
        /** isunapproveallowed */
        isunapproveallowed: boolean;
        /** duedateformatted */
        duedateformatted: string;
        commentarea: {
            /** component */
            component: string;
            /** commentarea */
            commentarea: string;
            /** itemid */
            itemid: number;
            /** courseid */
            courseid: number;
            /** contextid */
            contextid: number;
            /** cid */
            cid: string;
            /** autostart */
            autostart: boolean;
            /** canpost */
            canpost: boolean;
            /** canview */
            canview: boolean;
            /** count */
            count: number;
            /** collapsediconkey */
            collapsediconkey: string;
            /** displaytotalcount */
            displaytotalcount: boolean;
            /** displaycancel */
            displaycancel: boolean;
            /** fullwidth */
            fullwidth: boolean;
            /** linktext */
            linktext: string;
            /** notoggle */
            notoggle: boolean;
            /** template */
            template: string;
            /** canpostorhascomments */
            canpostorhascomments: boolean;
        };
        reviewer?: {
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
        template?: {
            /** shortname */
            shortname: string;
            /** description */
            description: string;
            /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
            descriptionformat?: number | null;
            /** duedate */
            duedate: number;
            /** visible */
            visible: boolean;
            /** contextid */
            contextid: number;
            /** id */
            id: number;
            /** timecreated */
            timecreated: number;
            /** timemodified */
            timemodified: number;
            /** usermodified */
            usermodified: number;
            /** duedateformatted */
            duedateformatted: string;
            /** cohortscount */
            cohortscount: number;
            /** planscount */
            planscount: number;
            /** canmanage */
            canmanage: boolean;
            /** canread */
            canread: boolean;
            /** contextname */
            contextname: string;
            /** contextnamenoprefix */
            contextnamenoprefix: string;
        };
        /** url */
        url: string;
    };
    /** Context ID. */
    contextid: number | null;
    /** Plugin base URL. */
    pluginbaseurl: string | null;
    competencies: Array<{
        competency: {
            /** shortname */
            shortname: string;
            /** idnumber */
            idnumber: string;
            /** description */
            description: string;
            /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
            descriptionformat?: number | null;
            /** sortorder */
            sortorder: number;
            /** parentid */
            parentid: number;
            /** path */
            path: string;
            /** ruleoutcome */
            ruleoutcome: number;
            /** ruletype */
            ruletype: string | null;
            /** ruleconfig */
            ruleconfig: string | null;
            /** scaleid */
            scaleid: number | null;
            /** scaleconfiguration */
            scaleconfiguration: string | null;
            /** competencyframeworkid */
            competencyframeworkid: number;
            /** id */
            id: number;
            /** timecreated */
            timecreated: number;
            /** timemodified */
            timemodified: number;
            /** usermodified */
            usermodified: number;
        };
        comppath: {
            /** ancestors */
            ancestors: Array<{
                /** id */
                id: number | null;
                /** name */
                name: string;
                /** first */
                first: boolean;
                /** last */
                last: boolean;
                /** position */
                position: number;
            }>;
            framework: {
                /** id */
                id: number | null;
                /** name */
                name: string;
                /** first */
                first: boolean;
                /** last */
                last: boolean;
                /** position */
                position: number;
            };
            /** pluginbaseurl */
            pluginbaseurl: string;
            /** pagecontextid */
            pagecontextid: number;
            /** showlinks */
            showlinks: boolean;
        };
        usercompetency?: {
            /** userid */
            userid: number;
            /** competencyid */
            competencyid: number;
            /** status */
            status: number;
            /** reviewerid */
            reviewerid: number | null;
            /** proficiency */
            proficiency: boolean | null;
            /** grade */
            grade: number | null;
            /** id */
            id: number;
            /** timecreated */
            timecreated: number;
            /** timemodified */
            timemodified: number;
            /** usermodified */
            usermodified: number;
            /** canrequestreview */
            canrequestreview: boolean;
            /** canreview */
            canreview: boolean;
            /** gradename */
            gradename: string;
            /** isrequestreviewallowed */
            isrequestreviewallowed: boolean;
            /** iscancelreviewrequestallowed */
            iscancelreviewrequestallowed: boolean;
            /** isstartreviewallowed */
            isstartreviewallowed: boolean;
            /** isstopreviewallowed */
            isstopreviewallowed: boolean;
            /** isstatusidle */
            isstatusidle: boolean;
            /** isstatusinreview */
            isstatusinreview: boolean;
            /** isstatuswaitingforreview */
            isstatuswaitingforreview: boolean;
            /** proficiencyname */
            proficiencyname: string;
            reviewer?: {
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
            /** statusname */
            statusname: string;
            /** url */
            url: string;
        };
        usercompetencyplan?: {
            /** userid */
            userid: number;
            /** competencyid */
            competencyid: number;
            /** proficiency */
            proficiency: boolean | null;
            /** grade */
            grade: number | null;
            /** planid */
            planid: number;
            /** sortorder */
            sortorder: number;
            /** id */
            id: number;
            /** timecreated */
            timecreated: number;
            /** timemodified */
            timemodified: number;
            /** usermodified */
            usermodified: number;
            /** gradename */
            gradename: string;
            /** proficiencyname */
            proficiencyname: string;
        };
    }>;
    /** Count of competencies */
    competencycount: number | null;
    /** Count of proficientcompetencies */
    proficientcompetencycount: number | null;
    /** Percentage of competencies proficient */
    proficientcompetencypercentage: number | null;
    /** Displayable percentage */
    proficientcompetencypercentageformatted: string | null;
}

export type ToolLpDataForPlanPageReturn = ToolLpDataForPlanPageReturns;
export type tool_lp_data_for_plan_page_returns = ToolLpDataForPlanPageReturns;
