import { toFullPascalCase } from "../resolver/path-resolver";
import { GeneratedServiceMetadata } from "../interfaces/generator.interfaces";

/**
 * Emits central barrel file (index.ts) that re-exports all generated webservice types
 * and injects them into MoodleClient via TypeScript declaration merging.
 *
 * @param {GeneratedServiceMetadata[]} services - List of all emitted webservices metadata
 * @returns {string} Source code for index.ts
 */
export function emitBarrelCode(services: GeneratedServiceMetadata[]): string {
    const lines: string[] = [];

    lines.push('import type { MoodleResponse, HttpMethod } from "@didactika/moodle-client";');

    // 1. Re-export all webservice files
    for (const service of services) {
        lines.push(`export * from '${service.relativeImportPath}';`);
    }

    lines.push("");

    // 2. Import types for GeneratedMoodleServices interface
    for (const service of services) {
        const pascal = toFullPascalCase(service.name);
        lines.push(
            `import type { ${pascal}Params, ${pascal}Returns } from '${service.relativeImportPath}';`
        );
    }

    lines.push("");

    // 3. GeneratedMoodleServices interface
    lines.push("/**");
    lines.push(" * Typed Moodle Web Service operations available on MoodleClient.");
    lines.push(" */");
    lines.push("export interface GeneratedMoodleServices {");

    for (const service of services) {
        const pascal = toFullPascalCase(service.name);
        if (service.description) {
            lines.push(`    /** ${service.description.replace(/\n/g, " ")} */`);
        }
        const optParam = service.hasRequiredParams ? "" : "?";
        lines.push(
            `    ${service.name}(params${optParam}: ${pascal}Params, method?: HttpMethod): Promise<MoodleResponse<${pascal}Returns>>;`
        );
    }

    lines.push("}");
    lines.push("");

    // 4. Declaration Merging with MoodleClient
    lines.push('declare module "@didactika/moodle-client" {');
    lines.push("    interface MoodleClient extends GeneratedMoodleServices {}");
    lines.push("}");
    lines.push("");

    return lines.join("\n");
}
