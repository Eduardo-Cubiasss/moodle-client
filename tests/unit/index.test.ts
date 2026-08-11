import { describe, expect, it } from "vitest";
import * as publicApi from "../../src";

// The package ships only dist/, so the deep import paths that used to exist
// by accident (".../lib/errors/invalid-token-error") are gone. Anything a
// consumer needs to make a call, type it or catch its errors has to be
// reachable from the entry point, and stay reachable.
describe("public API", () => {
    it("exposes both ways of making a call", () => {
        expect(typeof publicApi.MoodleClient).toBe("function");
        expect(typeof publicApi.moodleClient).toBe("function");
    });

    it("exposes the response class", () => {
        expect(typeof publicApi.MoodleResponse).toBe("function");
    });

    it.each([
        "AccessException",
        "BadRequestError",
        "InvalidParameter",
        "InvalidRecord",
        "InvalidToken",
        "MoodleException",
        "URLError",
    ])("exposes %s so it can be caught by type", (name) => {
        expect(typeof publicApi[name as keyof typeof publicApi]).toBe("function");
    });

    it("exposes nothing else", () => {
        expect(Object.keys(publicApi).sort()).toEqual([
            "AccessException",
            "BadRequestError",
            "InvalidParameter",
            "InvalidRecord",
            "InvalidToken",
            "MoodleClient",
            "MoodleException",
            "MoodleResponse",
            "URLError",
            "moodleClient",
        ]);
    });
});
