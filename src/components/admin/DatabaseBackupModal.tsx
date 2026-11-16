import React, { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Database,
  X,
  RefreshCw,
  HardDrive,
  ShieldAlert,
  Layers,
  Trash2
} from 'lucide-react';
import { backupService } from '../../services';
import { FullDatabaseBackup } from '../../services/storageService';

interface DatabaseBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackupRestored: () => void;
}

export const DatabaseBackupModal: React.FC<DatabaseBackupModalProps> = ({
  isOpen,
  onClose,
  onBackupRestored
}) => {
  const [importJson, setImportJson] = useState('');
  const [parsedBackup, setParsedBackup] = useState<FullDatabaseBackup | null>(null);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [storageUsage, setStorageUsage] = useState<{
    usageBytes: number;
    quotaBytes: number;
    usageMB: string;
    quotaMB: string;
    percentUsed: string;
  } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      backupService.getStorageUsage().then(usage => setStorageUsage(usage));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadBackup = async () => {
    setIsProcessing(true);
    setMessage(null);
    try {
      await backupService.exportAndDownload();
      setMessage({ type: 'success', text: 'All 16 IndexedDB object stores exported successfully to JSON!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Export failed: ' + (err.message || 'Unknown error') });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJson(content);
      validateJson(content);
    };
    reader.readAsText(file);
  };

  const validateJson = (jsonString: string) => {
    setMessage(null);
    const val = backupService.validateBackupFile(jsonString);
    if (!val.valid) {
      setParsedBackup(null);
      setMessage({ type: 'error', text: 'Invalid backup structure: ' + val.error });
      return false;
    }
    setParsedBackup(val.parsed || null);
    setMessage({
      type: 'warning',
      text: `Backup verified! Contains ${val.recordSummary ? Object.values(val.recordSummary).reduce((a, b) => a + b, 0) : 0} records across object stores.`
    });
    return true;
  };

  const handleExecuteRestore = async () => {
    if (!parsedBackup) {
      setMessage({ type: 'error', text: 'Please upload or paste a valid JSON backup file first.' });
      return;
    }

    const confirmMsg = restoreMode === 'replace'
      ? 'ARE YOU SURE? Replace mode will wipe current IndexedDB records and restore the backup. An automatic safety pre-backup will be taken.'
      : 'Merge mode will add records and update existing matching records by ID.';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const res = await backupService.restoreDatabase(parsedBackup, restoreMode);
      if (res.success) {
        setMessage({
          type: 'success',
          text: `Success! Restored ${res.restoredRecords} records across object stores. Reloading view...`
        });
        setTimeout(() => {
          onBackupRestored();
          onClose();
        }, 1200);
      } else {
        setMessage({ type: 'error', text: 'Restore failed: ' + res.error });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Restore exception: ' + (err.message || 'Unknown error') });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearLocalData = async () => {
    if (!window.confirm('DANGER: Clear all local workshop data in this browser? This action cannot be undone unless you have a backup.')) {
      return;
    }

    setIsProcessing(true);
    try {
      await backupService.clearDatabase();
      setMessage({ type: 'success', text: 'All local workshop records cleared. Reloading page...' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Clear failed: ' + (err.message || 'Unknown error') });
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Local-First Data Management &amp; Backup
              </h3>
              <p className="text-xs text-slate-500">
                16-Store Browser IndexedDB (hamza_autos_db)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            message.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' :
            'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {message.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {message.type === 'error' && <ShieldAlert className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Storage Quota Usage Card */}
        {storageUsage && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-slate-500" />
                Browser Storage Allocation:
              </span>
              <span className="text-slate-900 font-mono">
                {storageUsage.usageMB} MB / {storageUsage.quotaMB} MB ({storageUsage.percentUsed}% used)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, parseFloat(storageUsage.percentUsed) || 1)}%` }}
              />
            </div>
          </div>
        )}

        {/* Section 1: Full JSON Export */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-red-600" />
            <span>1. Full JSON Export (16 Object Stores)</span>
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Downloads complete workshop database: customers, motorcycles, bookings, job cards, 16-point inspections, quotations, invoices, payments, inventory, audit movements, reminders, and feedback.
          </p>
          <button
            onClick={handleDownloadBackup}
            disabled={isProcessing}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download Full Backup JSON File</span>
          </button>
        </div>

        {/* Section 2: Safe Restore */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>2. Restore Database from JSON Backup</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Backup (.json file)
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or Paste JSON Raw Content:
            </label>
            <textarea
              rows={3}
              value={importJson}
              onChange={(e) => {
                setImportJson(e.target.value);
                if (e.target.value.trim().startsWith('{')) validateJson(e.target.value);
              }}
              placeholder='{"application":"Hamza Autos Workshop Management", ...}'
              className="w-full py-2 px-3 text-[11px] font-mono border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden bg-white"
            />
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="restoreMode"
                value="replace"
                checked={restoreMode === 'replace'}
                onChange={() => setRestoreMode('replace')}
              />
              <span>Replace (Wipe &amp; Replace with Safety Backup)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="restoreMode"
                value="merge"
                checked={restoreMode === 'merge'}
                onChange={() => setRestoreMode('merge')}
              />
              <span>Merge Records</span>
            </label>
          </div>

          <button
            onClick={handleExecuteRestore}
            disabled={!parsedBackup || isProcessing}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${
              parsedBackup
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>Execute Database Restore</span>
          </button>
        </div>

        {/* Section 3: Wipe & Reset */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Clear database &amp; reset to factory state</span>
          <button
            onClick={handleClearLocalData}
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Storage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
