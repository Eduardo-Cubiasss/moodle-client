import { AxiosResponse } from "axios";
import { InvalidParameter } from "./invalid-parameter-error";
import { AccessException } from "./access-exception-error";
import { InvalidToken } from "./invalid-token-error";
import { InvalidRecord } from "./invalid-record-error";
import { MoodleException } from "./moodle-exception-error";
import { BadRequestError } from "./bad-request-error";

/**
 * Find error
 * @description Find the error in the response
 * @param res Axios response
 * @returns Returns the response if there is no error
 * @throws Throws an error when there is an error
 */
export const findError = (res: AxiosResponse) => {
    if (res.data !== null && "errorcode" in res.data) {
        switch (res.data.errorcode) {
            case "invalidparameter":
                throw new InvalidParameter(res.data.debuginfo);
            case "accessexception":
                throw new AccessException(res.data.debuginfo);
            case "invalidtoken":
                throw new InvalidToken(res.data.debuginfo);
            case "invalidrecord":
                throw new InvalidRecord(res.data.debuginfo);
            default:
                throw ("exception" in res.data && res.data.exception === "moodle_exception")
                    ? new MoodleException(res.status, res.data.message, res.data.debuginfo)
                    : new BadRequestError();
        }
    } else {
        return res;
    }
};