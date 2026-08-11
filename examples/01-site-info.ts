/**
 * The smallest call there is.
 *
 * `core_webservice_get_site_info` takes no parameters and reports which user
 * the token belongs to, so one successful run confirms the site URL, the
 * REST protocol and the token all at once. Start here when something is not
 * working.
 */
import { MoodleClient } from "@didactika/moodle-client";

const moodle = new MoodleClient({
    rootURL: process.env.MOODLE_URL!,
    token: process.env.MOODLE_TOKEN!,
});

const { data } = await moodle.call("core_webservice_get_site_info");

console.log("site:      ", data.sitename);
console.log("connected: ", data.fullname, `(${data.username})`);
console.log("release:   ", data.release);
console.log("functions: ", data.functions.length, "available to this token");
