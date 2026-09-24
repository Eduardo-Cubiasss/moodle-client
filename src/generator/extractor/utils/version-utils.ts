/**
 * Sanitizes a version string by stripping leading 'v' and whitespace.
 *
 * @param {string} version - Raw version string.
 * @returns {string} Cleaned string.
 */
function cleanVersionString(version: string): string {
    if (!version) {
        return '';
    }
    return version.trim().replace(/^v/i, '');
}

/**
 * Parses a single version segment into a safe non-negative integer.
 *
 * @param {string} part - String segment.
 * @returns {number} Parsed integer.
 */
function parseSegment(part: string): number {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : num;
}

/**
 * Splits a version string into an array of numeric components.
 *
 * @example
 * ```ts
 * parseVersionParts('2.0.10'); // returns [2, 0, 10]
 * parseVersionParts('4.5');    // returns [4, 5]
 * ```
 *
 * @param {string} version - Semantic version string.
 * @returns {number[]} Array of numeric version components.
 */
export function parseVersionParts(version: string): number[] {
    const clean = cleanVersionString(version);
    if (clean.length === 0) {
        return [];
    }
    return clean.split('.').map(parseSegment);
}

/**
 * Safely extracts a numeric segment at a given index, defaulting to 0.
 *
 * @param {number[]} parts - Version parts array.
 * @param {number} index - Target index.
 * @returns {number} Segment number.
 */
function getSegmentAt(parts: number[], index: number): number {
    if (index < parts.length) {
        return parts[index] ?? 0;
    }
    return 0;
}

/**
 * Compares two single numeric components.
 *
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} 1 if a > b, -1 if a < b, 0 if equal.
 */
function compareNumbers(a: number, b: number): number {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
}

/**
 * Compares corresponding segments of two version parts at a given position.
 *
 * @param {number[]} parts1 - First version parts.
 * @param {number[]} parts2 - Second version parts.
 * @param {number} index - Index to compare.
 * @returns {number} Comparison result.
 */
function compareSegmentsAt(parts1: number[], parts2: number[], index: number): number {
    const num1 = getSegmentAt(parts1, index);
    const num2 = getSegmentAt(parts2, index);
    return compareNumbers(num1, num2);
}

/**
 * Compares two semantic version strings numerically segment by segment (3-point format).
 *
 * @example
 * ```ts
 * compareVersions('2.0.10', '2.0.2'); // returns 1 (since 10 > 2)
 * compareVersions('3.8.0', '3.11.2'); // returns -1 (since 8 < 11)
 * compareVersions('4.5', '4.5.0');    // returns 0
 * ```
 *
 * @param {string} v1 - First version string.
 * @param {string} v2 - Second version string.
 * @returns {number} 1 if v1 > v2, -1 if v1 < v2, 0 if v1 === v2.
 */
export function compareVersions(v1: string, v2: string): number {
    const p1 = parseVersionParts(v1);
    const p2 = parseVersionParts(v2);
    const maxLen = Math.max(p1.length, p2.length, 3);

    for (let i = 0; i < maxLen; i++) {
        const diff = compareSegmentsAt(p1, p2, i);
        if (diff !== 0) {
            return diff;
        }
    }
    return 0;
}

/**
 * Checks whether version v1 is greater than or equal to version v2.
 *
 * @example
 * ```ts
 * isVersionGreaterOrEqual('4.5.0', '3.8.0'); // returns true
 * isVersionGreaterOrEqual('2.5.9', '2.6.0'); // returns false
 * ```
 *
 * @param {string} v1 - Candidate version string.
 * @param {string} v2 - Target boundary version string.
 * @returns {boolean} True if v1 >= v2.
 */
export function isVersionGreaterOrEqual(v1: string, v2: string): boolean {
    return compareVersions(v1, v2) >= 0;
}

/**
 * Validates whether a version string matches standard numeric dot-notation.
 *
 * @param {string} version - Version string to validate.
 * @returns {boolean} True if valid.
 */
export function isValidVersionString(version: string): boolean {
    if (!version) {
        return false;
    }
    return /^\d+\.\d+(?:\.\d+)?/.test(version.trim());
}

/**
 * Normalizes a version string into 3-point format, padding missing parts with 0 (e.g. '3.2' -> '3.2.0').
 *
 * @example
 * ```ts
 * normalizeVersion('3.2');   // returns '3.2.0'
 * normalizeVersion('4.0.1'); // returns '4.0.1'
 * normalizeVersion('5.0');   // returns '5.0.0'
 * ```
 *
 * @param {string} version - Input version string.
 * @returns {string} Normalized 3-point version string.
 */
export function normalizeVersion(version: string): string {
    const parts = parseVersionParts(version);
    if (parts.length === 0) {
        return version;
    }
    while (parts.length < 3) {
        parts.push(0);
    }
    return parts.join('.');
}
