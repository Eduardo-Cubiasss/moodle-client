/**
 * Typing the body instead of living with `any`.
 *
 * The client cannot know what any given Moodle function returns, so the
 * body defaults to `any`. Describe the part you actually use and pass it as
 * a type argument — nothing is validated at runtime, this is a claim you are
 * making about the site's answer, not a check.
 */
import { MoodleClient } from "@didactika/moodle-client";

interface Course {
    id: number;
    fullname: string;
    shortname: string;
    categoryid: number;
    visible: number;
}

interface SiteInfo {
    sitename: string;
    username: string;
    userid: number;
    release: string;
}

const moodle = new MoodleClient({
    rootURL: process.env.MOODLE_URL!,
    token: process.env.MOODLE_TOKEN!,
});

const { data: courses } = await moodle.call<Course[]>("core_course_get_courses");

// courses is Course[], so this is checked
const visible = courses.filter((course) => course.visible === 1);
console.log(visible.map((course) => `${course.shortname} — ${course.fullname}`));

const site = await moodle.call<SiteInfo>("core_webservice_get_site_info");
console.log(`${site.data.username} on ${site.data.sitename}`);

// The response carries the HTTP side too, typed as it is on fetch.
console.log(site.status, site.ok, site.headers.get("content-type"));
