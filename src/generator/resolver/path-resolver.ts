/**
 * Converts exact snake_case Moodle webservice names to full PascalCase without shortening.
 * Example: `core_course_get_courses` -> `CoreCourseGetCourses`
 *
 * @param {string} name - Webservice snake_case name
 * @returns {string} Exact full PascalCase name
 */
export function toFullPascalCase(name: string): string {
    return name
        .split("_")
        .filter((part) => part.length > 0)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

/**
 * Dynamically resolves a Moodle webservice name into its organized hierarchical file path.
 * Splitting is 100% dynamic without hardcoded whitelists:
 * - 3 or more segments: category/subcategory/action.webservice-client.ts
 * - 2 segments: category/action.webservice-client.ts
 * - 1 segment: action.webservice-client.ts
 *
 * Examples:
 * - `core_course_get_courses` -> `core/course/get_courses.webservice-client.ts`
 * - `mod_quiz_get_user_attempts` -> `mod/quiz/get_user_attempts.webservice-client.ts`
 * - `gradereport_user_get_grade_items` -> `gradereport/user/get_grade_items.webservice-client.ts`
 * - `local_custom_sync_users` -> `local/custom/sync_users.webservice-client.ts`
 *
 * @param {string} webserviceName - The Moodle webservice function name
 * @returns {string} Relative path for the generated webservice file
 */
export function resolveWebserviceFilePath(webserviceName: string): string {
    const parts = webserviceName.split("_").filter((p) => p.length > 0);

    if (parts.length >= 3) {
        const category = parts[0];
        const subcategory = parts[1];
        const action = parts.slice(2).join("_");
        return `${category}/${subcategory}/${action}.webservice-client.d.ts`;
    }

    if (parts.length === 2) {
        return `${parts[0]}/${parts[1]}.webservice-client.d.ts`;
    }

    return `${webserviceName}.webservice-client.d.ts`;
}
