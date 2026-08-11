/**
 * One client, several functions.
 *
 * The site, the token and the default method are settled once at
 * construction, so each call only names the function it wants. This is the
 * shape to reach for whenever more than one call goes to the same site.
 */
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
    rootURL: process.env.MOODLE_URL!,
    token: process.env.MOODLE_TOKEN!,
});

// No parameters at all.
const courses = await moodle.call("core_course_get_courses");
console.log(`${courses.data.length} courses on the site`);

// Nested parameters: this goes out as options[ids][0]=2&options[ids][1]=3
const some = await moodle.call("core_course_get_courses", {
    options: { ids: [2, 3] },
});
console.log(some.data.map((course: { fullname: string }) => course.fullname));

// A list of objects flattens the same way:
// criteria[0][key]=email&criteria[0][value]=...
const users = await moodle.call("core_user_get_users", {
    criteria: [{ key: "email", value: "%@example.org" }],
});
console.log(`${users.data.users.length} users matched`);

// A client can carry a different default method, and any single call can
// still override it.
const reader = new MoodleClient({
    rootURL: process.env.MOODLE_URL!,
    token: process.env.MOODLE_TOKEN!,
    method: "GET",
});

await reader.call("core_course_get_courses");
