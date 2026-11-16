import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, CheckCircle, Info, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export const NotificationsCenterSection: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await AdminApiService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await AdminApiService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            Admin Notifications & Alert Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workshop activity alerts, website form submissions, and security events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotes}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filter === 'all' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filter === 'unread' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No notifications found.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filtered.map((note) => (
              <div
                key={note.id}
                className={`p-4 hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4 ${
                  !note.read ? 'bg-red-500/[0.04]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    note.type === 'booking' ? 'bg-blue-500/10 text-blue-400' :
                    note.type === 'contact' ? 'bg-emerald-500/10 text-emerald-400' :
                    note.type === 'security' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{note.title}</span>
                      {!note.read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{note.message}</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(note.createdAt).toLocaleString('en-PK')}</span>
                    </div>
                  </div>
                </div>

                {!note.read && (
                  <button
                    onClick={() => handleMarkRead(note.id)}
                    className="text-xs text-slate-400 hover:text-white shrink-0 px-2 py-1 rounded bg-slate-800"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
