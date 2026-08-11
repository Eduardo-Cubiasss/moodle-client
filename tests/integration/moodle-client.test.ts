import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { InvalidToken, MoodleException, moodleClient, URLError } from "../../src";
import { startMoodleStub, type MoodleStub } from "../helpers/moodle-server";

const TOKEN = "aeb315e6dd3affc18352fe46124cdd48";
const FUNCTION = "core_course_get_courses";

let stub: MoodleStub;

const call = (
    content: object,
    method?: "GET" | "POST" | "PUT" | "DELETE",
): Promise<unknown> =>
    moodleClient({
        urlRequest: { rootURL: stub.rootURL, token: TOKEN, webServiceFunction: FUNCTION },
        content,
        ...(method ? { method } : {}),
    });

beforeEach(async () => {
    stub = await startMoodleStub();
});

afterEach(async () => {
    await stub.close();
});

describe("the request that goes out", () => {
    it("posts by default, to the site's own path", async () => {
        await call({ options: { ids: [1, 2] } });
        const req = stub.lastRequest();

        expect(req.method).toBe("POST");
        expect(req.path).toBe("/moodle/webservice/rest/server.php");
    });

    it("authenticates through the query string", async () => {
        await call({});
        const req = stub.lastRequest();

        expect(req.query.get("wstoken")).toBe(TOKEN);
        expect(req.query.get("wsfunction")).toBe(FUNCTION);
        expect(req.query.get("moodlewsrestformat")).toBe("json");
    });

    it("sends the content urlencoded, not as multipart", async () => {
        await call({ options: { ids: [1, 2] } });
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
        await call({ options: { ids: [7] } }, "GET");
        const req = stub.lastRequest();

        expect(req.method).toBe("GET");
        expect(req.body).toBe("");
        expect(req.query.get("options[ids][0]")).toBe("7");
        expect(req.query.get("wstoken")).toBe(TOKEN);
    });

    it("still sends a body on the other write methods", async () => {
        await call({ courseid: 3 }, "PUT");
        const req = stub.lastRequest();

        expect(req.method).toBe("PUT");
        expect(Object.fromEntries(new URLSearchParams(req.body))).toEqual({ courseid: "3" });
    });
});

describe("the response that comes back", () => {
    it("exposes the parsed body plus the status", async () => {
        stub.reply({ body: [{ id: 1, fullname: "Maths" }] });

        const res = await moodleClient<{ id: number; fullname: string }[]>({
            urlRequest: { rootURL: stub.rootURL, token: TOKEN, webServiceFunction: FUNCTION },
            content: {},
        });

        expect(res.data).toEqual([{ id: 1, fullname: "Maths" }]);
        expect(res.status).toBe(200);
        expect(res.ok).toBe(true);
        expect(res.headers.get("content-type")).toContain("application/json");
    });

    it("hands back a non-JSON body as the text it was", async () => {
        stub.reply({ body: "<html>maintenance</html>", contentType: "text/html" });

        const res = await call({});

        expect((res as { data: unknown }).data).toBe("<html>maintenance</html>");
    });
});

describe("what it throws", () => {
    it("raises the matching error for a Moodle errorcode", async () => {
        stub.reply({ body: { errorcode: "invalidtoken", debuginfo: "token expired" } });

        await expect(call({})).rejects.toThrow(InvalidToken);
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

        await expect(call({})).rejects.toMatchObject({
            name: "moodleException",
            status: 500,
            message: "You cannot view this course",
        });
        await expect(call({})).rejects.toBeInstanceOf(MoodleException);
    });

    it("raises URLError on a failing status that is not a Moodle error", async () => {
        stub.reply({ status: 404, body: "<html>not found</html>", contentType: "text/html" });

        await expect(call({})).rejects.toThrow(URLError);
    });

    it("raises URLError when the site cannot be reached at all", async () => {
        const unreachable = await startMoodleStub();
        const rootURL = unreachable.rootURL;
        await unreachable.close();

        await expect(
            moodleClient({
                urlRequest: { rootURL, token: TOKEN, webServiceFunction: FUNCTION },
                content: {},
            }),
        ).rejects.toThrow(URLError);
    });
});
