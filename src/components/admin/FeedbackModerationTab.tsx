import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  EyeOff,
  Search,
  Filter,
  Trash2,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { feedbackService } from '../../services';
import { CustomerFeedbackRecord } from '../../types';

interface FeedbackModerationTabProps {
  onNotify?: (msg: string) => void;
}

export const FeedbackModerationTab: React.FC<FeedbackModerationTabProps> = ({ onNotify }) => {
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected' | 'Hidden'>('all');

  const loadFeedbacks = async () => {
    try {
      const all = await feedbackService.getAll();
      setFeedbacks(all);
    } catch (err) {
      console.error('Failed to load feedback', err);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleUpdateStatus = async (id: string, status: CustomerFeedbackRecord['status']) => {
    try {
      await feedbackService.updateStatus(id, status);
      await loadFeedbacks();
      onNotify?.(`Feedback marked as ${status}.`);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await feedbackService.toggleFeatured(id);
      await loadFeedbacks();
      onNotify?.('Featured status updated.');
    } catch (err) {
      console.error('Failed to toggle featured', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Permanently delete this customer feedback entry?')) {
      await feedbackService.delete(id);
      await loadFeedbacks();
      onNotify?.('Feedback entry deleted.');
    }
  };

  const filtered = feedbacks.filter(fb => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      fb.customerName.toLowerCase().includes(term) ||
      (fb.customerPhone || fb.phoneNumber || '').includes(term) ||
      (fb.bikeModel || '').toLowerCase().includes(term) ||
      (fb.comments || fb.comment || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || fb.status === statusFilter || (statusFilter === 'Pending' && fb.status === 'Pending Approval');
    return matchesSearch && matchesStatus;
  });

  const pendingCount = feedbacks.filter(f => f.status === 'Pending' || f.status === 'Pending Approval').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Feature 10: Feedback Moderation
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-1">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Customer Feedback &amp; Review Moderation Pipeline ({feedbacks.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Moderate genuine customer feedback. Only &quot;Approved&quot; reviews are displayed on the public website.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by customer name, phone, bike or review text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-9 pr-4 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs font-semibold">
          {(['all', 'Pending', 'Approved', 'Rejected', 'Hidden'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'all' ? `All (${feedbacks.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No customer feedback records match the current filter.
          </div>
        ) : (
          filtered.map((fb) => (
            <div
              key={fb.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= fb.overallRating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {fb.customerName}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {fb.bikeModel || (fb as any).bookingOrJobCardRef || 'Motorcycle'} · {fb.customerPhone || fb.phoneNumber || '0300 1234567'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    fb.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    (fb.status === 'Pending' || fb.status === 'Pending Approval') ? 'bg-amber-100 text-amber-800' :
                    fb.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {fb.status}
                  </span>

                  {fb.isFeatured && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-600" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{fb.comments || fb.comment}&rdquo;
              </p>

              {/* Sub-ratings */}
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Service Quality: <strong className="text-slate-800">{fb.serviceQualityRating || 5}/5</strong></span>
                <span>Staff Behavior: <strong className="text-slate-800">{fb.staffBehaviorRating || (fb as any).staffBehaviourRating || 5}/5</strong></span>
                <span>Pricing: <strong className="text-slate-800">{fb.pricingRating || (fb as any).workQualityRating || 5}/5</strong></span>
                <span className="ml-auto text-slate-400">{(fb.submittedAt || fb.createdAt || '').slice(0, 10) || 'Recent'}</span>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleToggleFeatured(fb.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{fb.isFeatured ? 'Unfeature Review' : 'Feature on Homepage'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {fb.status !== 'Approved' && (
                    <button
                      onClick={() => handleUpdateStatus(fb.id, 'Approved')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {fb.status !== 'Rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(fb.id, 'Rejected')}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {fb.status !== 'Hidden' && (
                    <button
                      onClick={() => handleUpdateStatus(fb.id, 'Hidden')}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(fb.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
