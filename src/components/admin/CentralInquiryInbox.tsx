import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Archive, 
  Trash2, 
  ExternalLink, 
  RefreshCw,
  MoreVertical,
  ChevronDown,
  Tag,
  Calendar,
  X,
  Send
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export interface InquiryItem {
  id: string;
  sourceType: string;
  customerName: string;
  phone: string;
  email?: string;
  serviceRequested?: string;
  message?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'quote_sent' | 'booked' | 'completed' | 'cancelled' | 'spam' | 'archived';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  internalNotes?: Array<{ text: string; addedBy: string; addedAt: string }>;
  details?: Record<string, any>;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: 'New', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400' },
  contacted: { label: 'Contacted', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
  in_progress: { label: 'In Progress', bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400' },
  quote_sent: { label: 'Quote Sent', bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400' },
  booked: { label: 'Booked', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' },
  completed: { label: 'Completed', bg: 'bg-teal-500/10 border-teal-500/30', text: 'text-teal-400' },
  cancelled: { label: 'Cancelled', bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-400' },
  spam: { label: 'Spam', bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400' },
  archived: { label: 'Archived', bg: 'bg-zinc-500/10 border-zinc-500/30', text: 'text-zinc-400' },
};

interface CentralInquiryInboxProps {
  initialFilterType?: string;
}

export const CentralInquiryInbox: React.FC<CentralInquiryInboxProps> = ({ initialFilterType }) => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState(initialFilterType || '');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [newNote, setNewNote] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialFilterType) {
      setTypeFilter(initialFilterType);
    }
  }, [initialFilterType]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getInquiries({
        search: search || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        priority: priorityFilter || undefined,
        limit: 100
      });
      if (res.success) {
        setInquiries(res.inquiries || []);
      }
    } catch (err: any) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter, priorityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await AdminApiService.updateInquiryStatus(id, newStatus);
      if (res.success) {
        setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus as any } : item));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
        showNotice(`Inquiry status updated to ${newStatus}`);
      }
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleAddNote = async (id: string) => {
    if (!newNote.trim()) return;
    try {
      const res = await AdminApiService.addInquiryNote(id, newNote.trim());
      if (res.success && res.inquiry) {
        setInquiries(prev => prev.map(item => item.id === id ? res.inquiry : item));
        setSelectedInquiry(res.inquiry);
        setNewNote('');
        showNotice('Internal note added.');
      }
    } catch (err: any) {
      alert(`Error adding note: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      const res = await AdminApiService.deleteInquiry(id);
      if (res.success) {
        setInquiries(prev => prev.filter(item => item.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        showNotice('Inquiry deleted successfully.');
      }
    } catch (err: any) {
      alert(`Error deleting inquiry: ${err.message}`);
    }
  };

  const handleBulkAction = async (action: 'status' | 'delete', status?: string) => {
    if (!selectedIds.length) return;
    if (action === 'delete' && !window.confirm(`Delete ${selectedIds.length} selected inquiries?`)) return;

    try {
      const res = await AdminApiService.bulkUpdateInquiries(selectedIds, action, status);
      if (res.success) {
        showNotice(res.message);
        setSelectedIds([]);
        fetchInquiries();
      }
    } catch (err: any) {
      alert(`Bulk action failed: ${err.message}`);
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : (cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone);
    const message = encodeURIComponent(`Salam ${name}! Thank you for contacting Hamza Autos (Badami Bagh, Lahore). How can we assist you with your motorcycle today?`);
    window.open(`https://wa.me/${intlPhone}?text=${message}`, '_blank');
  };

  const openPhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-red-500" />
            Central Inquiries & Form Inbox
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-device inbox for contact submissions, appointment bookings, quotations & messages.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchInquiries()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-300 font-medium">{selectedIds.length} selected</span>
              <button
                onClick={() => handleBulkAction('status', 'contacted')}
                className="text-amber-400 hover:underline"
              >
                Mark Contacted
              </button>
              <button
                onClick={() => handleBulkAction('status', 'archived')}
                className="text-zinc-400 hover:underline"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {actionNotice}
          </span>
          <button onClick={() => setActionNotice(null)} className="text-emerald-400/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <form onSubmit={handleSearchSubmit} className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer name, phone, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </form>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-red-500"
            >
              <option value="">All Statuses (9)</option>
              <option value="new">New (Unread)</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="quote_sent">Quote Sent</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="spam">Spam</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-red-500"
            >
              <option value="">All Form Sources</option>
              <option value="booking">Appointment Bookings</option>
              <option value="contact">Contact Forms</option>
              <option value="quote">Quotation Requests</option>
              <option value="feedback">Customer Feedback</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-red-500"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
            Loading inquiries from file storage...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No Inquiries Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Any contact submissions or bookings created on the website will instantly appear in this central inbox.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === inquiries.length && inquiries.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(inquiries.map(i => i.id));
                        else setSelectedIds([]);
                      }}
                      className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Type & Service</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inquiries.map((inquiry) => {
                  const statusInfo = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG['new'];
                  const isSelected = selectedIds.includes(inquiry.id);
                  const isNew = inquiry.status === 'new';

                  return (
                    <tr
                      key={inquiry.id}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isNew ? 'bg-red-500/[0.03]' : ''
                      }`}
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds(prev => [...prev, inquiry.id]);
                            else setSelectedIds(prev => prev.filter(id => id !== inquiry.id));
                          }}
                          className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {isNew && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />}
                          {inquiry.customerName || 'Anonymous Customer'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{inquiry.phone || 'No phone'}</span>
                          {inquiry.priority === 'urgent' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold uppercase">Urgent</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono border border-slate-700">
                            {inquiry.sourceType || 'Inquiry'}
                          </span>
                          <span className="truncate max-w-[180px] font-medium text-slate-200">
                            {inquiry.serviceRequested || inquiry.details?.bikeModel || 'General Request'}
                          </span>
                        </div>
                        {inquiry.message && (
                          <div className="text-slate-500 truncate max-w-[240px] text-[11px] mt-0.5">
                            {inquiry.message}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className={`text-[11px] font-medium px-2 py-1 rounded-md border ${statusInfo.bg} ${statusInfo.text} bg-slate-950 focus:outline-none`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="quote_sent">Quote Sent</option>
                          <option value="booked">Booked</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="spam">Spam</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <div className="text-[11px]">
                          {new Date(inquiry.createdAt || Date.now()).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(inquiry.createdAt || Date.now()).toLocaleTimeString('en-PK', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {inquiry.phone && (
                            <>
                              <button
                                onClick={() => openWhatsApp(inquiry.phone, inquiry.customerName)}
                                title="Chat on WhatsApp"
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openPhoneCall(inquiry.phone)}
                                title="Call Customer"
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                  {selectedInquiry.sourceType} Inquiry • {selectedInquiry.id}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedInquiry.customerName}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{selectedInquiry.phone}</span>
                  {selectedInquiry.email && <span>• {selectedInquiry.email}</span>}
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {selectedInquiry.phone && (
                <>
                  <button
                    onClick={() => openWhatsApp(selectedInquiry.phone, selectedInquiry.customerName)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Chat
                  </button>
                  <button
                    onClick={() => openPhoneCall(selectedInquiry.phone)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Direct
                  </button>
                </>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Service Requested</span>
                <span className="font-medium text-slate-200">{selectedInquiry.serviceRequested || 'General'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="quote_sent">Quote Sent</option>
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="spam">Spam</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {selectedInquiry.details && Object.entries(selectedInquiry.details).map(([k, v]) => (
                <div key={k}>
                  <span className="text-slate-500 block capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium text-slate-300">{String(v || '-')}</span>
                </div>
              ))}

              <div className="col-span-2">
                <span className="text-slate-500 block">Customer Message / Issue Details</span>
                <p className="mt-1 text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  {selectedInquiry.message || 'No written message provided.'}
                </p>
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-red-500" />
                Internal Admin Notes ({selectedInquiry.internalNotes?.length || 0})
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedInquiry.internalNotes && selectedInquiry.internalNotes.length > 0 ? (
                  selectedInquiry.internalNotes.map((note, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-semibold text-slate-400">{note.addedBy}</span>
                        <span>{new Date(note.addedAt).toLocaleString('en-PK')}</span>
                      </div>
                      <p className="text-slate-300">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-600 italic">No notes added yet.</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a private workshop note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNote(selectedInquiry.id);
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => handleAddNote(selectedInquiry.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
