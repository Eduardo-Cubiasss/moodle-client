import { WebserviceSignature } from './signature.interfaces';
import { MoodleService } from './service-extractor.interfaces';

/**
 * Single service item dispatched to the batch PHP runner via STDIN.
 */
export interface BatchServiceItem {
    serviceName: string;
    classFile: string;
    classname: string;
    methodname: string;
}

/**
 * Resolved service with its file path on disk.
 */
export interface ResolvedServiceEntry {
    service: MoodleService;
    classFilePath: string | null;
}

/**
 * Successful extraction result emitted by batch runner via STDOUT NDJSON.
 */
export interface BatchStreamSuccessItem {
    serviceName: string;
    success: true;
    signature: WebserviceSignature;
}

/**
 * Controlled service extraction failure emitted by batch runner via STDOUT NDJSON.
 */
export interface BatchStreamFailureItem {
    serviceName: string;
    success: false;
    error: string;
    file?: string;
    line?: number;
}

/**
 * Discriminated union of streaming NDJSON items emitted per service.
 */
export type BatchStreamItem = BatchStreamSuccessItem | BatchStreamFailureItem;

/**
 * Fatal crash payload emitted to STDERR by PHP shutdown handler on die()/exit().
 */
export interface BatchFatalErrorPayload {
    success: false;
    serviceName?: string;
    error: string;
    file?: string;
    line?: number;
}

/**
 * Consolidated outcome of executing a batch streaming session.
 */
export interface BatchExecutionResult {
    signatures: Map<string, WebserviceSignature>;
    errors: Map<string, string>;
    uncompleted: BatchServiceItem[];
}

/**
 * Progress lifecycle handler for batch extraction sessions.
 */
export interface BatchProgressHandler {
    onProgress?: (completed: number, total: number, serviceName?: string) => void;
    finish: () => void;
}


