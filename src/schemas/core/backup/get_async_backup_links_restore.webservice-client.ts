/** Gets the data to use when updating the status table row in the UI for when an async restore completes. */
export interface CoreBackupGetAsyncBackupLinksRestoreParams {
    /** Backup id */
    backupid: string;
    /** Context id */
    contextid: number;
}

/** Table row data. */
export interface CoreBackupGetAsyncBackupLinksRestoreReturns {
    /** Restore url */
    restoreurl: string | null;
}

export type CoreBackupGetAsyncBackupLinksRestoreReturn = CoreBackupGetAsyncBackupLinksRestoreReturns;
export type core_backup_get_async_backup_links_restore_returns = CoreBackupGetAsyncBackupLinksRestoreReturns;
