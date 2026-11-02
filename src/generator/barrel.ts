import { BUNDLED_MOODLE_VERSION, BUNDLED_NAMESPACE } from "./interfaces/config.interfaces";

export { BUNDLED_NAMESPACE };

/**
 * Builds the barrels that expose the generated namespaces on MoodleClient. Shared by the generator
 * (each run rewrites dist/schemas/index.d.ts and the outDir barrels), scripts/bundle-schemas.ts and
 * scripts/postbuild.mjs, which imports the compiled dist/generator/barrel module so the barrel
 * shipped in the package is the same one the CLI writes.
 */

function toPascalCase(str: string): string {
    return str
        .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
        .replace(/^\w/, (c) => c.toUpperCase());
}

/** JSDoc source line of the bundled namespace, shared with scripts/bundle-schemas.ts. */
export function bundledSourceDescription(): string {
    return `bundled with @didactika/moodle-client (Moodle ${BUNDLED_MOODLE_VERSION})`;
}

export interface BarrelNamespace {
    namespace: string;
    /** Shown in the JSDoc of the namespace property */
    source: string;
}

/**
 * Builds the source of a master barrel exposing the given namespaces on MoodleClient.
 * It declares GeneratedMoodleServices itself, so the `declare module` block that merges it into
 * MoodleClient always finds the name.
 */
export function buildMasterBarrel(namespaces: BarrelNamespace[]): string {
    const typeName = (ns: string) => `${toPascalCase(ns)}GeneratedServices`;
    let dts = `/**\n * Master barrel for generated Moodle services namespaces.\n */\n`;
    for (const { namespace } of namespaces) {
        dts += `import type { GeneratedMoodleServices as ${typeName(namespace)} } from "./${namespace}/index";\n`;
    }
    dts += `\nexport type {\n`;
    for (const { namespace } of namespaces) {
        dts += `    ${typeName(namespace)},\n`;
    }
    dts += `};\n`;
    dts += `\n// Namespace type barrels\n`;
    for (const { namespace } of namespaces) {
        dts += `export type * as ${namespace} from "./${namespace}/index";\n`;
    }
    dts += `\nexport interface GeneratedMoodleServices {\n`;
    for (const { namespace, source } of namespaces) {
        dts += `    /**\n     * Moodle web services namespace '${namespace}'.\n     * Source: ${source}\n     */\n`;
        dts += `    ${namespace}: ${typeName(namespace)};\n`;
    }
    dts += `}\n\n`;
    dts += `declare module "@didactika/moodle-client" {\n`;
    dts += `    interface MoodleClient extends GeneratedMoodleServices {}\n`;
    dts += `}\n`;
    return dts;
}
