import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, User, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export const ActivityLogsSection: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getAuditLogs(1, 100);
      if (res.success) {
        setLogs(res.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            Security & Admin Activity Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit trail of all admin logins, content updates, status changes, and file operations.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No audit log records recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {log.action}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">by {log.username}</span>
                  </div>
                  <p className="text-xs text-slate-400">{log.details}</p>
                </div>

                <div className="text-right text-[11px] text-slate-500 shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleString('en-PK')}</span>
                  </div>
                  {log.ip && <span className="font-mono text-[10px] text-slate-600">{log.ip}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
