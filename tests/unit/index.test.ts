import { describe, expect, it } from "vitest";
import * as publicApi from "../../src";

// The package now ships only dist/, so the deep paths that used to exist by
// accident (".../lib/errors/invalid-token-error") are gone. Anything a
// consumer needs to catch an error or type a request has to be reachable
// from the entry point, and stay reachable.
describe("public API", () => {
    it("exposes the client", () => {
        expect(typeof publicApi.moodleClient).toBe("function");
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
            "MoodleException",
            "URLError",
            "moodleClient",
        ]);
    });
});
