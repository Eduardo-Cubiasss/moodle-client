import { describe, expect, it } from "vitest";
import { AccessException } from "../../../src/errors/access-exception-error";
import { BadRequestError } from "../../../src/errors/bad-request-error";
import { InvalidParameter } from "../../../src/errors/invalid-parameter-error";
import { InvalidRecord } from "../../../src/errors/invalid-record-error";
import { InvalidToken } from "../../../src/errors/invalid-token-error";
import { MoodleException } from "../../../src/errors/moodle-exception-error";
import { URLError } from "../../../src/errors/url-error";

interface MoodleClientError extends Error {
    readonly status: number;
    readonly debugInfo?: string;
}

/** Every error that is built the same way: an optional debuginfo, nothing else. */
const debugInfoErrors: [string, new (debugInfo?: string) => MoodleClientError, string, number][] = [
    ["AccessException", AccessException, "accessException", 403],
    ["BadRequestError", BadRequestError, "badRequest", 400],
    ["InvalidParameter", InvalidParameter, "invalidParameter", 400],
    ["InvalidRecord", InvalidRecord, "invalidRecord", 404],
    ["InvalidToken", InvalidToken, "invalidToken", 401],
];

describe.each(debugInfoErrors)("%s", (_label, ErrorClass, name, status) => {
    it("is a real Error, so instanceof and catch behave", () => {
        expect(new ErrorClass()).toBeInstanceOf(Error);
    });

    it(`is named ${name} and carries status ${status}`, () => {
        const error = new ErrorClass();

        expect(error.name).toBe(name);
        expect(error.status).toBe(status);
    });

    it("says something useful without any debug info", () => {
        const error = new ErrorClass();

        expect(error.message.length).toBeGreaterThan(0);
        expect(error.debugInfo).toBeUndefined();
    });

    it("keeps the debug info when Moodle sent some", () => {
        expect(new ErrorClass("something went wrong").debugInfo).toBe("something went wrong");
    });
});

describe("MoodleException", () => {
    it("takes the status and the message from the site", () => {
        const error = new MoodleException(503, "Site is in maintenance mode");

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("moodleException");
        expect(error.status).toBe(503);
        expect(error.message).toBe("Site is in maintenance mode");
        expect(error.debugInfo).toBeUndefined();
    });

    it("keeps the debug info when Moodle sent some", () => {
        expect(new MoodleException(500, "boom", "stack trace").debugInfo).toBe("stack trace");
    });
});

describe("URLError", () => {
    it("reports a missing URL and takes no arguments", () => {
        const error = new URLError();

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("urlError");
        expect(error.message).toBe("URL not found");
        expect(error.status).toBe(404);
    });
});
