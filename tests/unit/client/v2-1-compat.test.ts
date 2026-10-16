import { describe, expect, expectTypeOf, it } from "vitest";
import {
    MoodleClient,
    MoodleResponse,
    moodleClient,
    type IMoodleResponse,
} from "../../../src/index";

/**
 * Code written against 2.1.0 must compile unchanged. This function is type-checked by
 * `npm run typecheck`; it is never executed, so no request is made.
 */
async function usageFrom2_1_0(moodle: MoodleClient) {
    // call() without a type argument: data is any, so its fields can be read directly
    const { data } = await moodle.call("core_webservice_get_site_info");
    expectTypeOf(data).toBeAny();
    const siteName: string = data.sitename;

    // moodleClient() without a type argument
    const legacy = await moodleClient({
        urlRequest: { rootURL: "https://moodle.example.org", token: "token", webServiceFunction: "core_course_get_courses" },
        content: {},
    });
    expectTypeOf(legacy.data).toBeAny();
    const firstCourseId: number = legacy.data[0].id;

    // MoodleResponse and IMoodleResponse without a type argument
    const asClass: MoodleResponse = legacy;
    const asInterface: IMoodleResponse = asClass;
    expectTypeOf(asInterface.data).toBeAny();

    // A type argument still narrows
    const typed = await moodle.call<{ id: number }[]>("core_course_get_courses");
    expectTypeOf(typed.data).toEqualTypeOf<{ id: number }[]>();

    return { siteName, firstCourseId, users: asInterface.data.users };
}

describe("compatibility with 2.1.0", () => {
    it("should type-check code written against 2.1.0 (checked by npm run typecheck)", () => {
        expect(typeof usageFrom2_1_0).toBe("function");
    });
});
