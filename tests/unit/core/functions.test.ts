import { describe, expect, it } from "vitest";
import { createFormattedObject, formatContent, getUrl } from "../../../src/core/functions";
import { URLError } from "../../../src/errors/url-error";
import type { IURLRequest } from "../../../src/types/core";

const urlRequest: IURLRequest = {
    rootURL: "http://localhost/moodle",
    token: "aeb315e6dd3affc18352fe46124cdd48",
    webServiceFunction: "core_course_get_courses",
};

describe("getUrl", () => {
    it("builds the REST endpoint under the site's own path", () => {
        const url = getUrl(urlRequest);

        expect(url.origin).toBe("http://localhost");
        expect(url.pathname).toBe("/moodle/webservice/rest/server.php");
    });

    it("carries the token, the function and the json format", () => {
        const url = getUrl(urlRequest);

        expect(url.searchParams.get("wstoken")).toBe(urlRequest.token);
        expect(url.searchParams.get("wsfunction")).toBe(urlRequest.webServiceFunction);
        expect(url.searchParams.get("moodlewsrestformat")).toBe("json");
    });

    it.each([
        ["http://localhost/moodle/", "one trailing slash"],
        ["http://localhost/moodle///", "several trailing slashes"],
    ])("trims %s (%s)", (rootURL) => {
        expect(getUrl({ ...urlRequest, rootURL }).pathname).toBe(
            "/moodle/webservice/rest/server.php",
        );
    });

    it("escapes reserved characters instead of corrupting the query string", () => {
        const url = getUrl({
            ...urlRequest,
            token: "tok&wsfunction=core_user_delete_users",
        });

        expect(url.searchParams.get("token")).toBeNull();
        expect(url.searchParams.get("wstoken")).toBe("tok&wsfunction=core_user_delete_users");
        expect(url.searchParams.get("wsfunction")).toBe("core_course_get_courses");
    });

    it("raises URLError when rootURL is not an absolute URL", () => {
        expect(() => getUrl({ ...urlRequest, rootURL: "not a url" })).toThrow(URLError);
    });

    it("raises URLError when rootURL trims down to nothing", () => {
        expect(() => getUrl({ ...urlRequest, rootURL: "///" })).toThrow(URLError);
    });
});

describe("createFormattedObject", () => {
    it("keeps a flat object as it is", () => {
        expect(createFormattedObject({ courseid: 4, shortname: "MATH" })).toEqual({
            courseid: "4",
            shortname: "MATH",
        });
    });

    it("nests keys the way Moodle expects", () => {
        expect(createFormattedObject({ options: { onlyactive: true } })).toEqual({
            "options[onlyactive]": "true",
        });
    });

    it("walks arrays through their indexes", () => {
        expect(createFormattedObject({ options: { ids: [1, 2, 3] } })).toEqual({
            "options[ids][0]": "1",
            "options[ids][1]": "2",
            "options[ids][2]": "3",
        });
    });

    it("goes as deep as the object does", () => {
        expect(createFormattedObject({ a: { b: { c: { d: "deep" } } } })).toEqual({
            "a[b][c][d]": "deep",
        });
    });

    it("drops undefined", () => {
        expect(createFormattedObject({ kept: 1, skipped: undefined })).toEqual({ kept: "1" });
    });

    // Regression: null reached the `typeof value === "object"` branch and
    // Object.entries(null) threw, so a single null anywhere in the payload
    // took the whole call down.
    it("drops null instead of throwing on it", () => {
        expect(() => createFormattedObject({ kept: 1, skipped: null })).not.toThrow();
        expect(createFormattedObject({ kept: 1, skipped: null })).toEqual({ kept: "1" });
    });

    it("drops null nested inside an object", () => {
        expect(createFormattedObject({ options: { ids: [1, null, 3] } })).toEqual({
            "options[ids][0]": "1",
            "options[ids][2]": "3",
        });
    });

    it("stringifies every scalar", () => {
        expect(createFormattedObject({ n: 42, t: true, f: false, s: "x" })).toEqual({
            n: "42",
            t: "true",
            f: "false",
            s: "x",
        });
    });

    it("returns nothing for an empty object", () => {
        expect(createFormattedObject({})).toEqual({});
    });
});

describe("formatContent", () => {
    it("produces the parameters for the documented example", () => {
        const params = formatContent({ options: { ids: [1, 2, 3] } });

        expect(params).toBeInstanceOf(URLSearchParams);
        expect(Object.fromEntries(params)).toEqual({
            "options[ids][0]": "1",
            "options[ids][1]": "2",
            "options[ids][2]": "3",
        });
    });

    it("percent-encodes the brackets on the wire", () => {
        expect(formatContent({ options: { onlyactive: true } }).toString()).toBe(
            "options%5Bonlyactive%5D=true",
        );
    });

    it("stays empty for an empty payload", () => {
        expect(formatContent({}).toString()).toBe("");
    });
});
