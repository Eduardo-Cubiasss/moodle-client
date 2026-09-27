/** List the courses using a competency */
export interface ToolLpListCoursesUsingCompetencyParams {
    /** The competency id */
    id: number | null;
}

export type ToolLpListCoursesUsingCompetencyReturns = Array<{
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

export type ToolLpListCoursesUsingCompetencyReturn = ToolLpListCoursesUsingCompetencyReturns;
export type tool_lp_list_courses_using_competency_returns = ToolLpListCoursesUsingCompetencyReturns;
