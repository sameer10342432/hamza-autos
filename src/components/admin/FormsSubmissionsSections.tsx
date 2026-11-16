import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Send, 
  Star, 
  Phone, 
  MessageCircle, 
  Sliders, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

// =========================================================================
// SECTION 6: CONTACT FORM SUBMISSIONS VIEW
// =========================================================================
export const ContactSubmissionsSection: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getContactSubmissions();
      if (res.success) setSubmissions(res.submissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openWhatsApp = (phone: string, name: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const num = clean.startsWith('0') ? '92' + clean.slice(1) : (clean.startsWith('92') ? clean : '92' + clean);
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(`Salam ${name}, regarding your contact submission at Hamza Autos:`)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-500" />
            Contact Form Submissions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Direct customer inquiries submitted via the Contact page form stored in <code>storage/contact-submissions.json</code>.
          </p>
        </div>
        <button
          onClick={fetchContacts}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No contact submissions found in file storage.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {submissions.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">{item.name}</span>
                    <span className="text-xs text-slate-400 font-mono">{item.phone}</span>
                    {item.email && <span className="text-xs text-slate-500">({item.email})</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(item.submittedAt || item.createdAt || Date.now()).toLocaleString('en-PK')}</span>
                  </div>
                </div>

                <div className="text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  <span className="font-semibold text-red-400 block mb-1">Subject: {item.subject || 'General Inquiry'}</span>
                  {item.message}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => openWhatsApp(item.phone, item.name)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                  <a
                    href={`tel:${item.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 8: QUOTATION REQUESTS VIEW
// =========================================================================
export const QuotationRequestsSection: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getQuotationRequests();
      if (res.success) setQuotations(res.quotations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-purple-500" />
            Quotation & Estimate Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Engine overhaul and repair cost inquiries requested by website visitors.
          </p>
        </div>
        <button
          onClick={fetchQuotes}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading quotations...</div>
        ) : quotations.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No quotation requests in storage yet.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {quotations.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-sm text-white">{item.customerName || item.name}</span>
                    <span className="text-xs text-slate-400 font-mono ml-3">{item.phone}</span>
                    <span className="text-xs text-red-400 font-semibold ml-3">Bike: {item.bikeModel || item.bikeBrand || 'Motorcycle'}</span>
                  </div>
                  <span className="text-xs text-slate-400">{item.createdAt || 'Recent'}</span>
                </div>
                <div className="text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                  <div className="font-semibold text-slate-200 mb-1">Services: {item.servicesRequested?.join(', ') || item.serviceType || 'Overhaul Quote'}</div>
                  <p>{item.notes || item.problemDescription || 'Detailed estimate requested.'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 9: CUSTOMER FEEDBACK & REVIEWS MODERATION VIEW
// =========================================================================
export const CustomerFeedbackSection: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getFeedbackSubmissions();
      if (res.success) setFeedbackList(res.feedback || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await AdminApiService.updateFeedbackStatus(id, status);
      if (res.success) {
        setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, status } : f));
      }
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Customer Feedback & Reviews Moderation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Approve or reject customer reviews before they appear publicly on the Hamza Autos homepage & reviews section.
          </p>
        </div>
        <button
          onClick={fetchFeedback}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading customer feedback...</div>
        ) : feedbackList.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No customer reviews submitted yet.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {feedbackList.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">{item.customerName}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < (item.overallRating || item.rating || 5) ? 'fill-amber-400' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.status || 'pending'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {item.bikeModel} • {new Date(item.submittedAt || Date.now()).toLocaleDateString('en-PK')}
                  </span>
                </div>

                <p className="text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  "{item.comments || item.comment || item.feedbackText}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {item.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'approved')}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Approve for Public Website
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'rejected')}
                      className="px-3 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs font-semibold"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// SECTION 11: FORM MANAGEMENT & REGISTRY VIEW
// =========================================================================
export const FormManagementSection: React.FC = () => {
  const [registry, setRegistry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistry = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getFormsRegistry();
      if (res.success) setRegistry(res.forms || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const res = await AdminApiService.toggleFormActive(id, !current);
      if (res.success) {
        setRegistry(prev => prev.map(f => f.id === id ? { ...f, active: !current } : f));
      }
    } catch (e: any) {
      alert(`Toggle failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Website Form Management & Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global configuration and enable/disable switches for all forms embedded across the Hamza Autos website.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading form registry...</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {registry.map((form) => (
              <div key={form.id} className="p-5 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-white">{form.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      ID: {form.id}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      form.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {form.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{form.description}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                    <span>Endpoint: <code>{form.endpoint}</code></span>
                    <span>• Honeypot: {form.spamHoneypot ? 'Enabled' : 'Disabled'}</span>
                    <span>• Submissions: {form.totalSubmissions || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleToggle(form.id, form.active)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      form.active 
                        ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {form.active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                    {form.active ? 'Form Enabled' : 'Form Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
