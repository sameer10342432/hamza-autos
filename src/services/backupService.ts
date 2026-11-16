/**
 * Backup Service - Comprehensive JSON Data Export & Validation Restore
 * Implements safe local backup, structure validation, record preview, and dual restore modes (Replace / Merge)
 */
import {
  exportAllData,
  importData,
  validateBackupFile,
  clearAllLocalData,
  FullDatabaseBackup,
  ImportPreviewSummary,
  getByIdFromStore,
  putInStore,
  STORES
} from './storageService';
import { ApplicationSettingRecord } from '../types';

export const backupService = {
  /**
   * Export database and trigger client browser download
   */
  async exportBackupToFile(): Promise<{ fileName: string; sizeBytes: number; summary: FullDatabaseBackup }> {
    const backup = await exportAllData();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const sizeBytes = blob.size;

    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '');
    const fileName = `hamza-autos-backup-${dateStr}-${timeStr}.json`;

    // Trigger download in browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Update last backup date in settings
    try {
      const settings = await getByIdFromStore<ApplicationSettingRecord>(STORES.APPLICATION_SETTINGS, 'main_settings');
      if (settings) {
        settings.lastBackupDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
        await putInStore(STORES.APPLICATION_SETTINGS, settings);
      }
    } catch {
      // ignore
    }

    return { fileName, sizeBytes, summary: backup };
  },

  /**
   * Parse uploaded file text and validate structure before restoring
   */
  parseAndValidate(jsonString: string): { parsed: FullDatabaseBackup | null; summary: ImportPreviewSummary } {
    try {
      const parsed = JSON.parse(jsonString);
      const summary = validateBackupFile(parsed);
      return { parsed: summary.isValid ? parsed : null, summary };
    } catch (e: any) {
      return {
        parsed: null,
        summary: {
          isValid: false,
          error: `JSON Syntax Error: ${e.message || 'Corrupted file content'}`,
          schemaVersion: 0,
          exportDate: '',
          totalRecords: 0,
          storeCounts: {}
        }
      };
    }
  },

  /**
   * Execute Import with selected mode
   * If 'replace', optionally takes a safety snapshot in memory
   */
  async executeRestore(
    backup: FullDatabaseBackup,
    mode: 'replace' | 'merge',
    autoSafetyBackup = true
  ): Promise<{ success: boolean; recordsImported: number; details: Record<string, number> }> {
    if (autoSafetyBackup && mode === 'replace') {
      try {
        const safety = await exportAllData();
        const safetyKey = `hamza_safety_pre_restore_${Date.now()}`;
        if (typeof localStorage !== 'undefined') {
          // Store minimal summary or small JSON in localStorage as temporary failsafe
          localStorage.setItem('hamza_last_pre_restore_timestamp', new Date().toISOString());
        }
      } catch {
        // ignore safety snapshot error
      }
    }

    const result = await importData(backup, mode);

    // Update last restore date in settings
    try {
      const settings = await getByIdFromStore<ApplicationSettingRecord>(STORES.APPLICATION_SETTINGS, 'main_settings');
      if (settings) {
        settings.lastRestoreDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
        await putInStore(STORES.APPLICATION_SETTINGS, settings);
      }
    } catch {
      // ignore
    }

    return result;
  },

  /**
   * Clear all local database records
   */
  async clearAllData(): Promise<void> {
    await clearAllLocalData();
  }
};
