import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  HardDrive,
  FileArchive
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export const BackupRestoreSection: React.FC = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getBackupsList();
      if (res.success) setBackups(res.backups || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateSnapshot = async () => {
    setCreating(true);
    try {
      const res = await AdminApiService.createBackup();
      if (res.success) {
        showNotice(`New backup snapshot created: ${res.backup?.fileName || 'Success'}`);
        fetchBackups();
      }
    } catch (err: any) {
      alert(`Backup failed: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    if (!window.confirm(`Are you sure you want to restore the system state to "${backupId}"? Current data will be replaced with this snapshot.`)) {
      return;
    }
    try {
      const res = await AdminApiService.restoreBackup(backupId);
      if (res.success) {
        showNotice('System restored successfully from backup.');
      }
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    }
  };

  const handleExportAllJson = async () => {
    try {
      const data = await AdminApiService.exportAllJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hamza_autos_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!window.confirm('Importing this file will overwrite existing storage files. Proceed?')) return;
        const res = await AdminApiService.importAllJson(parsed);
        if (res.success) {
          showNotice('Complete data imported successfully!');
          fetchBackups();
        }
      } catch (err: any) {
        alert(`Import failed: ${err.message}`);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            File Storage Data Backup & Restore
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete snapshot backups of all JSON files in <code>storage/</code> with zero database dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCreateSnapshot}
            disabled={creating}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            <HardDrive className={`w-4 h-4 ${creating ? 'animate-spin' : ''}`} />
            {creating ? 'Creating Snapshot...' : 'Create Snapshot'}
          </button>

          <button
            onClick={handleExportAllJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Download Full JSON
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJsonFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            Import JSON
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {notice}
        </div>
      )}

      {/* Backup list */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileArchive className="w-4 h-4 text-amber-500" />
            Saved Snapshot History
          </h3>
          <button
            onClick={fetchBackups}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Checking backup archives...</div>
        ) : backups.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No snapshot backups found. Click "Create Snapshot" above to generate a safe backup.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {backups.map((b) => (
              <div key={b.fileName} className="p-4 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-mono text-xs font-semibold text-white">{b.fileName}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Size: {(b.size / 1024).toFixed(1)} KB</span>
                    <span>• {new Date(b.createdAt).toLocaleString('en-PK')}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRestore(b.fileName)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore This Snapshot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
