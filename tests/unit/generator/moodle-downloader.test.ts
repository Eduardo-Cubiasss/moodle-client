import { describe, expect, it } from "vitest";
import {
    buildTarballUrl,
    hasNativeTar,
    resetNativeTarCheck,
    resolveLatestRemoteVersion,
} from "../../../src/generator/downloader/moodle-downloader";

describe("MoodleDownloader", () => {
    it("should build proper GitHub codeload tarball URL", () => {
        const url = buildTarballUrl("https://github.com/moodle/moodle.git", "v4.5.0");
        expect(url).toBe("https://codeload.github.com/moodle/moodle/tar.gz/refs/tags/v4.5.0");
    });

    it("should detect native tar capability and cache result", () => {
        resetNativeTarCheck();
        const available = hasNativeTar();
        expect(typeof available).toBe("boolean");
        // Cached call
        expect(hasNativeTar()).toBe(available);
    });

    it("should resolve fallback latest version", async () => {
        const version = await resolveLatestRemoteVersion();
        expect(version).toBe("4.5");
    });
});
