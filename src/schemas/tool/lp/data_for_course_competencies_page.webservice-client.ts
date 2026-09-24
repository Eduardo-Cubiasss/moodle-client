/** Load the data for the course competencies page template. */
export interface ToolLpDataForCourseCompetenciesPageParams {
    /** The course id */
    courseid: number | null;
    /** The module id */
    moduleid?: number | null;
}

export interface ToolLpDataForCourseCompetenciesPageReturns {
    /** The current course id */
    courseid: number | null;
    /** The current page context ID. */
    pagecontextid: number | null;
    /** Current user id, if the user is a gradable user. */
    gradableuserid?: number | null;
    /** User can manage competency frameworks */
    canmanagecompetencyframeworks: boolean | null;
    /** User can manage linked course competencies */
    canmanagecoursecompetencies: boolean | null;
    /** User can configure course competency settings */
    canconfigurecoursecompetencies: boolean | null;
    /** User can grade competencies. */
    cangradecompetencies: boolean | null;
    settings: {
        /** courseid */
        courseid: number;
        /** pushratingstouserplans */
        pushratingstouserplans: boolean;
        /** id */
        id: number;
        /** timecreated */
        timecreated: number;
        /** timemodified */
        timemodified: number;
        /** usermodified */
        usermodified: number;
    };
    statistics: {
        /** competencycount */
        competencycount: number;
        /** proficientcompetencycount */
        proficientcompetencycount: number;
        /** proficientcompetencypercentage */
        proficientcompetencypercentage: number;
        /** proficientcompetencypercentageformatted */
        proficientcompetencypercentageformatted: string;
        /** leastproficient */
        leastproficient: Array<{
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
        }>;
        /** leastproficientcount */
        leastproficientcount: number;
        /** canbegradedincourse */
        canbegradedincourse: boolean;
        /** canmanagecoursecompetencies */
        canmanagecoursecompetencies: boolean;
    };
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
        coursecompetency: {
            /** courseid */
            courseid: number;
            /** competencyid */
            competencyid: number;
            /** sortorder */
            sortorder: number;
            /** ruleoutcome */
            ruleoutcome: number;
            /** id */
            id: number;
            /** timecreated */
            timecreated: number;
            /** timemodified */
            timemodified: number;
            /** usermodified */
            usermodified: number;
        };
        coursemodules: Array<{
            /** id */
            id: number;
            /** name */
            name: string;
            /** url */
            url?: string;
            /** iconurl */
            iconurl: string;
        }>;
        usercompetencycourse?: {
            /** userid */
            userid: number;
            /** courseid */
            courseid: number;
            /** competencyid */
            competencyid: number;
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
            /** gradename */
            gradename: string;
            /** proficiencyname */
            proficiencyname: string;
        };
        ruleoutcomeoptions: Array<{
            /** The option value */
            value: number | null;
            /** The name of the option */
            text: string | null;
            /** If this is the currently selected option */
            selected: boolean | null;
        }>;
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
        plans: Array<{
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
        }>;
    }>;
    /** Url to the manage competencies page. */
    manageurl: string | null;
    /** Url to the course competencies page. */
    pluginbaseurl: string | null;
}

export type ToolLpDataForCourseCompetenciesPageReturn = ToolLpDataForCourseCompetenciesPageReturns;
export type tool_lp_data_for_course_competencies_page_returns = ToolLpDataForCourseCompetenciesPageReturns;
