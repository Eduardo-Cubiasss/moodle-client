import { describe, it, expect } from "vitest";
import { emitBarrelCode } from "../../../src/generator/emitter/barrel-emitter";

describe("Barrel & Declaration Merging Emitter", () => {
    it("should emit index.ts with re-exports, GeneratedMoodleServices and declare module", () => {
        const services = [
            {
                name: "core_course_get_courses",
                relativeImportPath: "./core/course/get_courses.webservice-client",
                hasRequiredParams: false,
                description: "Return course details",
            },
            {
                name: "core_user_create_users",
                relativeImportPath: "./core/user/create_users.webservice-client",
                hasRequiredParams: true,
                description: "Create users",
            },
        ];

        const barrelCode = emitBarrelCode(services);

        // Verifica exportaciones de los módulos individuales
        expect(barrelCode).toContain("export * from './core/course/get_courses.webservice-client'");
        expect(barrelCode).toContain("export * from './core/user/create_users.webservice-client'");

        // Verifica la interfaz agregada de servicios
        expect(barrelCode).toContain("export interface GeneratedMoodleServices");

        // Sin parámetros obligatorios -> params es opcional (params?: ...)
        expect(barrelCode).toContain(
            "core_course_get_courses(params?: CoreCourseGetCoursesParams, method?: HttpMethod): Promise<MoodleResponse<CoreCourseGetCoursesReturns>>"
        );

        // Con parámetros obligatorios -> params es obligatorio (params: ...)
        expect(barrelCode).toContain(
            "core_user_create_users(params: CoreUserCreateUsersParams, method?: HttpMethod): Promise<MoodleResponse<CoreUserCreateUsersReturns>>"
        );

        // Verifica el Declaration Merging
        expect(barrelCode).toContain('declare module "@didactika/moodle-client"');
        expect(barrelCode).toContain("interface MoodleClient extends GeneratedMoodleServices");
    });
});
