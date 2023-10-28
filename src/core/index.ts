import axios from "axios";
import { IDataRequest } from "../../types/core";
import { formatContent, getUrl } from "./functions";
import { findError } from "../errors/error-handler";

/**
 * import core from "mdl-ws-core-ts";
 * const response = await core({
 *  URLRequest: {
 *    rootURL: 'http://localhost/moodle',
 *    token: 'aeb315e6dd3affc18352fe46124cdd48',
 *    wSFunction: 'core_course_get_courses',
 *  },
 *  content: {
 *    courses: [
 *        {
 *            fullname: 'Example01',
 *            shortname: 'Example1',
 *            categoryid: 1
 *        },
 *        {
 *            fullname: 'Example02',
 *            shortname: 'Example2',
 *            categoryid: 1
 *          }
 *    ]
 *  },
 * });
 *
 * @param data
 * @returns Moodle Response
 */
const core = async (data: IDataRequest) => {
    const url = getUrl(data.urlRequest);
    const content = formatContent(data.content);

    const res = await axios({
        method: data.method || "POST",
        url,
        data: content,
        headers: content.getHeaders(),
    }).catch(() => {
        throw new URLError();
    });
    return findError(res);
}
export default core;