import { toFullPascalCase } from "../resolver/path-resolver";
import {
    WebServiceSchema,
    WebServiceReturnSchema,
    WebServiceValueSchema,
    WebServiceObjectSchema,
    WebServiceArraySchema,
} from "../interfaces/generator.interfaces";

/**
 * Formats a single-line or multi-line JSDoc comment.
 */
function formatJsDoc(description?: string, indent: string = ""): string {
    if (!description || description.trim().length === 0) {
        return "";
    }

    const lines = description.trim().split("\n");
    if (lines.length === 1) {
        return `${indent}/** ${lines[0]} */\n`;
    }

    const body = lines.map((line) => `${indent} * ${line}`).join("\n");
    return `${indent}/**\n${body}\n${indent} */\n`;
}

/**
 * Resolves TypeScript primitive scalar type from value schema.
 */
function resolvePrimitiveType(schema: WebServiceValueSchema): string {
    if (schema.primitiveType) {
        return schema.primitiveType;
    }

    const typeUpper = (schema.type || "").toUpperCase();
    if (
        typeUpper.includes("INT") ||
        typeUpper.includes("FLOAT") ||
        typeUpper.includes("NUMBER")
    ) {
        return "number";
    }

    if (typeUpper.includes("BOOL")) {
        return "boolean";
    }

    return "string";
}

/**
 * Recursively generates TypeScript type definition string from schema node.
 */
function renderTypeNode(schema: WebServiceReturnSchema, indentLevel: number = 1): string {
    const indent = "    ".repeat(indentLevel);
    const prevIndent = "    ".repeat(Math.max(0, indentLevel - 1));

    let typeStr = "unknown";

    if (schema.kind === "value") {
        typeStr = resolvePrimitiveType(schema as WebServiceValueSchema);
    } else if (schema.kind === "array") {
        const arraySchema = schema as WebServiceArraySchema;
        const innerType = renderTypeNode(arraySchema.content, indentLevel);
        typeStr = innerType.includes("\n") || innerType.includes(";") ? `Array<${innerType}>` : `${innerType}[]`;
    } else if (schema.kind === "object" || schema.kind === "parameters") {
        const objSchema = schema as WebServiceObjectSchema;
        const keys = objSchema.keys || {};
        const entries = Object.entries(keys);

        if (entries.length === 0) {
            typeStr = "Record<string, unknown>";
        } else {
            const props = entries
                .map(([propName, childSchema]) => {
                    const jsdoc = formatJsDoc(childSchema.description, indent);
                    const isOptional = childSchema.required !== 1;
                    const optMark = isOptional ? "?" : "";
                    const rendered = renderTypeNode(childSchema, indentLevel + 1);
                    return `${jsdoc}${indent}${propName}${optMark}: ${rendered};`;
                })
                .join("\n");

            typeStr = `{\n${props}\n${prevIndent}}`;
        }
    }

    if (schema.allownull) {
        typeStr = `${typeStr} | null`;
    }

    return typeStr;
}

/**
 * Checks whether a parameters schema has at least one required field.
 */
export function hasRequiredParameters(schema: WebServiceSchema): boolean {
    if (!schema.parameters || !schema.parameters.keys) {
        return false;
    }

    return Object.values(schema.parameters.keys).some((child) => child.required === 1);
}

/**
 * Emits full TypeScript code for a single webservice definition.
 *
 * @param {WebServiceSchema} schema - Extracted webservice schema
 * @returns {string} TypeScript source code for the webservice
 */
export function emitWebserviceCode(schema: WebServiceSchema): string {
    const pascalName = toFullPascalCase(schema.name);
    const serviceJsDoc = formatJsDoc(schema.description);

    // 1. Emit Parameters Interface
    let paramsBody = "";
    if (schema.parameters && schema.parameters.keys && Object.keys(schema.parameters.keys).length > 0) {
        paramsBody = Object.entries(schema.parameters.keys)
            .map(([propName, childSchema]) => {
                const jsdoc = formatJsDoc(childSchema.description, "    ");
                const isOptional = childSchema.required !== 1;
                const optMark = isOptional ? "?" : "";
                const rendered = renderTypeNode(childSchema, 2);
                return `${jsdoc}    ${propName}${optMark}: ${rendered};`;
            })
            .join("\n");
    }

    const paramsInterface =
        paramsBody.length > 0
            ? `export interface ${pascalName}Params {\n${paramsBody}\n}`
            : `export interface ${pascalName}Params {}`;

    // 2. Emit Returns Type / Interface
    const returnsJsDoc = formatJsDoc(schema.returns?.description);
    let returnsDeclaration = "";
    if (schema.returns && (schema.returns.kind === "object" || (schema.returns as any).keys)) {
        const objSchema = schema.returns as WebServiceObjectSchema;
        const keys = objSchema.keys || {};
        const entries = Object.entries(keys);

        if (entries.length > 0) {
            const body = entries
                .map(([propName, childSchema]) => {
                    const jsdoc = formatJsDoc(childSchema.description, "    ");
                    const isOptional = childSchema.required !== 1;
                    const optMark = isOptional ? "?" : "";
                    const rendered = renderTypeNode(childSchema, 2);
                    return `${jsdoc}    ${propName}${optMark}: ${rendered};`;
                })
                .join("\n");
            returnsDeclaration = `${returnsJsDoc}export interface ${pascalName}Returns {\n${body}\n}`;
        } else {
            returnsDeclaration = `${returnsJsDoc}export interface ${pascalName}Returns {}`;
        }
    } else if (schema.returns) {
        const rendered = renderTypeNode(schema.returns, 1);
        returnsDeclaration = `${returnsJsDoc}export type ${pascalName}Returns = ${rendered};`;
    } else {
        returnsDeclaration = `${returnsJsDoc}export type ${pascalName}Returns = unknown;`;
    }

    // 3. Convenience Aliases
    const aliases = [
        `export type ${pascalName}Return = ${pascalName}Returns;`,
        `export type ${schema.name}_returns = ${pascalName}Returns;`,
    ].join("\n");

    return `${serviceJsDoc}${paramsInterface}\n\n${returnsDeclaration}\n\n${aliases}\n`;
}
