import { toFullPascalCase } from "../resolver/path-resolver";
import { GeneratedServiceMetadata } from "../interfaces/generator.interfaces";

/**
 * Formats a multi-line JSDoc block for a generated webservice method.
 *
 * @param {GeneratedServiceMetadata} service - Service metadata
 * @param {string} pascalName - PascalCase name of the webservice
 * @returns {string[]} Array of lines for the JSDoc comment
 */
function formatMethodJsDoc(service: GeneratedServiceMetadata, pascalName: string): string[] {
    const docLines: string[] = [];
    docLines.push("    /**");

    if (service.description && service.description.trim().length > 0) {
        const descLines = service.description.trim().split("\n");
        for (const dl of descLines) {
            docLines.push(`     * ${dl.trim()}`);
        }
        docLines.push("     *");
    }

    const paramTag = service.hasRequiredParams
        ? `     * @param {${pascalName}Params} params`
        : `     * @param {${pascalName}Params} [params]`;
    const paramDesc = service.paramsDescription && service.paramsDescription.trim().length > 0
        ? ` - ${service.paramsDescription.replace(/\n/g, " ").trim()}`
        : "";
    docLines.push(`${paramTag}${paramDesc}`);

    docLines.push("     * @param {HttpMethod} [method] - Optional HTTP method override ('GET' | 'POST')");

    const returnDesc = service.returnsDescription && service.returnsDescription.trim().length > 0
        ? ` - ${service.returnsDescription.replace(/\n/g, " ").trim()}`
        : "";
    docLines.push(`     * @returns {Promise<MoodleResponse<${pascalName}Returns>>}${returnDesc}`);

    docLines.push("     */");
    return docLines;
}

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
        lines.push(...formatMethodJsDoc(service, pascal));
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
