import { describe, it, expect, vi } from "vitest";
import { MoodleClient } from "../../../src/client/moodle-client";

describe("MoodleClient Dynamic Method Proxy with Namespaces", () => {
    it("should route webservice method calls through configuration namespace (e.g. client.legacy.core_course_get_courses)", async () => {
        const client = new MoodleClient({
            rootURL: "https://moodle.example.org",
            token: "test-token",
        });

        const callSpy = vi.spyOn(client, "call").mockResolvedValue({
            data: [{ id: 1, fullname: "Math 101" }],
            status: 200,
            statusText: "OK",
            ok: true,
            headers: new Headers(),
        } as any);

        const response = await (client as any).legacy.core_course_get_courses({
            options: { ids: [1] },
        });

        expect(callSpy).toHaveBeenCalledWith(
            "core_course_get_courses",
            { options: { ids: [1] } },
            undefined
        );
        expect(response.data[0].fullname).toBe("Math 101");
    });

    it("should route webservice method calls through another namespace (e.g. client.default.core_webservice_get_site_info)", async () => {
        const client = new MoodleClient({
            rootURL: "https://moodle.example.org",
            token: "test-token",
        });

        const callSpy = vi.spyOn(client, "call").mockResolvedValue({
            data: { sitename: "Campus Virtual" },
            status: 200,
            statusText: "OK",
            ok: true,
            headers: new Headers(),
        } as any);

        const response = await (client as any).default.core_webservice_get_site_info();

        expect(callSpy).toHaveBeenCalledWith(
            "core_webservice_get_site_info",
            undefined,
            undefined
        );
        expect(response.data.sitename).toBe("Campus Virtual");
    });

    it("should cache namespace proxy instances (referential equality)", () => {
        const client = new MoodleClient({
            rootURL: "https://moodle.example.org",
            token: "test-token",
        });

        const proxy1 = (client as any).legacy;
        const proxy2 = (client as any).legacy;
        expect(proxy1).toBe(proxy2);
    });

    it("should preserve direct MoodleClient class methods and properties without treating them as namespaces", () => {
        const client = new MoodleClient({
            rootURL: "https://moodle.example.org",
            token: "test-token",
        });

        expect(typeof client.call).toBe("function");
        expect(typeof (client as any).endpoint).toBe("object");
    });
});
