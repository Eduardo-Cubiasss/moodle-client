import { describe, expect, it } from "vitest";
import { findError } from "../../../src/errors/error-handler";
import { AccessException } from "../../../src/errors/access-exception-error";
import { BadRequestError } from "../../../src/errors/bad-request-error";
import { InvalidParameter } from "../../../src/errors/invalid-parameter-error";
import { InvalidRecord } from "../../../src/errors/invalid-record-error";
import { InvalidToken } from "../../../src/errors/invalid-token-error";
import { MoodleException } from "../../../src/errors/moodle-exception-error";
import { URLError } from "../../../src/errors/url-error";
import type { IMoodleResponse } from "../../../src/types/core";

const response = <T>(data: T, init: Partial<IMoodleResponse<T>> = {}): IMoodleResponse<T> => ({
    data,
    status: 200,
    statusText: "OK",
    ok: true,
    headers: new Headers(),
    ...init,
});

describe("findError", () => {
    it("hands back a successful response untouched", () => {
        const res = response([{ id: 1, fullname: "Maths" }]);

        expect(findError(res)).toBe(res);
    });

    it("hands back a null body without inspecting it", () => {
        expect(() => findError(response(null))).not.toThrow();
    });

    it("hands back a non-object body without inspecting it", () => {
        expect(findError(response("<html>maintenance</html>")).data).toBe(
            "<html>maintenance</html>",
        );
    });

    it.each<[string, new (debugInfo?: string) => Error]>([
        ["invalidparameter", InvalidParameter],
        ["accessexception", AccessException],
        ["invalidtoken", InvalidToken],
        ["invalidrecord", InvalidRecord],
    ])("maps %s to its own error", (errorcode, expected) => {
        expect(() => findError(response({ errorcode }))).toThrow(expected);
    });

    it("carries Moodle's debuginfo onto the thrown error", () => {
        try {
            findError(response({ errorcode: "invalidtoken", debuginfo: "token expired" }));
            expect.unreachable("findError should have thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidToken);
            expect((error as InvalidToken).debugInfo).toBe("token expired");
        }
    });

    it("maps an unrecognised errorcode flagged as a moodle_exception", () => {
        try {
            findError(
                response(
                    {
                        errorcode: "cannotviewcourse",
                        exception: "moodle_exception",
                        message: "You cannot view this course",
                    },
                    { status: 500, ok: false },
                ),
            );
            expect.unreachable("findError should have thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(MoodleException);
            // The site's own status travels with the error rather than being
            // flattened into a generic one.
            expect((error as MoodleException).status).toBe(500);
            expect((error as MoodleException).message).toBe("You cannot view this course");
        }
    });

    it("falls back to a bad request for anything else", () => {
        expect(() => findError(response({ errorcode: "somethingelse" }))).toThrow(BadRequestError);
    });

    // axios rejected every non-2xx and the old client reported that as a
    // URLError. fetch resolves them instead, so the check is explicit now.
    it("raises URLError on a failing status with no Moodle error in it", () => {
        expect(() =>
            findError(response("<html>404</html>", { status: 404, ok: false, statusText: "Not Found" })),
        ).toThrow(URLError);
    });

    it("prefers Moodle's own error over URLError when both could apply", () => {
        expect(() =>
            findError(response({ errorcode: "invalidtoken" }, { status: 403, ok: false })),
        ).toThrow(InvalidToken);
    });
});
