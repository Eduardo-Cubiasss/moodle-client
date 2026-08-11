import { IDataRequest, IMoodleResponse } from "../types/core";
import { formatContent, getUrl } from "./functions";
import { findError } from "../errors/error-handler";
import { URLError } from "../errors/url-error";

// fetch refuses to attach a body to these, and PHP would not read one into
// $_GET anyway. The old axios call did send a body on GET, which Moodle
// silently ignored — so every GET went out with no parameters at all. Moving
// them into the query string is what makes a non-POST call actually work.
const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

/**
 * import {moodleClient} from "@didactika/moodle-client";
 * const response = await moodleClient({
 *  urlRequest: {
 *    rootURL: 'http://localhost/moodle',
 *    token: 'aeb315e6dd3affc18352fe46124cdd48',
 *    webServiceFunction: 'core_course_get_courses',
 *  },
 *  content: {
 *   options: {
 *    ids: [1, 2, 3],
 *   },
 *  },
 * });
 *
 * @param data request description
 * @returns Moodle Response
 * @throws {URLError} when the host cannot be reached
 * @throws {MoodleException | InvalidToken | ...} when Moodle reports an error
 */
const core = async <T = any>(data: IDataRequest): Promise<IMoodleResponse<T>> => {
    const method = (data.method ?? "POST").toUpperCase();
    const url = getUrl(data.urlRequest);
    const params = formatContent(data.content);
    const isBodyless = BODYLESS_METHODS.has(method);

    if (isBodyless) {
        for (const [key, value] of params) url.searchParams.append(key, value);
    }

    let res: Response;
    try {
        res = await fetch(url, {
            method,
            body: isBodyless ? undefined : params,
            headers: { accept: "application/json" },
        });
    } catch {
        // Connection refused, DNS failure, TLS error: the same cases axios
        // rejected on and the old client reported as a URLError.
        throw new URLError();
    }

    // Moodle answers with JSON whenever it gets that far, but a misconfigured
    // site or a proxy in front of it can return an HTML error page instead.
    // Keep whatever came back rather than throwing a parse error over it.
    const raw = await res.text();
    let body: unknown = raw;
    if (raw.length > 0) {
        try {
            body = JSON.parse(raw);
        } catch {
            body = raw;
        }
    }

    return findError<T>({
        data: body as T,
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        headers: res.headers,
    });
};

export default core;
