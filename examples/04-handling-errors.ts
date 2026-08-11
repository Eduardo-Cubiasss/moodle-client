/**
 * Telling the failure cases apart.
 *
 * A failed call throws — it never resolves with an error object. Each Moodle
 * error code has its own class, so `instanceof` is enough to route them.
 */
import {
    AccessException,
    InvalidParameter,
    InvalidToken,
    MoodleClient,
    MoodleException,
    URLError,
} from "@didactika/moodle-client";

const moodle = new MoodleClient({
    rootURL: process.env.MOODLE_URL!,
    token: process.env.MOODLE_TOKEN!,
});

try {
    const { data } = await moodle.call("core_course_get_courses", {
        options: { ids: [1] },
    });

    // An empty result is not an error: the call succeeded, the site just has
    // nothing matching. Check for it yourself.
    if (data.length === 0) console.log("no courses matched");
    else console.log(data);
} catch (error) {
    if (error instanceof InvalidToken) {
        console.error("the token is wrong or has expired — reissue it");
    } else if (error instanceof AccessException) {
        console.error(
            "the token is valid, but its user lacks the capability, or the",
            "function is not on the external service the token belongs to",
        );
    } else if (error instanceof InvalidParameter) {
        console.error("Moodle rejected the parameters:", error.debugInfo);
    } else if (error instanceof URLError) {
        console.error("never reached the web service: wrong URL, site down, or a proxy");
    } else if (error instanceof MoodleException) {
        // The only one carrying the site's own status rather than a status
        // describing the kind of failure.
        console.error(`Moodle failed with ${error.status}: ${error.message}`);
        console.error("debug:", error.debugInfo ?? "(debugging is off on this site)");
    } else {
        throw error;
    }
}
