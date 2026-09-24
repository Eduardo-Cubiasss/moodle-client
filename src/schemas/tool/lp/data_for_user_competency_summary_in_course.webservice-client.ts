/** Load a summary of a user competency. */
export interface ToolLpDataForUserCompetencySummaryInCourseParams {
    /** Data base record id for the user */
    userid: number | null;
    /** Data base record id for the competency */
    competencyid: number | null;
    /** Data base record id for the course */
    courseid: number | null;
}

export interface ToolLpDataForUserCompetencySummaryInCourseReturns {
    usercompetencysummary: {
        /** showrelatedcompetencies */
        showrelatedcompetencies: boolean;
        /** cangrade */
        cangrade: boolean;
        competency: {
            /** linkedcourses */
            linkedcourses: Array<{
                /** id */
                id: number;
                /** fullname */
                fullname: string;
                /** shortname */
                shortname: string;
                /** idnumber */
                idnumber: string;
                /** summary */
                summary: string | null;
                /** summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                summaryformat?: number | null;
                /** startdate */
                startdate: number;
                /** enddate */
                enddate: number;
                /** visible */
                visible: boolean;
                /** showactivitydates */
                showactivitydates: boolean | null;
                /** showcompletionconditions */
                showcompletionconditions: boolean | null;
                /** pdfexportfont */
                pdfexportfont: string | null;
                /** fullnamedisplay */
                fullnamedisplay: string;
                /** viewurl */
                viewurl: string;
                /** courseimage */
                courseimage: string;
                /** progress */
                progress?: number;
                /** hasprogress */
                hasprogress: boolean;
                /** isfavourite */
                isfavourite: boolean;
                /** hidden */
                hidden: boolean;
                /** timeaccess */
                timeaccess?: number;
                /** showshortname */
                showshortname: boolean;
                /** coursecategory */
                coursecategory: string;
            }>;
            /** relatedcompetencies */
            relatedcompetencies: Array<{
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
            framework: {
                /** shortname */
                shortname: string;
                /** idnumber */
                idnumber: string;
                /** description */
                description: string;
                /** description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
                descriptionformat?: number | null;
                /** visible */
                visible: boolean;
                /** scaleid */
                scaleid: number;
                /** scaleconfiguration */
                scaleconfiguration: string;
                /** contextid */
                contextid: number;
                /** taxonomies */
                taxonomies: string;
                /** id */
                id: number;
                /** timecreated */
                timecreated: number;
                /** timemodified */
                timemodified: number;
                /** usermodified */
                usermodified: number;
                /** canmanage */
                canmanage: boolean;
                /** competenciescount */
                competenciescount: number;
                /** contextname */
                contextname: string;
                /** contextnamenoprefix */
                contextnamenoprefix: string;
            };
            /** hascourses */
            hascourses: boolean;
            /** hasrelatedcompetencies */
            hasrelatedcompetencies: boolean;
            /** scaleid */
            scaleid: number;
            /** scaleconfiguration */
            scaleconfiguration: string;
            /** taxonomyterm */
            taxonomyterm: string;
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
            /** pluginbaseurl */
            pluginbaseurl: string;
        };
        user: {
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
        /** evidence */
        evidence: Array<{
            /** usercompetencyid */
            usercompetencyid: number;
            /** contextid */
            contextid: number;
            /** action */
            action: number;
            /** actionuserid */
            actionuserid: number | null;
            /** descidentifier */
            descidentifier: string;
            /** desccomponent */
            desccomponent: string;
            /** desca */
            desca: string | null;
            /** url */
            url: string | null;
            /** grade */
            grade: number | null;
            /** note */
            note: string | null;
            /** id */
            id: number;
            /** timecreated */
            timecreated: number;
            /** timemodified */
            timemodified: number;
            /** usermodified */
            usermodified: number;
            actionuser?: {
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
            /** description */
            description: string;
            /** gradename */
            gradename: string;
            /** userdate */
            userdate: string;
            /** candelete */
            candelete: boolean;
        }>;
        commentarea?: {
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
    };
    course: {
        /** id */
        id: number;
        /** fullname */
        fullname: string;
        /** shortname */
        shortname: string;
        /** idnumber */
        idnumber: string;
        /** summary */
        summary: string | null;
        /** summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN) */
        summaryformat?: number | null;
        /** startdate */
        startdate: number;
        /** enddate */
        enddate: number;
        /** visible */
        visible: boolean;
        /** showactivitydates */
        showactivitydates: boolean | null;
        /** showcompletionconditions */
        showcompletionconditions: boolean | null;
        /** pdfexportfont */
        pdfexportfont: string | null;
        /** fullnamedisplay */
        fullnamedisplay: string;
        /** viewurl */
        viewurl: string;
        /** courseimage */
        courseimage: string;
        /** progress */
        progress?: number;
        /** hasprogress */
        hasprogress: boolean;
        /** isfavourite */
        isfavourite: boolean;
        /** hidden */
        hidden: boolean;
        /** timeaccess */
        timeaccess?: number;
        /** showshortname */
        showshortname: boolean;
        /** coursecategory */
        coursecategory: string;
    };
    /** coursemodules */
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
    /** plans */
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
    /** pluginbaseurl */
    pluginbaseurl: string;
}

export type ToolLpDataForUserCompetencySummaryInCourseReturn = ToolLpDataForUserCompetencySummaryInCourseReturns;
export type tool_lp_data_for_user_competency_summary_in_course_returns = ToolLpDataForUserCompetencySummaryInCourseReturns;
