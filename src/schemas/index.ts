/**
 * Master barrel for generated Moodle services namespaces.
 */
import type { GeneratedMoodleServices as WebserviceGeneratedServices } from "./webservice/index";

export type {
    WebserviceGeneratedServices,
};

export interface GeneratedMoodleServices {
    /**
     * Moodle web services namespace 'webservice'.
     * Source: moodle-official (v4.5)
     */
    webservice: WebserviceGeneratedServices;
}

