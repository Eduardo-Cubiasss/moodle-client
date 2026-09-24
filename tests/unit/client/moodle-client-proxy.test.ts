import { describe, it, expect, vi } from "vitest";
import { MoodleClient } from "../../../src/client/moodle-client";

describe("MoodleClient Dynamic Method Proxy", () => {
    it("should route arbitrary webservice method calls directly to client.call()", async () => {
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

        // Invocación dinámica como método de instancia
        const response = await (client as any).core_course_get_courses({
            options: { ids: [1] },
        });

        expect(callSpy).toHaveBeenCalledWith(
            "core_course_get_courses",
            { options: { ids: [1] } },
            undefined
        );
        expect(response.data[0].fullname).toBe("Math 101");
    });

    it("should allow calling methods without parameters", async () => {
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

        const response = await (client as any).core_webservice_get_site_info();

        expect(callSpy).toHaveBeenCalledWith(
            "core_webservice_get_site_info",
            undefined,
            undefined
        );
        expect(response.data.sitename).toBe("Campus Virtual");
    });
});
