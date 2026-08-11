import { IURLRequest } from "../types/core";
import { URLError } from "../errors/url-error";

/**
 * Build the web service endpoint for a request.
 *
 * Values go through `URLSearchParams`, so a token or function name carrying
 * a reserved character is escaped instead of corrupting the query string.
 * @param {IURLRequest} dataUrl data url request
 * @returns {URL} endpoint with its query parameters
 * @throws {URLError} when rootURL is not a valid absolute URL
 */
export const getUrl = (dataUrl: IURLRequest): URL => {
    // Trailing slashes are trimmed by scanning backwards rather than with a
    // `/\/+$/` replace: that pattern backtracks from every position on a
    // string of many slashes, which is a polynomial ReDoS on caller input.
    let end = dataUrl.rootURL.length;
    while (end > 0 && dataUrl.rootURL[end - 1] === "/") end--;
    const root = dataUrl.rootURL.slice(0, end);

    let url: URL;
    try {
        url = new URL(`${root}/webservice/rest/server.php`);
    } catch {
        throw new URLError();
    }

    url.searchParams.set("wstoken", dataUrl.token);
    url.searchParams.set("wsfunction", dataUrl.webServiceFunction);
    url.searchParams.set("moodlewsrestformat", "json");

    return url;
};

/**
 * Flatten a nested value into Moodle's `parent[child][grandchild]` keys.
 * @param {object} source current level being walked
 * @param {string} prefix key path accumulated so far, empty at the root
 * @param {Record<string, string>} out accumulator receiving the flat pairs
 */
const flatten = (source: object, prefix: string, out: Record<string, string>): void => {
    for (const [key, value] of Object.entries(source)) {
        // null and undefined are both dropped: Moodle has no representation
        // for them, and recursing into null used to throw.
        if (value === null || value === undefined) continue;

        const path = prefix ? `${prefix}[${key}]` : key;

        if (typeof value === "object") {
            flatten(value, path, out);
            continue;
        }

        out[path] = String(value);
    }
};

/**
 * Create a flat object following the rules of the Moodle web service client.
 * Arrays flatten through their numeric indexes, so `{ids: [1, 2]}` becomes
 * `ids[0]=1`, `ids[1]=2`.
 * @param {object} source data object
 * @returns {Record<string, string>} flat key/value pairs
 */
export const createFormattedObject = (source: object): Record<string, string> => {
    const out: Record<string, string> = {};
    flatten(source, "", out);
    return out;
};

/**
 * Format a data object into request parameters.
 *
 * Moodle reads these out of PHP's `$_POST`/`$_GET`, which multipart and
 * urlencoded bodies populate identically — so this sends the urlencoded one
 * and skips the multipart framing the old `form-data` dependency added.
 * @param {object} data data object
 * @returns {URLSearchParams} formatted parameters
 */
export const formatContent = (data: object): URLSearchParams => {
    return new URLSearchParams(createFormattedObject(data));
};
