import { IMoodleErrorBody, IMoodleResponse } from "../types/core";
import { InvalidParameter } from "./invalid-parameter-error";
import { AccessException } from "./access-exception-error";
import { InvalidToken } from "./invalid-token-error";
import { InvalidRecord } from "./invalid-record-error";
import { MoodleException } from "./moodle-exception-error";
import { BadRequestError } from "./bad-request-error";
import { URLError } from "./url-error";

/**
 * Narrow a response body to Moodle's documented error shape.
 * @param body parsed response body, which may be anything the site returned
 * @returns {boolean} true when the body carries an `errorcode`
 */
const isErrorBody = (body: unknown): body is IMoodleErrorBody =>
    typeof body === "object" && body !== null && "errorcode" in body;

/**
 * Find error
 * @description Find the error in the response
 * @param res parsed Moodle response
 * @returns Returns the response if there is no error
 * @throws Throws the matching error when Moodle reported one
 */
export const findError = <T>(res: IMoodleResponse<T>): IMoodleResponse<T> => {
    const body = res.data;

    if (isErrorBody(body)) {
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
                    ? new MoodleException(res.status, body.message ?? "", body.debuginfo)
                    : new BadRequestError();
        }
    }

    // Moodle answers 200 even for web service errors, so reaching here with a
    // failing status means the request never got to the web service at all —
    // a wrong rootURL, a proxy, a site that is down. axios rejected on those
    // and the old client reported them as a URLError; unlike axios, fetch
    // hands them over as ordinary responses, so the check is explicit now.
    if (!res.ok) throw new URLError();

    return res;
};
