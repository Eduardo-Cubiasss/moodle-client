/** Gets the data to use when updating the status table row in the UI for when an async backup completes. */
export interface CoreBackupGetAsyncBackupLinksBackupParams {
    /** Backup filename */
    filename: string;
    /** Context id */
    contextid: number;
    /** Backup id */
    backupid: string;
}

/** Table row data. */
export interface CoreBackupGetAsyncBackupLinksBackupReturns {
    /** Backup file size */
    filesize: string | null;
    /** Backup file URL */
    fileurl: string | null;
    /** Backup restore URL */
    restoreurl: string | null;
}

export type CoreBackupGetAsyncBackupLinksBackupReturn = CoreBackupGetAsyncBackupLinksBackupReturns;
export type core_backup_get_async_backup_links_backup_returns = CoreBackupGetAsyncBackupLinksBackupReturns;
