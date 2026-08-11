import { describe, expect, it } from "vitest";
import { MoodleResponse } from "../../../src/client/moodle-response";
import { AccessException } from "../../../src/errors/access-exception-error";
import { BadRequestError } from "../../../src/errors/bad-request-error";
import { InvalidParameter } from "../../../src/errors/invalid-parameter-error";
import { InvalidRecord } from "../../../src/errors/invalid-record-error";
import { InvalidToken } from "../../../src/errors/invalid-token-error";
import { MoodleException } from "../../../src/errors/moodle-exception-error";
import { URLError } from "../../../src/errors/url-error";
import type { IMoodleResponse } from "../../../src/types/core";

const answer = <T>(data: T, init: Partial<IMoodleResponse<T>> = {}) =>
    new MoodleResponse<T>({
        data,
        status: 200,
        statusText: "OK",
        ok: true,
        headers: new Headers(),
        ...init,
    });

describe("MoodleResponse.from", () => {
    it("parses a JSON body", async () => {
        const res = await MoodleResponse.from(
            new Response(JSON.stringify([{ id: 1 }]), {
                status: 200,
                headers: { "content-type": "application/json" },
            }),
        );

        expect(res.data).toEqual([{ id: 1 }]);
        expect(res.ok).toBe(true);
        expect(res.status).toBe(200);
    });

    it("keeps a body that is not JSON as the text it was", async () => {
        const res = await MoodleResponse.from(
            new Response("<html>maintenance</html>", {
                status: 503,
                headers: { "content-type": "text/html" },
            }),
        );

        expect(res.data).toBe("<html>maintenance</html>");
        expect(res.ok).toBe(false);
    });

    it("survives an empty body", async () => {
        const res = await MoodleResponse.from(new Response("", { status: 200 }));

        expect(res.data).toBe("");
    });

    // 204 and friends are null-body statuses: Response refuses to be built
    // with any body at all, so this is the only way the case can arise.
    it("survives a status that carries no body", async () => {
        const res = await MoodleResponse.from(new Response(null, { status: 204 }));

        expect(res.data).toBe("");
        expect(res.ok).toBe(true);
    });
});

describe("MoodleResponse.isMoodleError", () => {
    it("is true only when the body carries an errorcode", () => {
        expect(answer({ errorcode: "invalidtoken" }).isMoodleError).toBe(true);
        expect(answer([{ id: 1 }]).isMoodleError).toBe(false);
        expect(answer(null).isMoodleError).toBe(false);
        expect(answer("<html>").isMoodleError).toBe(false);
    });
});

describe("MoodleResponse.throwOnMoodleError", () => {
    it("hands back a successful response untouched", () => {
        const res = answer([{ id: 1, fullname: "Maths" }]);

        expect(res.throwOnMoodleError()).toBe(res);
    });

    it("does not inspect a null body", () => {
        expect(() => answer(null).throwOnMoodleError()).not.toThrow();
    });

    it.each<[string, new (debugInfo?: string) => Error]>([
        ["invalidparameter", InvalidParameter],
        ["accessexception", AccessException],
        ["invalidtoken", InvalidToken],
        ["invalidrecord", InvalidRecord],
    ])("maps %s to its own error", (errorcode, expected) => {
        expect(() => answer({ errorcode }).throwOnMoodleError()).toThrow(expected);
    });

    it("carries Moodle's debuginfo onto the thrown error", () => {
        try {
            answer({ errorcode: "invalidtoken", debuginfo: "token expired" }).throwOnMoodleError();
            expect.unreachable("it should have thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidToken);
            expect((error as InvalidToken).debugInfo).toBe("token expired");
        }
    });

    it("maps an unrecognised errorcode flagged as a moodle_exception", () => {
        try {
            answer(
                {
                    errorcode: "cannotviewcourse",
                    exception: "moodle_exception",
                    message: "You cannot view this course",
                },
                { status: 500, ok: false },
            ).throwOnMoodleError();
            expect.unreachable("it should have thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(MoodleException);
            // The site's own status travels with the error rather than being
            // flattened into a generic one.
            expect((error as MoodleException).status).toBe(500);
            expect((error as MoodleException).message).toBe("You cannot view this course");
        }
    });

    it("falls back to a bad request for anything else", () => {
        expect(() => answer({ errorcode: "somethingelse" }).throwOnMoodleError()).toThrow(
            BadRequestError,
        );
    });

    it("raises URLError on a failing status with no Moodle error in it", () => {
        expect(() =>
            answer("<html>404</html>", {
                status: 404,
                ok: false,
                statusText: "Not Found",
            }).throwOnMoodleError(),
        ).toThrow(URLError);
    });

    it("prefers Moodle's own error over URLError when both could apply", () => {
        expect(() =>
            answer({ errorcode: "invalidtoken" }, { status: 403, ok: false }).throwOnMoodleError(),
        ).toThrow(InvalidToken);
    });
});
