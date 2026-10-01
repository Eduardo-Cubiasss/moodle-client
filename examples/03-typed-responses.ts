/**
 * Strongly-typed responses: Direct methods vs call<T>().
 *
 * Direct methods (`moodle.webservice.*`) come with rich TypeScript types
 * generated directly from Moodle's schema definitions: parameters and return
 * values are automatically typed without any manual declarations.
 *
 * When using the dynamic `moodle.call()`, the body defaults to `any`. You can
 * pass a type argument `call<T>()` to describe the shape you expect.
 */
import { MoodleClient } from "@didactika/moodle-client";

// Used when defining custom shapes with dynamic call<T>()
interface CustomCourse {
    id: number;
    fullname: string;
    shortname: string;
    categoryid: number;
    visible: number;
}

async function main() {
    const moodle = new MoodleClient({
        rootURL: process.env.MOODLE_URL!,
        token: process.env.MOODLE_TOKEN!,
    });

    // 1. Direct typed method:
    // Automatic full typing from bundled Moodle 4.5 schemas
    const site = await moodle.webservice.core_webservice_get_site_info();
    // site.data is fully typed (CoreWebserviceGetSiteInfoReturns)
    console.log(`${site.data.username} on ${site.data.sitename} (Moodle ${site.data.release})`);

    // 2. Direct typed method with typed parameters:
    const courses = await moodle.webservice.core_course_get_courses({
        options: { ids: [1, 2] },
    });
    // courses.data is fully typed as CoreCourseGetCoursesReturns
    const visibleCourses = courses.data.filter((c) => c.visible === 1);
    console.log(visibleCourses.map((c) => `${c.shortname} — ${c.fullname}`));

    // 3. Dynamic call<T>() with custom type argument:
    const { data: customData } = await moodle.call<CustomCourse[]>("core_course_get_courses");
    console.log(`Retrieved ${customData.length} courses via call<CustomCourse[]>()`);

    // The response carries HTTP metadata too, typed as it is on native fetch:
    console.log(site.status, site.ok, site.headers.get("content-type"));
}

main().catch(console.error);
