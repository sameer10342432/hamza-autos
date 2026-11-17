import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  MessageCircle, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search, 
  X, 
  Edit, 
  Trash2, 
  RotateCw 
} from 'lucide-react';
import { FollowUpRecord, FollowUpStatus, FollowUpMethod } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface FollowUpsSectionProps {
  onNotify?: (msg: string) => void;
}

export const FollowUpsSection: React.FC<FollowUpsSectionProps> = ({ 
  onNotify = () => {} 
}) => {
  const [followups, setFollowups] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming' | 'overdue' | 'completed' | 'all'>('today');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [reschedulingItem, setReschedulingItem] = useState<FollowUpRecord | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00 AM');

  // Form
  const [formData, setFormData] = useState<Partial<FollowUpRecord>>({
    customerName: '',
    phoneNumber: '',
    followUpDate: new Date().toISOString().split('T')[0],
    followUpTime: '11:00 AM',
    followUpMethod: 'WhatsApp',
    followUpNotes: ''
  });

  const loadFollowups = async () => {
    try {
      setLoading(true);
      const res = await AdminApiService.getCrmFollowups();
      if (res.success && res.followups) {
        setFollowups(res.followups);
      }
    } catch (err) {
      console.error('Failed to load followups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowups();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const todayList = followups.filter(f => f.followUpDate === todayStr && f.status === 'Pending');
  const overdueList = followups.filter(f => f.followUpDate < todayStr && f.status === 'Pending');
  const upcomingList = followups.filter(f => f.followUpDate > todayStr && f.status === 'Pending');
  const completedList = followups.filter(f => f.status === 'Completed');

  const displayedList = activeFilter === 'today' ? todayList :
    activeFilter === 'upcoming' ? upcomingList :
    activeFilter === 'overdue' ? overdueList :
    activeFilter === 'completed' ? completedList : followups;

  const handleMarkCompleted = async (id: string) => {
    try {
      const res = await AdminApiService.updateCrmFollowup(id, { 
        status: 'Completed',
        completionNotes: 'Contacted customer successfully.'
      });
      if (res.success) {
        setFollowups(prev => prev.map(f => f.id === id ? res.followup : f));
        onNotify('Follow-up marked as completed');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleReschedule = async () => {
    if (!reschedulingItem || !newDate) return;
    try {
      const res = await AdminApiService.updateCrmFollowup(reschedulingItem.id, {
        followUpDate: newDate,
        followUpTime: newTime,
        status: 'Pending'
      });
      if (res.success) {
        setFollowups(prev => prev.map(f => f.id === reschedulingItem.id ? res.followup : f));
        onNotify(`Rescheduled follow-up to ${newDate}`);
        setReschedulingItem(null);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AdminApiService.createCrmFollowup(formData);
      if (res.success) {
        setFollowups(prev => [res.followup, ...prev]);
        onNotify(`Follow-up scheduled for ${res.followup.customerName}`);
        setShowScheduleModal(false);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this follow-up record?')) return;
    try {
      await AdminApiService.deleteCrmFollowup(id);
      setFollowups(prev => prev.filter(f => f.id !== id));
      onNotify('Follow-up removed');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            LEAD ENGAGEMENT &amp; CRM
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Follow-Up Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily customer check-ins, quotation reviews, and scheduled motorcycle service callbacks.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Follow-up</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div 
          onClick={() => setActiveFilter('today')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'today' ? 'bg-red-50/70 border-red-300 shadow-xs' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Today's Callbacks</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{todayList.length}</div>
          <div className="text-[11px] text-red-600 mt-0.5 font-medium">Scheduled for today</div>
        </div>

        <div 
          onClick={() => setActiveFilter('overdue')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'overdue' ? 'bg-amber-50/70 border-amber-300 shadow-xs' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Overdue Follow-ups</div>
          <div className="text-2xl font-black text-amber-900 mt-1 tabular-nums">{overdueList.length}</div>
          <div className="text-[11px] text-amber-700 mt-0.5 font-medium">Missed callback dates</div>
        </div>

        <div 
          onClick={() => setActiveFilter('upcoming')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'upcoming' ? 'bg-blue-50/70 border-blue-300 shadow-xs' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Upcoming</div>
          <div className="text-2xl font-black text-blue-900 mt-1 tabular-nums">{upcomingList.length}</div>
          <div className="text-[11px] text-blue-600 mt-0.5 font-medium">Future scheduled tasks</div>
        </div>

        <div 
          onClick={() => setActiveFilter('completed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'completed' ? 'bg-emerald-50/70 border-emerald-300 shadow-xs' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Completed</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">{completedList.length}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Successful contacts</div>
        </div>
      </div>

      {/* 3. Filter Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-6 px-1">
        {(['today', 'overdue', 'upcoming', 'completed', 'all'] as const).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setActiveFilter(tabKey)}
            className={`pb-2.5 transition-colors cursor-pointer capitalize ${
              activeFilter === tabKey ? 'text-red-600 border-b-2 border-red-600 font-black' : 'hover:text-slate-900'
            }`}
          >
            {tabKey === 'today' ? "Today's Queue" : tabKey}
          </button>
        ))}
      </div>

      {/* 4. Follow-up Cards List */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No follow-ups found in this section.</p>
          </div>
        ) : (
          displayedList.map(item => (
            <div 
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{item.customerName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    item.followUpDate < todayStr ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {item.status === 'Pending' && item.followUpDate < todayStr ? 'Overdue' : item.status}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">· via {item.followUpMethod}</span>
                </div>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {item.phoneNumber}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.followUpDate} at {item.followUpTime || '11:00 AM'}
                  </span>
                </div>

                {item.followUpNotes && (
                  <p className="text-xs text-slate-500 pt-0.5">
                    <strong>Notes:</strong> {item.followUpNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* Direct Contact Triggers */}
                <a
                  href={`https://wa.me/92${item.phoneNumber.replace(/^0|\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="WhatsApp Customer"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <a
                  href={`tel:${item.phoneNumber}`}
                  className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  title="Call Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>

                {item.status !== 'Completed' && (
                  <>
                    <button
                      onClick={() => handleMarkCompleted(item.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Mark Done
                    </button>
                    <button
                      onClick={() => {
                        setReschedulingItem(item);
                        setNewDate(item.followUpDate);
                        setNewTime(item.followUpTime || '11:00 AM');
                      }}
                      className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Reschedule Follow-up"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Lead Follow-Up</h3>
              <button onClick={() => setShowScheduleModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowup} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName || ''}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Zahid Hussain"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="0321 9876543"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Follow-Up Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.followUpDate || todayStr}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={formData.followUpTime || '11:00 AM'}
                    onChange={(e) => setFormData({ ...formData, followUpTime: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Method</label>
                <select
                  value={formData.followUpMethod || 'WhatsApp'}
                  onChange={(e) => setFormData({ ...formData, followUpMethod: e.target.value as FollowUpMethod })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Call">Direct Phone Call</option>
                  <option value="In-Person">In-Person Workshop Visit</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Callback Notes</label>
                <textarea
                  rows={2}
                  value={formData.followUpNotes || ''}
                  onChange={(e) => setFormData({ ...formData, followUpNotes: e.target.value })}
                  placeholder="Follow up on cylinder boring quote..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Schedule Callback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Reschedule Modal */}
      {reschedulingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reschedule Follow-Up</h3>
            <p className="text-xs text-slate-600">
              Rescheduling callback for <strong>{reschedulingItem.customerName}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setReschedulingItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Update Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
