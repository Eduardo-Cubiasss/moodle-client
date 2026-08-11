import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
    InvalidToken,
    MoodleClient,
    MoodleException,
    MoodleResponse,
    moodleClient,
    URLError,
} from "../../src";
import { startMoodleStub, type MoodleStub } from "../helpers/moodle-server";

const TOKEN = "aeb315e6dd3affc18352fe46124cdd48";
const FUNCTION = "core_course_get_courses";

let stub: MoodleStub;
let moodle: MoodleClient;

beforeEach(async () => {
    stub = await startMoodleStub();
    moodle = new MoodleClient({ rootURL: stub.rootURL, token: TOKEN });
});

afterEach(async () => {
    await stub.close();
});

describe("the request that goes out", () => {
    it("posts by default, to the site's own path", async () => {
        await moodle.call(FUNCTION, { options: { ids: [1, 2] } });
        const req = stub.lastRequest();

        expect(req.method).toBe("POST");
        expect(req.path).toBe("/moodle/webservice/rest/server.php");
    });

    it("authenticates through the query string", async () => {
        await moodle.call(FUNCTION);
        const req = stub.lastRequest();

        expect(req.query.get("wstoken")).toBe(TOKEN);
        expect(req.query.get("wsfunction")).toBe(FUNCTION);
        expect(req.query.get("moodlewsrestformat")).toBe("json");
    });

    it("sends the content urlencoded, not as multipart", async () => {
        await moodle.call(FUNCTION, { options: { ids: [1, 2] } });
        const req = stub.lastRequest();

        expect(req.headers["content-type"]).toContain("application/x-www-form-urlencoded");
        expect(Object.fromEntries(new URLSearchParams(req.body))).toEqual({
            "options[ids][0]": "1",
            "options[ids][1]": "2",
        });
    });

    // The old client handed the parameters to axios as a GET body. PHP never
    // reads a body into $_GET, so every non-POST call arrived at Moodle with
    // no parameters at all and nobody noticed.
    it("puts the parameters in the query string on GET, where PHP reads them", async () => {
        await moodle.call(FUNCTION, { options: { ids: [7] } }, "GET");
        const req = stub.lastRequest();

        expect(req.method).toBe("GET");
        expect(req.body).toBe("");
        expect(req.query.get("options[ids][0]")).toBe("7");
        expect(req.query.get("wstoken")).toBe(TOKEN);
    });

    it("still sends a body on the other write methods", async () => {
        await moodle.call(FUNCTION, { courseid: 3 }, "PUT");
        const req = stub.lastRequest();

        expect(req.method).toBe("PUT");
        expect(Object.fromEntries(new URLSearchParams(req.body))).toEqual({ courseid: "3" });
    });
});

describe("a client built once and reused", () => {
    it("keeps the site and the token across calls", async () => {
        await moodle.call("core_user_get_users");
        await moodle.call("core_course_get_courses");

        expect(stub.requests).toHaveLength(2);
        expect(stub.requests[0]?.query.get("wsfunction")).toBe("core_user_get_users");
        expect(stub.requests[1]?.query.get("wsfunction")).toBe("core_course_get_courses");
        for (const req of stub.requests) expect(req.query.get("wstoken")).toBe(TOKEN);
    });

    it("takes a default method that each call can still override", async () => {
        const reader = new MoodleClient({ rootURL: stub.rootURL, token: TOKEN, method: "GET" });

        await reader.call(FUNCTION, { a: 1 });
        expect(stub.lastRequest().method).toBe("GET");

        await reader.call(FUNCTION, { a: 1 }, "POST");
        expect(stub.lastRequest().method).toBe("POST");
    });
});

describe("the response that comes back", () => {
    it("exposes the parsed body plus the status", async () => {
        stub.reply({ body: [{ id: 1, fullname: "Maths" }] });

        const res = await moodle.call<{ id: number; fullname: string }[]>(FUNCTION);

        expect(res).toBeInstanceOf(MoodleResponse);
        expect(res.data).toEqual([{ id: 1, fullname: "Maths" }]);
        expect(res.status).toBe(200);
        expect(res.ok).toBe(true);
        expect(res.headers.get("content-type")).toContain("application/json");
    });

    it("hands back a non-JSON body as the text it was", async () => {
        stub.reply({ body: "<html>maintenance</html>", contentType: "text/html" });

        expect((await moodle.call(FUNCTION)).data).toBe("<html>maintenance</html>");
    });
});

describe("what it throws", () => {
    it("raises the matching error for a Moodle errorcode", async () => {
        stub.reply({ body: { errorcode: "invalidtoken", debuginfo: "token expired" } });

        await expect(moodle.call(FUNCTION)).rejects.toThrow(InvalidToken);
    });

    it("raises a MoodleException carrying the site's own status", async () => {
        stub.reply({
            status: 500,
            body: {
                errorcode: "cannotviewcourse",
                exception: "moodle_exception",
                message: "You cannot view this course",
            },
        });

        await expect(moodle.call(FUNCTION)).rejects.toBeInstanceOf(MoodleException);
        await expect(moodle.call(FUNCTION)).rejects.toMatchObject({
            status: 500,
            message: "You cannot view this course",
        });
    });

    it("raises URLError on a failing status that is not a Moodle error", async () => {
        stub.reply({ status: 404, body: "<html>not found</html>", contentType: "text/html" });

        await expect(moodle.call(FUNCTION)).rejects.toThrow(URLError);
    });

    it("raises URLError when the site cannot be reached at all", async () => {
        const unreachable = await startMoodleStub();
        const rootURL = unreachable.rootURL;
        await unreachable.close();

        const dead = new MoodleClient({ rootURL, token: TOKEN });

        await expect(dead.call(FUNCTION)).rejects.toThrow(URLError);
    });
});

// The one-shot form is the shape the package shipped with, and 2.x consumers
// still call it. It has to keep going through exactly the same path.
describe("the moodleClient function", () => {
    it("makes the same request the class does", async () => {
        stub.reply({ body: [{ id: 1 }] });

        const res = await moodleClient({
            urlRequest: { rootURL: stub.rootURL, token: TOKEN, webServiceFunction: FUNCTION },
            content: { options: { ids: [1, 2] } },
        });
        const req = stub.lastRequest();

        expect(req.method).toBe("POST");
        expect(req.query.get("wsfunction")).toBe(FUNCTION);
        expect(Object.fromEntries(new URLSearchParams(req.body))).toEqual({
            "options[ids][0]": "1",
            "options[ids][1]": "2",
        });
        expect(res.data).toEqual([{ id: 1 }]);
    });

    it("honours the method it is given", async () => {
        await moodleClient({
            urlRequest: { rootURL: stub.rootURL, token: TOKEN, webServiceFunction: FUNCTION },
            content: { options: { ids: [7] } },
            method: "GET",
        });

        expect(stub.lastRequest().method).toBe("GET");
        expect(stub.lastRequest().query.get("options[ids][0]")).toBe("7");
    });

    it("throws the same errors", async () => {
        stub.reply({ body: { errorcode: "invalidtoken" } });

        await expect(
            moodleClient({
                urlRequest: { rootURL: stub.rootURL, token: TOKEN, webServiceFunction: FUNCTION },
                content: {},
            }),
        ).rejects.toThrow(InvalidToken);
    });
});
