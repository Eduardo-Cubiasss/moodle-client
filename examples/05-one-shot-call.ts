/**
 * `moodleClient()`, without keeping a client around.
 *
 * This is the shape the package shipped with, and it is not going away: it
 * goes through exactly the same path as the class and throws exactly the
 * same errors. Use it for a single call; use `MoodleClient` as soon as there
 * is a second one, so the site and token are stated once instead of per call.
 */
import { moodleClient } from "@didactika/moodle-client";

const urlRequest = {
    rootURL: process.env.MOODLE_URL!,
    token: process.env.MOODLE_TOKEN!,
    webServiceFunction: "core_course_get_courses",
};

const response = await moodleClient({
    urlRequest,
    content: { options: { ids: [1, 2, 3] } },
});

console.log(response.status, response.data);

// GET puts the parameters in the query string, which is where PHP reads them
// from. Anything other than GET and HEAD sends a urlencoded body.
const viaGet = await moodleClient({
    urlRequest,
    content: { options: { ids: [1] } },
    method: "GET",
});

console.log(viaGet.data);
