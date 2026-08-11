import { describe, expect, it } from "vitest";
import { RequestContent } from "../../../src/client/request-content";

const flatten = (source: object) => new RequestContent(source).toObject();

describe("RequestContent.toObject", () => {
    it("keeps a flat object as it is", () => {
        expect(flatten({ courseid: 4, shortname: "MATH" })).toEqual({
            courseid: "4",
            shortname: "MATH",
        });
    });

    it("nests keys the way Moodle expects", () => {
        expect(flatten({ options: { onlyactive: true } })).toEqual({
            "options[onlyactive]": "true",
        });
    });

    it("walks arrays through their indexes", () => {
        expect(flatten({ options: { ids: [1, 2, 3] } })).toEqual({
            "options[ids][0]": "1",
            "options[ids][1]": "2",
            "options[ids][2]": "3",
        });
    });

    it("goes as deep as the object does", () => {
        expect(flatten({ a: { b: { c: { d: "deep" } } } })).toEqual({ "a[b][c][d]": "deep" });
    });

    it("drops undefined", () => {
        expect(flatten({ kept: 1, skipped: undefined })).toEqual({ kept: "1" });
    });

    // Regression: null reached the `typeof value === "object"` branch and
    // Object.entries(null) threw, so a single null anywhere in the payload
    // took the whole call down.
    it("drops null instead of throwing on it", () => {
        expect(() => flatten({ kept: 1, skipped: null })).not.toThrow();
        expect(flatten({ kept: 1, skipped: null })).toEqual({ kept: "1" });
    });

    it("drops null nested inside an array", () => {
        expect(flatten({ options: { ids: [1, null, 3] } })).toEqual({
            "options[ids][0]": "1",
            "options[ids][2]": "3",
        });
    });

    it("stringifies every scalar", () => {
        expect(flatten({ n: 42, t: true, f: false, s: "x" })).toEqual({
            n: "42",
            t: "true",
            f: "false",
            s: "x",
        });
    });

    it("defaults to an empty payload", () => {
        expect(new RequestContent().toObject()).toEqual({});
    });
});

describe("RequestContent.toSearchParams", () => {
    it("produces the parameters for the documented example", () => {
        const params = new RequestContent({ options: { ids: [1, 2, 3] } }).toSearchParams();

        expect(params).toBeInstanceOf(URLSearchParams);
        expect(Object.fromEntries(params)).toEqual({
            "options[ids][0]": "1",
            "options[ids][1]": "2",
            "options[ids][2]": "3",
        });
    });

    it("percent-encodes the brackets on the wire", () => {
        expect(new RequestContent({ options: { onlyactive: true } }).toSearchParams().toString()).toBe(
            "options%5Bonlyactive%5D=true",
        );
    });
});

describe("RequestContent.appendTo", () => {
    it("adds the pairs without disturbing what the url already carries", () => {
        const url = new URL("http://localhost/moodle/webservice/rest/server.php?wstoken=abc");

        new RequestContent({ options: { ids: [7] } }).appendTo(url);

        expect(url.searchParams.get("wstoken")).toBe("abc");
        expect(url.searchParams.get("options[ids][0]")).toBe("7");
    });
});

describe("RequestContent.isEmpty", () => {
    it("is true when there is nothing to send", () => {
        expect(new RequestContent({}).isEmpty).toBe(true);
        expect(new RequestContent({ dropped: null }).isEmpty).toBe(true);
    });

    it("is false as soon as one value survives", () => {
        expect(new RequestContent({ kept: 0 }).isEmpty).toBe(false);
    });
});
