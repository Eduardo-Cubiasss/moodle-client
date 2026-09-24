/** What the activities of some courses are called and when they are open. */
export interface LocalCoursestateGetCourseActivitiesParams {
    /** The courses whose activities to read */
    courseids: number | null[];
}

export interface LocalCoursestateGetCourseActivitiesReturns {
    /** One entry per course the student is allowed to read */
    courses: Array<{
        /** The course */
        courseid: number | null;
        activities: Array<{
            /** The activity */
            cmid: number | null;
            /** Whether completion is enabled */
            tracked: boolean | null;
            /** Whether the activity is complete */
            completed: boolean | null;
            /** Added since the last course visit */
            isnew: boolean | null;
            /** When the activity was added to the course */
            addedat: number | null;
            /** Grade updated since the last course visit */
            corrected: boolean | null;
            /** Whether the activity is marked at all */
            gradable: boolean | null;
            /** Whether it carries a mark for this student */
            graded: boolean | null;
            /** What kind of activity it is */
            modname: string | null;
            /** What that kind is called */
            modfullname: string | null;
            /** What it is called */
            name: string | null;
            /** The section that holds it */
            sectionname: string | null;
            /** Where it opens */
            url: string | null;
            /** When it opens, when it says so */
            availablefrom?: number | null;
            /** When it closes, when it says so */
            availableuntil?: number | null;
        }>;
    }>;
}

export type LocalCoursestateGetCourseActivitiesReturn = LocalCoursestateGetCourseActivitiesReturns;
export type local_coursestate_get_course_activities_returns = LocalCoursestateGetCourseActivitiesReturns;
