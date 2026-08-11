import { IMoodleErrorBody, IMoodleResponse } from "../types/core";
import { AccessException } from "../errors/access-exception-error";
import { BadRequestError } from "../errors/bad-request-error";
import { InvalidParameter } from "../errors/invalid-parameter-error";
import { InvalidRecord } from "../errors/invalid-record-error";
import { InvalidToken } from "../errors/invalid-token-error";
import { MoodleException } from "../errors/moodle-exception-error";
import { URLError } from "../errors/url-error";

/**
 * What a Moodle site answered, and what that answer means.
 *
 * Moodle reports web service failures inside a 200 response body rather than
 * through the status code, so deciding whether a call succeeded is a
 * judgement about the body — which is why it lives on the response object
 * itself instead of in a free function somewhere else.
 */
export class MoodleResponse<T = any> implements IMoodleResponse<T> {
    readonly data: T;
    readonly status: number;
    readonly statusText: string;
    readonly ok: boolean;
    readonly headers: Headers;

    constructor(init: IMoodleResponse<T>) {
        this.data = init.data;
        this.status = init.status;
        this.statusText = init.statusText;
        this.ok = init.ok;
        this.headers = init.headers;
    }

    /**
     * Read a `fetch` response into one of these.
     *
     * Moodle answers with JSON whenever it gets that far, but a misconfigured
     * site or a proxy in front of it can return an HTML error page instead —
     * so whatever came back is kept as text rather than throwing a parse
     * error over it.
     */
    static async from<T = any>(res: Response): Promise<MoodleResponse<T>> {
        const raw = await res.text();
        let body: unknown = raw;

        if (raw.length > 0) {
            try {
                body = JSON.parse(raw);
            } catch {
                body = raw;
            }
        }

        return new MoodleResponse<T>({
            data: body as T,
            status: res.status,
            statusText: res.statusText,
            ok: res.ok,
            headers: res.headers,
        });
    }

    /** Whether Moodle put one of its own error codes in the body. */
    get isMoodleError(): boolean {
        return MoodleResponse.isErrorBody(this.data);
    }

    /**
     * Raise whatever Moodle reported, or hand this response back untouched.
     * @returns this response, so it can be returned in one expression
     * @throws the error matching Moodle's `errorcode`, or {@link URLError}
     */
    throwOnMoodleError(): this {
        const body = this.data;

        if (MoodleResponse.isErrorBody(body)) {
            switch (body.errorcode) {
                case "invalidparameter":
                    throw new InvalidParameter(body.debuginfo);
                case "accessexception":
                    throw new AccessException(body.debuginfo);
                case "invalidtoken":
                    throw new InvalidToken(body.debuginfo);
                case "invalidrecord":
                    throw new InvalidRecord(body.debuginfo);
                default:
                    throw body.exception === "moodle_exception"
                        ? new MoodleException(this.status, body.message ?? "", body.debuginfo)
                        : new BadRequestError();
            }
        }

        // Moodle answers 200 even for web service errors, so a failing status
        // with nothing above matching means the request never reached the web
        // service at all: a wrong site URL, a proxy, a site that is down.
        if (!this.ok) throw new URLError();

        return this;
    }

    private static isErrorBody(body: unknown): body is IMoodleErrorBody {
        return typeof body === "object" && body !== null && "errorcode" in body;
    }
}
