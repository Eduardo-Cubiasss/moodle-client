/** For some given input search for a course that matches */
export interface ToolMoodlenetSearchCoursesParams {
    /** search value */
    searchvalue: string | null;
}

export interface ToolMoodlenetSearchCoursesReturns {
    courses: Array<{
        /** course id */
        id: number | null;
        /** course full name */
        fullname: string | null;
        /** is the course visible */
        hidden: number | null;
        /** Next step of import */
        viewurl: string | null;
        /** Category name */
        coursecategory: string | null;
        /** course image */
        courseimage: string | null;
    }>;
}

export type ToolMoodlenetSearchCoursesReturn = ToolMoodlenetSearchCoursesReturns;
export type tool_moodlenet_search_courses_returns = ToolMoodlenetSearchCoursesReturns;
