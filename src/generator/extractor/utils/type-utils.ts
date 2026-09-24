/**
 * Primitive scalar data type classification corresponding to JavaScript/JSON primitives.
 */
export type PrimitiveType = 'string' | 'number' | 'boolean';

/**
 * Known numeric Moodle parameter type identifiers.
 */
const NUMERIC_TYPES = new Set([
    'int',
    'integer',
    'float',
    'number',
    'param_int',
    'param_integer',
    'param_float',
    'param_number'
]);

/**
 * Known boolean Moodle parameter type identifiers.
 */
const BOOLEAN_TYPES = new Set([
    'bool',
    'boolean',
    'param_bool',
    'param_boolean'
]);

/**
 * Matches normalized type against numeric or boolean type sets.
 *
 * @param {string} normalized - Normalized type name.
 * @returns {PrimitiveType | null} Resolved primitive type or null.
 */
function matchNonStringType(normalized: string): PrimitiveType | null {
    if (NUMERIC_TYPES.has(normalized)) {
        return 'number';
    }
    if (BOOLEAN_TYPES.has(normalized)) {
        return 'boolean';
    }
    return null;
}

/**
 * Resolves the corresponding TypeScript primitive type name from a Moodle parameter definition.
 *
 * Moodle parameters are categorized as:
 * - PARAM_INT, PARAM_FLOAT, int, float -> mapped to numeric primitives (`number`)
 * - PARAM_BOOL -> cast to boolean (`boolean`)
 * - All other PARAM_* types (text, notags, raw, plugin, etc.) -> processed as strings (`string`)
 *
 * @example
 * ```ts
 * resolvePrimitiveType('int');       // returns 'number'
 * resolvePrimitiveType('notags');    // returns 'string'
 * resolvePrimitiveType('bool');      // returns 'boolean'
 * resolvePrimitiveType('PARAM_INT'); // returns 'number'
 * ```
 *
 * @param {string | unknown} moodleType - Moodle parameter type identifier.
 * @returns {PrimitiveType} Primitive type ('string' | 'number' | 'boolean').
 */
export function resolvePrimitiveType(moodleType?: unknown): PrimitiveType {
    if (typeof moodleType !== 'string') {
        return 'string';
    }

    const normalized = moodleType.trim().toLowerCase();
    return matchNonStringType(normalized) ?? 'string';
}
