/**
 * The payload of one call, in the shape Moodle's REST server reads.
 *
 * Moodle has no notion of nested JSON on this endpoint: everything arrives
 * as flat `parent[child][index]` keys out of PHP's `$_POST`/`$_GET`. This
 * owns that translation, so the client never has to think about it.
 */
export class RequestContent {
    private readonly source: object;

    /**
     * @param source a plain object, nested as deeply as you like
     */
    constructor(source: object = {}) {
        this.source = source;
    }

    /**
     * The flat key/value pairs this content becomes.
     *
     * `{options: {ids: [1, 2]}}` flattens to `options[ids][0]`,
     * `options[ids][1]`. `null` and `undefined` are dropped: Moodle has no
     * representation for either.
     */
    toObject(): Record<string, string> {
        const out: Record<string, string> = {};
        RequestContent.flatten(this.source, "", out);
        return out;
    }

    /** The same pairs, ready to be sent as a urlencoded body. */
    toSearchParams(): URLSearchParams {
        return new URLSearchParams(this.toObject());
    }

    /**
     * Append the pairs onto a URL's query string, for the methods that
     * cannot carry a body.
     * @param url modified in place
     */
    appendTo(url: URL): void {
        for (const [key, value] of this.toSearchParams()) {
            url.searchParams.append(key, value);
        }
    }

    /** Whether there is anything at all to send. */
    get isEmpty(): boolean {
        return Object.keys(this.toObject()).length === 0;
    }

    private static flatten(source: object, prefix: string, out: Record<string, string>): void {
        for (const [key, value] of Object.entries(source)) {
            if (value === null || value === undefined) continue;

            const path = prefix ? `${prefix}[${key}]` : key;

            if (typeof value === "object") {
                RequestContent.flatten(value, path, out);
                continue;
            }

            out[path] = String(value);
        }
    }
}
