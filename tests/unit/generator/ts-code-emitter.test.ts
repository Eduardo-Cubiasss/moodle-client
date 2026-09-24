import { describe, it, expect } from "vitest";
import { emitWebserviceCode } from "../../../src/generator/emitter/ts-code-emitter";

describe("TypeScript Code Emitter", () => {
    it("should emit strongly typed params and returns in full PascalCase", () => {
        const schema = {
            name: "core_course_get_courses",
            description: "Return course details",
            parameters: {
                kind: "parameters" as const,
                description: "parameters",
                keys: {
                    options: {
                        kind: "object" as const,
                        description: "options",
                        required: 2, // optional
                        keys: {
                            ids: {
                                kind: "array" as const,
                                description: "List of course id",
                                required: 2,
                                content: {
                                    kind: "value" as const,
                                    type: "PARAM_INT",
                                    primitiveType: "number" as const,
                                    description: "Course id",
                                },
                            },
                        },
                    },
                },
            },
            returns: {
                kind: "array" as const,
                description: "list of courses",
                content: {
                    kind: "object" as const,
                    description: "course record",
                    keys: {
                        id: {
                            kind: "value" as const,
                            type: "PARAM_INT",
                            primitiveType: "number" as const,
                            description: "course id",
                            required: 1,
                        },
                        fullname: {
                            kind: "value" as const,
                            type: "PARAM_TEXT",
                            primitiveType: "string" as const,
                            description: "full name",
                            required: 1,
                        },
                        summary: {
                            kind: "value" as const,
                            type: "PARAM_RAW",
                            primitiveType: "string" as const,
                            description: "summary",
                            required: 2,
                            allownull: true,
                        },
                    },
                },
            },
        };

        const code = emitWebserviceCode(schema);

        // Verifica nombre exacto en PascalCase sin acortar
        expect(code).toContain("export interface CoreCourseGetCoursesParams");
        expect(code).toContain("export type CoreCourseGetCoursesReturns");

        // Verifica aliases útiles
        expect(code).toContain("export type CoreCourseGetCoursesReturn = CoreCourseGetCoursesReturns");
        expect(code).toContain("export type core_course_get_courses_returns = CoreCourseGetCoursesReturns");

        // Verifica tipos y opcionalidad
        expect(code).toContain("options?:");
        expect(code).toContain("ids?: number[]");
        expect(code).toContain("id: number;");
        expect(code).toContain("fullname: string;");
        expect(code).toContain("summary?: string | null;");

        // Verifica JSDoc
        expect(code).toContain("* Return course details");
        expect(code).toContain("* List of course id");
    });

    it("should handle webservices with no parameters (e.g. core_webservice_get_site_info)", () => {
        const schema = {
            name: "core_webservice_get_site_info",
            description: "Return some site info",
            parameters: {
                kind: "parameters" as const,
                description: "",
                keys: {},
            },
            returns: {
                kind: "object" as const,
                description: "site info",
                keys: {
                    sitename: {
                        kind: "value" as const,
                        type: "PARAM_RAW",
                        primitiveType: "string" as const,
                        description: "site name",
                        required: 1,
                    },
                    username: {
                        kind: "value" as const,
                        type: "PARAM_RAW",
                        primitiveType: "string" as const,
                        description: "username",
                        required: 1,
                    },
                },
            },
        };

        const code = emitWebserviceCode(schema);

        expect(code).toContain("export interface CoreWebserviceGetSiteInfoParams");
        expect(code).toContain("export interface CoreWebserviceGetSiteInfoReturns");
        expect(code).toContain("sitename: string;");
        expect(code).toContain("username: string;");
    });
});
