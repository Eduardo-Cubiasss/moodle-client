/**
 * One client, several functions.
 *
 * The site, the token and the default method are settled once at
 * construction, so each call only names the function it wants. This is the
 * shape to reach for whenever more than one call goes to the same site.
 */
import { MoodleClient } from "@didactika/moodle-client";

async function main() {
    const moodle = new MoodleClient({
        rootURL: process.env.MOODLE_URL!,
        token: process.env.MOODLE_TOKEN!,
    });

    // --- Approach 1: Direct typed methods (Recommended) ---
    // Strongly typed parameters and return values out of the box

    // 1. No parameters required:
    const courses = await moodle.webservice.core_course_get_courses();
    console.log(`${courses.data.length} courses on the site`);

    // 2. Nested parameters: automatically serialized to options[ids][0]=2&options[ids][1]=3
    const some = await moodle.webservice.core_course_get_courses({
        options: { ids: [2, 3] },
    });
    // some.data is automatically typed as CoreCourseGetCoursesReturns
    console.log(some.data.map((course) => course.fullname));

    // 3. Array of objects: serialized to criteria[0][key]=email&criteria[0][value]=...
    const users = await moodle.webservice.core_user_get_users({
        criteria: [{ key: "email", value: "%@example.org" }],
    });
    console.log(`${users.data.users.length} users matched`);

    // --- Approach 2: Dynamic call() method ---
    // Ideal when the function name is dynamic or calling plugins without pre-generated types
    const dynamicCourses = await moodle.call("core_course_get_courses", {
        options: { ids: [2, 3] },
    });
    console.log(`${dynamicCourses.data.length} courses via .call()`);

    // A client can carry a different default method, and any single call can
    // still override it.
    const reader = new MoodleClient({
        rootURL: process.env.MOODLE_URL!,
        token: process.env.MOODLE_TOKEN!,
        method: "GET",
    });

    await reader.webservice.core_course_get_courses();
}

main().catch(console.error);
