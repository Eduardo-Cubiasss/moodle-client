/** Everything the student who is asking has: induction courses, programmes and the rest. */
export interface LocalCoursestateGetStudentCoursesParams {
    /** Include activity strips; false for progressive loading */
    includemodules?: boolean | null;
    /** always to count the activities, never to leave the tree without a figure on it, or whenfree to count only when the answer is already remembered. whenfree is what a dashboard wants: it is one request and no extra work almost every time, and on the rare load where counting would be slow the tree says progressready false and get_student_progress answers it out of the way */
    includeprogress?: string | null;
}

export interface LocalCoursestateGetStudentCoursesReturns {
    /** The student, as the campus knows them */
    useridnumber: string | null;
    /** Whether the figures are on this answer. False means counting them was not free and the page was not made to wait: ask get_student_progress for them */
    progressready: boolean | null;
    /** Whether nothing has been decided about any of their courses yet. The tree is still whole, with the progress this site counts itself; whoever draws it should say so rather than show a figure that looks settled. */
    degraded: boolean | null;
    /** The induction courses, shown first and together */
    induction: {
        /** Whether anything in it can be finished */
        hasprogress: boolean | null;
        /** Courses finished over courses that can be, as a percentage */
        progresspercent: number | null;
        /** How many of its courses can be finished */
        coursestotal: number | null;
        /** How many of those are finished */
        coursescomplete: number | null;
        courses: Array<{
            /** Whether activity strips are included */
            modulesloaded?: boolean | null;
            /** Activities added since the last course visit */
            newactivities?: number | null;
            /** Grades updated since the last course visit */
            correctedactivities?: number | null;
            /** The course, as the campus knows it */
            courseidnumber: string | null;
            /** The course, as this site knows it */
            courseid: number | null;
            /** What this site calls it */
            fullname: string | null;
            /** Its short name on this site */
            shortname: string | null;
            /** Where the student opens it, empty when nowhere */
            url: string | null;
            /** Whether anything has been decided about it. False means the student is on the course and nobody has ruled on it yet: it is shown, it is open, and they may go in. It is not the same as a course that is closed to them. */
            hasstate: boolean | null;
            /** Whether their enrolment lets them into it at all. A different question from the state: a suspended enrolment, one that has not begun or one that ran out closes the course whatever was decided about it. */
            available: boolean | null;
            /** Why not: suspended, notstarted or ended. Empty when it is available. */
            unavailablereason?: string | null;
            /** When their enrolment begins, on a course that has not opened yet */
            availablefrom?: number | null;
            /** When their enrolment ended, on a course that has run out */
            availableuntil?: number | null;
            /** What the student may do with it, empty when nothing was decided */
            state: string | null;
            /** Why, when the state needs saying */
            reason?: string | null;
            /** When it opens for them */
            timestart?: number | null;
            /** When it closes for them */
            timeend?: number | null;
            /** Whether it tracks completion at all */
            completiontracking: boolean | null;
            /** Whether there is progress to show */
            hasprogress: boolean | null;
            /** How far through it they are, as a percentage */
            progresspercent: number | null;
            /** How many of its activities count */
            trackedactivities: number | null;
            /** How many of those are done */
            completedactivities: number | null;
            /** Its activities, in the order the course shows them */
            modules: Array<{
                /** The activity, as this site knows it */
                cmid: number | null;
                /** Whether the student has done it */
                completed: boolean | null;
                /** Where it sits in the course, from one */
                position: number | null;
                /** Where it opens, empty when it cannot be opened */
                url: string | null;
            }>;
        }>;
    };
    /** One section per programme the student is on */
    programs: Array<{
        /** Whether activity strips are included */
        modulesloaded?: boolean | null;
        /** Activities added since the last course visit */
        newactivities?: number | null;
        /** Grades updated since the last course visit */
        correctedactivities?: number | null;
        /** The course, as the campus knows it */
        courseidnumber: string | null;
        /** The course, as this site knows it */
        courseid: number | null;
        /** What this site calls it */
        fullname: string | null;
        /** Its short name on this site */
        shortname: string | null;
        /** Where the student opens it, empty when nowhere */
        url: string | null;
        /** Whether anything has been decided about it. False means the student is on the course and nobody has ruled on it yet: it is shown, it is open, and they may go in. It is not the same as a course that is closed to them. */
        hasstate: boolean | null;
        /** Whether their enrolment lets them into it at all. A different question from the state: a suspended enrolment, one that has not begun or one that ran out closes the course whatever was decided about it. */
        available: boolean | null;
        /** Why not: suspended, notstarted or ended. Empty when it is available. */
        unavailablereason?: string | null;
        /** When their enrolment begins, on a course that has not opened yet */
        availablefrom?: number | null;
        /** When their enrolment ended, on a course that has run out */
        availableuntil?: number | null;
        /** What the student may do with it, empty when nothing was decided */
        state: string | null;
        /** Why, when the state needs saying */
        reason?: string | null;
        /** When it opens for them */
        timestart?: number | null;
        /** When it closes for them */
        timeend?: number | null;
        /** Whether it tracks completion at all */
        completiontracking: boolean | null;
        /** Whether there is progress to show */
        hasprogress: boolean | null;
        /** How far through it they are, as a percentage */
        progresspercent: number | null;
        /** How many of its activities count */
        trackedactivities: number | null;
        /** How many of those are done */
        completedactivities: number | null;
        /** Its activities, in the order the course shows them */
        modules: Array<{
            /** The activity, as this site knows it */
            cmid: number | null;
            /** Whether the student has done it */
            completed: boolean | null;
            /** Where it sits in the course, from one */
            position: number | null;
            /** Where it opens, empty when it cannot be opened */
            url: string | null;
        }>;
        /** Whether any of its subjects can be finished */
        hasglobalprogress: boolean | null;
        /** Subjects finished over subjects that can be, as a percentage */
        globalprogresspercent: number | null;
        /** How many of its subjects can be finished */
        coursestotal: number | null;
        /** How many of those are finished */
        coursescomplete: number | null;
        /** The subjects of it the student is on, in the order they are studied */
        subjects: Array<{
            /** Whether activity strips are included */
            modulesloaded?: boolean | null;
            /** Activities added since the last course visit */
            newactivities?: number | null;
            /** Grades updated since the last course visit */
            correctedactivities?: number | null;
            /** The course, as the campus knows it */
            courseidnumber: string | null;
            /** The course, as this site knows it */
            courseid: number | null;
            /** What this site calls it */
            fullname: string | null;
            /** Its short name on this site */
            shortname: string | null;
            /** Where the student opens it, empty when nowhere */
            url: string | null;
            /** Whether anything has been decided about it. False means the student is on the course and nobody has ruled on it yet: it is shown, it is open, and they may go in. It is not the same as a course that is closed to them. */
            hasstate: boolean | null;
            /** Whether their enrolment lets them into it at all. A different question from the state: a suspended enrolment, one that has not begun or one that ran out closes the course whatever was decided about it. */
            available: boolean | null;
            /** Why not: suspended, notstarted or ended. Empty when it is available. */
            unavailablereason?: string | null;
            /** When their enrolment begins, on a course that has not opened yet */
            availablefrom?: number | null;
            /** When their enrolment ended, on a course that has run out */
            availableuntil?: number | null;
            /** What the student may do with it, empty when nothing was decided */
            state: string | null;
            /** Why, when the state needs saying */
            reason?: string | null;
            /** When it opens for them */
            timestart?: number | null;
            /** When it closes for them */
            timeend?: number | null;
            /** Whether it tracks completion at all */
            completiontracking: boolean | null;
            /** Whether there is progress to show */
            hasprogress: boolean | null;
            /** How far through it they are, as a percentage */
            progresspercent: number | null;
            /** How many of its activities count */
            trackedactivities: number | null;
            /** How many of those are done */
            completedactivities: number | null;
            /** Its activities, in the order the course shows them */
            modules: Array<{
                /** The activity, as this site knows it */
                cmid: number | null;
                /** Whether the student has done it */
                completed: boolean | null;
                /** Where it sits in the course, from one */
                position: number | null;
                /** Where it opens, empty when it cannot be opened */
                url: string | null;
            }>;
            /** Where it sits in the programme */
            position?: number | null;
        }>;
    }>;
    /** Everything that is neither induction nor a programme */
    other: {
        /** Whether anything in it can be finished */
        hasprogress: boolean | null;
        /** Courses finished over courses that can be, as a percentage */
        progresspercent: number | null;
        /** How many of its courses can be finished */
        coursestotal: number | null;
        /** How many of those are finished */
        coursescomplete: number | null;
        courses: Array<{
            /** Whether activity strips are included */
            modulesloaded?: boolean | null;
            /** Activities added since the last course visit */
            newactivities?: number | null;
            /** Grades updated since the last course visit */
            correctedactivities?: number | null;
            /** The course, as the campus knows it */
            courseidnumber: string | null;
            /** The course, as this site knows it */
            courseid: number | null;
            /** What this site calls it */
            fullname: string | null;
            /** Its short name on this site */
            shortname: string | null;
            /** Where the student opens it, empty when nowhere */
            url: string | null;
            /** Whether anything has been decided about it. False means the student is on the course and nobody has ruled on it yet: it is shown, it is open, and they may go in. It is not the same as a course that is closed to them. */
            hasstate: boolean | null;
            /** Whether their enrolment lets them into it at all. A different question from the state: a suspended enrolment, one that has not begun or one that ran out closes the course whatever was decided about it. */
            available: boolean | null;
            /** Why not: suspended, notstarted or ended. Empty when it is available. */
            unavailablereason?: string | null;
            /** When their enrolment begins, on a course that has not opened yet */
            availablefrom?: number | null;
            /** When their enrolment ended, on a course that has run out */
            availableuntil?: number | null;
            /** What the student may do with it, empty when nothing was decided */
            state: string | null;
            /** Why, when the state needs saying */
            reason?: string | null;
            /** When it opens for them */
            timestart?: number | null;
            /** When it closes for them */
            timeend?: number | null;
            /** Whether it tracks completion at all */
            completiontracking: boolean | null;
            /** Whether there is progress to show */
            hasprogress: boolean | null;
            /** How far through it they are, as a percentage */
            progresspercent: number | null;
            /** How many of its activities count */
            trackedactivities: number | null;
            /** How many of those are done */
            completedactivities: number | null;
            /** Its activities, in the order the course shows them */
            modules: Array<{
                /** The activity, as this site knows it */
                cmid: number | null;
                /** Whether the student has done it */
                completed: boolean | null;
                /** Where it sits in the course, from one */
                position: number | null;
                /** Where it opens, empty when it cannot be opened */
                url: string | null;
            }>;
        }>;
    };
}

export type LocalCoursestateGetStudentCoursesReturn = LocalCoursestateGetStudentCoursesReturns;
export type local_coursestate_get_student_courses_returns = LocalCoursestateGetStudentCoursesReturns;
