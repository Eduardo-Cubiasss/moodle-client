import { HttpMethod, IDataRequest, IMoodleClientOptions } from "../types/core";
import { MoodleEndpoint } from "./moodle-endpoint";
import { MoodleResponse } from "./moodle-response";
import { RequestContent } from "./request-content";
import { URLError } from "../errors/url-error";

// fetch refuses to attach a body to these, and PHP would not read one into
// $_GET anyway, so their parameters go in the query string instead.
const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

/**
 * A client for one Moodle site.
 *
 * ```ts
 * const moodle = new MoodleClient({
 *   rootURL: "https://moodle.example.org",
 *   token: "aeb315e6dd3affc18352fe46124cdd48",
 * });
 *
 * const { data } = await moodle.call("core_course_get_courses", {
 *   options: { ids: [1, 2, 3] },
 * });
 * ```
 *
 * Build it once and reuse it: the site, the token and the default method are
 * settled at construction, so each call only names the function it wants.
 */
export class MoodleClient {
    private readonly endpoint: MoodleEndpoint;
    private readonly defaultMethod: HttpMethod;

    constructor(options: IMoodleClientOptions) {
        this.endpoint = new MoodleEndpoint(options.rootURL, options.token);
        this.defaultMethod = options.method ?? "POST";
    }

    /**
     * Call a Moodle web service function.
     * @param webServiceFunction e.g. `core_course_get_courses`
     * @param content the parameters, nested as deeply as the function needs
     * @param method overrides the default chosen at construction
     * @returns the site's answer, already checked for Moodle errors
     * @throws {URLError} when the site cannot be reached
     * @throws {MoodleException} and friends when Moodle reports an error
     */
    async call<T = any>(
        webServiceFunction: string,
        content: object = {},
        method?: HttpMethod,
    ): Promise<MoodleResponse<T>> {
        const verb = (method ?? this.defaultMethod).toUpperCase();
        const url = this.endpoint.urlFor(webServiceFunction);
        const params = new RequestContent(content);
        const isBodyless = BODYLESS_METHODS.has(verb);

        if (isBodyless) params.appendTo(url);

        let res: Response;
        try {
            res = await fetch(url, {
                method: verb,
                body: isBodyless ? undefined : params.toSearchParams(),
                headers: { accept: "application/json" },
            });
        } catch {
            // Connection refused, DNS failure, TLS error.
            throw new URLError();
        }

        const response = await MoodleResponse.from<T>(res);
        return response.throwOnMoodleError();
    }
}

/**
 * Make a single call without keeping a client around.
 *
 * ```ts
 * const response = await moodleClient({
 *   urlRequest: {
 *     rootURL: "https://moodle.example.org",
 *     token: "aeb315e6dd3affc18352fe46124cdd48",
 *     webServiceFunction: "core_course_get_courses",
 *   },
 *   content: { options: { ids: [1, 2, 3] } },
 * });
 * ```
 *
 * This is the shape the package has always had and it is not going away.
 * Reach for {@link MoodleClient} when more than one call goes to the same
 * site, so the site and token are stated once instead of per call.
 */
export const moodleClient = <T = any>(data: IDataRequest): Promise<MoodleResponse<T>> => {
    const client = new MoodleClient({
        rootURL: data.urlRequest.rootURL,
        token: data.urlRequest.token,
    });

    return client.call<T>(data.urlRequest.webServiceFunction, data.content, data.method);
};
