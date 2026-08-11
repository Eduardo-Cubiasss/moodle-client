import { URLError } from "../errors/url-error";

/**
 * The REST entry point of one Moodle site, authenticated with one token.
 *
 * Holding the site and the token together is what lets a client be built
 * once and reused: the parts that stay the same across calls live here, and
 * only the function name changes per request.
 */
export class MoodleEndpoint {
    private readonly root: string;
    private readonly token: string;

    /**
     * @param rootURL the site's base URL, with or without a trailing slash
     * @param token a Moodle web service token
     */
    constructor(rootURL: string, token: string) {
        this.root = MoodleEndpoint.trimTrailingSlashes(rootURL);
        this.token = token;
    }

    /**
     * Build the URL for a call to one web service function.
     *
     * Values go through `URLSearchParams`, so a token or function name
     * carrying a reserved character is escaped instead of corrupting the
     * query string.
     * @param webServiceFunction the Moodle function to call
     * @returns the endpoint with its query parameters
     * @throws {URLError} when the site URL is not a valid absolute URL
     */
    urlFor(webServiceFunction: string): URL {
        let url: URL;

        try {
            url = new URL(`${this.root}/webservice/rest/server.php`);
        } catch {
            throw new URLError();
        }

        url.searchParams.set("wstoken", this.token);
        url.searchParams.set("wsfunction", webServiceFunction);
        url.searchParams.set("moodlewsrestformat", "json");

        return url;
    }

    /**
     * Scanning backwards rather than replacing with `/\/+$/`: that pattern
     * backtracks from every position on a string of many slashes, which is a
     * polynomial ReDoS on caller input.
     */
    private static trimTrailingSlashes(value: string): string {
        let end = value.length;
        while (end > 0 && value[end - 1] === "/") end--;
        return value.slice(0, end);
    }
}
