import React, { useState } from 'react';
import { Download, Upload, CheckCircle2, AlertTriangle, Database, X } from 'lucide-react';
import { exportDatabaseBackup, importDatabaseBackup } from '../../utils/workshopLogic';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      const json = exportDatabaseBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hamza_autos_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Database exported successfully to JSON file.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to export database: ' + (err.message || 'Unknown error') });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJson(content);
    };
    reader.readAsText(file);
  };

  const handleRestore = () => {
    if (!importJson.trim()) {
      setMessage({ type: 'error', text: 'Please paste or upload a valid JSON backup.' });
      return;
    }

    if (!window.confirm('Are you sure you want to restore this database? Existing records will be safely updated.')) {
      return;
    }

    const res = importDatabaseBackup(importJson);
    if (res.success) {
      setMessage({ type: 'success', text: 'Database successfully restored! Reloading records...' });
      setTimeout(() => {
        onBackupRestored();
        onClose();
      }, 1000);
    } else {
      setMessage({ type: 'error', text: 'Restore failed: ' + (res.error || 'Invalid backup structure.') });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database Backup &amp; Safe Restore</h3>
              <p className="text-xs text-slate-500">Safeguard all bookings, job cards, inventory, invoices &amp; customer CRM</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Section 1: Export */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            1. Download Current Database Backup
          </h4>
          <p className="text-xs text-slate-500">
            Exports all active appointments, job cards, customer histories, inventory parts, and workshop invoices into a single JSON file.
          </p>
          <button
            onClick={handleDownload}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Full JSON Backup
          </button>
        </div>

        {/* Section 2: Import */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            2. Restore Database from Backup File
          </h4>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Backup (.json file)
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or Paste Backup JSON Raw Text:
            </label>
            <textarea
              rows={3}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{"version":"2.0","exportDate":"...","bookings":[...]}'
              className="w-full py-2 px-3 text-[11px] font-mono border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
            />
          </div>

          <button
            onClick={handleRestore}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Validate &amp; Restore Database
          </button>
        </div>
      </div>
    </div>
  );
};
