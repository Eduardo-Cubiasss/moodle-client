import { IURLRequest } from "../../types/core";
import FormData from "form-data";

/**
 * Get url with params token and webServiceFunction
 * @param {IURLRequest} dataUrl data url request 
 * @returns {string} url with params
 */
export const getUrl = (dataUrl: IURLRequest): string => {
    return `${dataUrl.rootURL}/webservice/rest/server.php?wstoken=${dataUrl.token}&wsfunction=${dataUrl.webServiceFunction}&moodlewsrestformat=json`;
};

/**
 * Create formatted object with rules of moodle web service client
 * @param {object} object data object
 * @param {number} i counter of iterations
 * @param {string} keyT union of keys
 * @param {object} response response object accumulator
 * @param {boolean} isFirstIteration flag to know if is the first iteration
 * @returns {object | undefined} formatted object or undefined
 */
export const createFormattedObject = (object: object, i = 0, keyT = "", response = {}, isFirstIteration = true): object | undefined => {
    let aux;
    for (let [key, val] of Object.entries(object)) {
        keyT.length === 0 ? (aux = keyT + `${key}`) : (aux = keyT + `[${key}]`);
        if (typeof val === "object") {
            createFormattedObject(val, i++, aux, response, false);
        } else if (typeof val !== "undefined") {
            Object.assign(response, { [`${aux}`]: val });
        }
    }
    return (isFirstIteration) ? response : undefined;
};

/**
 * Format data object to FormData
 * @param {object} data data object 
 * @returns {FormData} formatted data in FormData
 */
export const formatContent = (data: object): FormData => {
    const formattedObject = createFormattedObject(data);
    const formData = new FormData();

    if (!formattedObject) return formData;

    for (let [key, val] of Object.entries(formattedObject))
        formData.append(`${key}`, `${val}`);

    return formData;
};