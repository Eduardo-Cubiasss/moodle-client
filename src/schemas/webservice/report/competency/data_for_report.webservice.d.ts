/** Load the data for the competency report in a course. */
export interface ReportCompetencyDataForReportParams {
    /** The course id */
    courseid: number | null;
    /** The user id */
    userid: number | null;
    /** The module id */
    moduleid: number | null;
}

export interface ReportCompetencyDataForReportReturns {
    /** Course id */
    courseid: number | null;
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
    usercompetencies: Array<{
        usercompetencycourse: {
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
    }>;
    /** True if rating is push to user plans */
    pushratingstouserplans: boolean | null;
}

export type ReportCompetencyDataForReportReturn = ReportCompetencyDataForReportReturns;
export type report_competency_data_for_report_returns = ReportCompetencyDataForReportReturns;
