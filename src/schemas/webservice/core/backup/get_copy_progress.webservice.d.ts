/** Gets the progress of course copy operations. */
export interface CoreBackupGetCopyProgressParams {
    /** Copy data */
    copies: Array<{
        /** Backup id */
        backupid: string | null;
        /** Restore id */
        restoreid: string | null;
        /** Operation type */
        operation: string | null;
    }>;
}

/** Copy data */
export type CoreBackupGetCopyProgressReturns = Array<{
    /** Copy Status */
    status: number | null;
    /** Copy progress */
    progress: number | null;
    /** Copy id */
    backupid: string | null;
    /** Operation type */
    operation: string | null;
}>;

export type CoreBackupGetCopyProgressReturn = CoreBackupGetCopyProgressReturns;
export type core_backup_get_copy_progress_returns = CoreBackupGetCopyProgressReturns;
