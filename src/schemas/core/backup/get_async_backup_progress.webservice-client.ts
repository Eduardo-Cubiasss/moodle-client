/** Get the progress of an Asyncronhous backup. */
export interface CoreBackupGetAsyncBackupProgressParams {
    /** Backup id to get progress for */
    backupids: string | null[];
    /** Context id */
    contextid: number;
}

/** Backup data */
export type CoreBackupGetAsyncBackupProgressReturns = Array<{
    /** Backup Status */
    status: number | null;
    /** Backup progress */
    progress: number | null;
    /** Backup id */
    backupid: string | null;
    /** operation type */
    operation: string | null;
}>;

export type CoreBackupGetAsyncBackupProgressReturn = CoreBackupGetAsyncBackupProgressReturns;
export type core_backup_get_async_backup_progress_returns = CoreBackupGetAsyncBackupProgressReturns;
