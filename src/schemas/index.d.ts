/**
 * Master barrel for generated Moodle services namespaces.
 */
import type { GeneratedMoodleServices as WebserviceGeneratedServices } from "./webservice/index";

export type {
    WebserviceGeneratedServices,
};

// Namespace type barrels
export type * as webservice from "./webservice/index";

export interface GeneratedMoodleServices {
    /**
     * Moodle web services namespace 'webservice'.
     * Source: moodle-official (v4.5)
     */
    webservice: WebserviceGeneratedServices;
}

declare module "@didactika/moodle-client" {
    interface MoodleClient extends GeneratedMoodleServices {}
}

