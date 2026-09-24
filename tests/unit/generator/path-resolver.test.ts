import { describe, it, expect } from "vitest";
import { resolveWebserviceFilePath, toFullPascalCase } from "../../../src/generator/resolver/path-resolver";

describe("Path Resolver & Naming Conventions", () => {
    describe("toFullPascalCase", () => {
        it("should convert exact snake_case Moodle webservice names to full PascalCase without shortening", () => {
            expect(toFullPascalCase("core_course_get_courses")).toBe("CoreCourseGetCourses");
            expect(toFullPascalCase("core_webservice_get_site_info")).toBe("CoreWebserviceGetSiteInfo");
            expect(toFullPascalCase("core_user_get_users")).toBe("CoreUserGetUsers");
            expect(toFullPascalCase("mod_assign_get_assignments")).toBe("ModAssignGetAssignments");
            expect(toFullPascalCase("gradereport_user_get_grade_items")).toBe("GradereportUserGetGradeItems");
            expect(toFullPascalCase("local_custom_sync_users")).toBe("LocalCustomSyncUsers");
        });
    });

    describe("resolveWebserviceFilePath", () => {
        it("should resolve core subsystems into core/<subsystem>/<action>.webservice-client.d.ts", () => {
            expect(resolveWebserviceFilePath("core_course_get_courses")).toBe(
                "core/course/get_courses.webservice-client.d.ts"
            );
            expect(resolveWebserviceFilePath("core_user_get_users")).toBe(
                "core/user/get_users.webservice-client.d.ts"
            );
            expect(resolveWebserviceFilePath("core_webservice_get_site_info")).toBe(
                "core/webservice/get_site_info.webservice-client.d.ts"
            );
            expect(resolveWebserviceFilePath("core_enrol_get_users_courses")).toBe(
                "core/enrol/get_users_courses.webservice-client.d.ts"
            );
        });

        it("should resolve activity modules into mod/<plugin>/<action>.webservice-client.d.ts", () => {
            expect(resolveWebserviceFilePath("mod_assign_get_assignments")).toBe(
                "mod/assign/get_assignments.webservice-client.d.ts"
            );
            expect(resolveWebserviceFilePath("mod_quiz_get_user_attempts")).toBe(
                "mod/quiz/get_user_attempts.webservice-client.d.ts"
            );
            expect(resolveWebserviceFilePath("mod_forum_get_forum_discussions")).toBe(
                "mod/forum/get_forum_discussions.webservice-client.d.ts"
            );
        });

        it("should resolve other Frankenstyle plugins (gradereport, local, enrol, tool, auth)", () => {
            expect(resolveWebserviceFilePath("gradereport_user_get_grade_items")).toBe(
                "gradereport/user/get_grade_items.webservice-client.d.ts"
            );
            expect(resolveWebserviceFilePath("local_custom_sync_users")).toBe(
                "local/custom/sync_users.webservice-client.d.ts"
            );
            expect(resolveWebserviceFilePath("tool_mobile_get_autologin_key")).toBe(
                "tool/mobile/get_autologin_key.webservice-client.d.ts"
            );
        });

        it("should handle custom or 2-segment names by splitting prefix and action", () => {
            expect(resolveWebserviceFilePath("custom_action")).toBe(
                "custom/action.webservice-client.d.ts"
            );
        });
    });
});
