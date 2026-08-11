import { describe, expect, it } from "vitest";
import { MoodleEndpoint } from "../../../src/client/moodle-endpoint";
import { URLError } from "../../../src/errors/url-error";

const TOKEN = "aeb315e6dd3affc18352fe46124cdd48";
const FUNCTION = "core_course_get_courses";

const endpoint = (rootURL = "http://localhost/moodle") => new MoodleEndpoint(rootURL, TOKEN);

describe("MoodleEndpoint", () => {
    it("builds the REST url under the site's own path", () => {
        const url = endpoint().urlFor(FUNCTION);

        expect(url.origin).toBe("http://localhost");
        expect(url.pathname).toBe("/moodle/webservice/rest/server.php");
    });

    it("carries the token, the function and the json format", () => {
        const url = endpoint().urlFor(FUNCTION);

        expect(url.searchParams.get("wstoken")).toBe(TOKEN);
        expect(url.searchParams.get("wsfunction")).toBe(FUNCTION);
        expect(url.searchParams.get("moodlewsrestformat")).toBe("json");
    });

    it("serves more than one function from the same instance", () => {
        const moodle = endpoint();

        expect(moodle.urlFor("core_user_get_users").searchParams.get("wsfunction")).toBe(
            "core_user_get_users",
        );
        expect(moodle.urlFor(FUNCTION).searchParams.get("wsfunction")).toBe(FUNCTION);
    });

    it.each([
        ["http://localhost/moodle/", "one trailing slash"],
        ["http://localhost/moodle///", "several trailing slashes"],
    ])("trims %s (%s)", (rootURL) => {
        expect(endpoint(rootURL).urlFor(FUNCTION).pathname).toBe(
            "/moodle/webservice/rest/server.php",
        );
    });

    it("escapes reserved characters instead of corrupting the query string", () => {
        const url = new MoodleEndpoint(
            "http://localhost/moodle",
            "tok&wsfunction=core_user_delete_users",
        ).urlFor(FUNCTION);

        expect(url.searchParams.get("wstoken")).toBe("tok&wsfunction=core_user_delete_users");
        expect(url.searchParams.get("wsfunction")).toBe(FUNCTION);
    });

    it("raises URLError when the site url is not absolute", () => {
        expect(() => endpoint("not a url").urlFor(FUNCTION)).toThrow(URLError);
    });

    it("raises URLError when the site url trims down to nothing", () => {
        expect(() => endpoint("///").urlFor(FUNCTION)).toThrow(URLError);
    });
});
