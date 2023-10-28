import axios from "axios";
import { IDataRequest } from "../../types/core";
import { formatContent, getUrl } from "./functions";
import { findError } from "../errors/error-handler";
import { URLError } from "../errors/url-error";

/**
 * import {moodleClient} from "moodle-web-service-client/lib";
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