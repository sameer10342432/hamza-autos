import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  Edit, 
  Trash2, 
  UserCheck, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { LeadRecord, LeadStage, LeadPriority } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

const PIPELINE_STAGES: LeadStage[] = [
  'New Lead',
  'Contacted',
  'Interested',
  'Qualified',
  'Booking Requested',
  'Booking Confirmed',
  'Converted to Customer',
  'Lost'
];

interface CrmLeadsSectionProps {
  onNotify?: (msg: string) => void;
  onNavigateToCustomer?: (customerId: string) => void;
}

export const CrmLeadsSection: React.FC<CrmLeadsSectionProps> = ({ 
  onNotify = () => {},
  onNavigateToCustomer
}) => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadRecord | null>(null);
  const [convertingLead, setConvertingLead] = useState<LeadRecord | null>(null);
  const [convertCreateBooking, setConvertCreateBooking] = useState(true);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:30 AM');

  // Form State
  const [formData, setFormData] = useState<Partial<LeadRecord>>({
    customerName: '',
    phoneNumber: '',
    whatsAppNumber: '',
    bikeBrand: 'Honda',
    bikeModel: 'CD 70',
    interestedService: 'Engine Overhaul & Tuning',
    leadSource: 'Manual',
    priority: 'Medium',
    status: 'New Lead',
    estimatedValue: 2500,
    internalNotes: ''
  });

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await AdminApiService.getCrmLeads();
      if (res.success && res.leads) {
        setLeads(res.leads);
      }
    } catch (err) {
      console.error('Failed to load CRM leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = leads.filter(l => {
    if (selectedStage !== 'all' && l.status !== selectedStage) return false;
    if (selectedPriority !== 'all' && l.priority !== selectedPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = l.customerName.toLowerCase().includes(q);
      const matchPhone = l.phoneNumber.includes(q);
      const matchBike = l.bikeModel.toLowerCase().includes(q) || l.bikeBrand.toLowerCase().includes(q);
      const matchService = l.interestedService?.toLowerCase().includes(q);
      return matchName || matchPhone || matchBike || matchService;
    }
    return true;
  });

  // KPI Calculations
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New Lead').length;
  const qualifiedCount = leads.filter(l => l.status === 'Qualified').length;
  const convertedCount = leads.filter(l => l.status === 'Converted to Customer').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  const handleStageChange = async (leadId: string, newStage: LeadStage) => {
    try {
      const res = await AdminApiService.updateCrmLead(leadId, { status: newStage });
      if (res.success) {
        setLeads(prev => prev.map(l => l.id === leadId ? res.lead : l));
        onNotify(`Lead status updated to ${newStage}`);
      }
    } catch (err: any) {
      alert(`Error updating stage: ${err.message}`);
    }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        const res = await AdminApiService.updateCrmLead(editingLead.id, formData);
        if (res.success) {
          setLeads(prev => prev.map(l => l.id === editingLead.id ? res.lead : l));
          onNotify('Lead details updated successfully');
        }
      } else {
        const res = await AdminApiService.createCrmLead(formData);
        if (res.success) {
          setLeads(prev => [res.lead, ...prev]);
          onNotify(`Lead ${res.lead.customerName} created in CRM`);
        }
      }
      setShowAddModal(false);
      setEditingLead(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Delete this CRM lead permanently?')) return;
    try {
      await AdminApiService.deleteCrmLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      onNotify('Lead removed from CRM');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleConvertLead = async () => {
    if (!convertingLead) return;
    try {
      const res = await AdminApiService.convertCrmLead(convertingLead.id, {
        createBooking: convertCreateBooking,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime
      });
      if (res.success) {
        setLeads(prev => prev.map(l => l.id === convertingLead.id ? res.lead : l));
        onNotify(`Lead successfully converted to Customer ${res.customer.name}!`);
        setConvertingLead(null);
        if (onNavigateToCustomer && res.customer.id) {
          onNavigateToCustomer(res.customer.id);
        }
      }
    } catch (err: any) {
      alert(`Conversion error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            CUSTOMER RELATIONSHIP MANAGEMENT
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Advanced CRM &amp; Lead Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture, qualify, follow up, and convert customer leads into verified workshop jobs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'pipeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pipeline Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={() => {
              setEditingLead(null);
              setFormData({
                customerName: '',
                phoneNumber: '',
                whatsAppNumber: '',
                bikeBrand: 'Honda',
                bikeModel: 'CD 70',
                interestedService: 'General Tuning',
                leadSource: 'Manual',
                priority: 'Medium',
                status: 'New Lead',
                estimatedValue: 2000,
                internalNotes: ''
              });
              setShowAddModal(true);
            }}
            className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Lead</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Leads</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{totalLeads}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">All recorded prospects</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">New Leads</div>
          <div className="text-2xl font-black text-blue-900 mt-1 tabular-nums">{newLeadsCount}</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Require initial contact</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600">Qualified Leads</div>
          <div className="text-2xl font-black text-purple-900 mt-1 tabular-nums">{qualifiedCount}</div>
          <div className="text-[11px] text-purple-600 mt-0.5">Ready for booking</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Conversion Rate</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">{conversionRate}%</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">{convertedCount} converted to customers</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by customer name, phone, bike model, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-red-500"
          >
            <option value="all">All Pipeline Stages</option>
            {PIPELINE_STAGES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-red-500"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* 4. Main View: Pipeline Board or List */}
      {viewMode === 'pipeline' ? (
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-4 min-w-[1200px]">
            {PIPELINE_STAGES.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.status === stage);
              return (
                <div 
                  key={stage} 
                  className="w-72 bg-slate-100/90 rounded-2xl border border-slate-200 p-3.5 flex flex-col justify-between shrink-0"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 mb-3">
                    <span className="text-xs font-bold text-slate-800">{stage}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                    {stageLeads.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No leads in {stage}
                      </div>
                    ) : (
                      stageLeads.map(lead => (
                        <div 
                          key={lead.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-red-400 transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-slate-900">{lead.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{lead.phoneNumber}</div>
                            </div>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              lead.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
                              lead.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {lead.priority}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 font-medium line-clamp-2">
                            {lead.bikeBrand} {lead.bikeModel} · {lead.interestedService}
                          </div>

                          {lead.estimatedValue && lead.estimatedValue > 0 && (
                            <div className="text-[11px] font-bold text-emerald-700">
                              Est. PKR {lead.estimatedValue.toLocaleString()}
                            </div>
                          )}

                          {/* Quick Stage Mover & Conversion Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                              className="text-[10px] py-1 px-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold"
                            >
                              {PIPELINE_STAGES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1">
                              {lead.status !== 'Converted to Customer' && (
                                <button
                                  onClick={() => setConvertingLead(lead)}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 transition-colors"
                                  title="Convert to Customer & Booking"
                                >
                                  Convert
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingLead(lead);
                                  setFormData(lead);
                                  setShowAddModal(true);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-800 rounded"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Motorcycle</th>
                  <th className="py-3 px-4">Interested Service</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      No leads match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{lead.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{lead.phoneNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {lead.bikeBrand} {lead.bikeModel}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {lead.interestedService}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          {lead.leadSource}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
                          lead.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)}
                          className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-semibold"
                        >
                          {PIPELINE_STAGES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {lead.status !== 'Converted to Customer' && (
                            <button
                              onClick={() => setConvertingLead(lead)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Convert
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setFormData(lead);
                              setShowAddModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingLead ? 'Edit Lead Profile' : 'Create New CRM Lead'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName || ''}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="0300 1234567"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motorcycle Brand</label>
                  <select
                    value={formData.bikeBrand || 'Honda'}
                    onChange={(e) => setFormData({ ...formData, bikeBrand: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="United">United</option>
                    <option value="Road Prince">Road Prince</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Model</label>
                  <input
                    type="text"
                    value={formData.bikeModel || ''}
                    onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                    placeholder="e.g. CD 70 / YBR 125"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interested Service *</label>
                <input
                  type="text"
                  required
                  value={formData.interestedService || ''}
                  onChange={(e) => setFormData({ ...formData, interestedService: e.target.value })}
                  placeholder="e.g. Engine Overhaul, Bike Tuning, Disc Brake Repair"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority || 'Medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                  <select
                    value={formData.status || 'New Lead'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStage })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                  >
                    {PIPELINE_STAGES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Value (PKR)</label>
                  <input
                    type="number"
                    value={formData.estimatedValue || 0}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={formData.internalNotes || ''}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  placeholder="Notes about customer preferences, symptoms reported, agreed budget..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingLead ? 'Update Lead' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CONVERT LEAD MODAL */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Convert Lead to Customer</h3>
              <button 
                onClick={() => setConvertingLead(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Converting <strong>{convertingLead.customerName}</strong> ({convertingLead.phoneNumber}) will register or link a formal Customer Profile in your CRM directory.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div><strong>Bike:</strong> {convertingLead.bikeBrand} {convertingLead.bikeModel}</div>
              <div><strong>Service:</strong> {convertingLead.interestedService}</div>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={convertCreateBooking}
                  onChange={(e) => setConvertCreateBooking(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-0"
                />
                <span>Also generate Confirmed Workshop Appointment Booking</span>
              </label>

              {convertCreateBooking && (
                <div className="grid grid-cols-2 gap-2.5 p-3 bg-red-50/50 border border-red-100 rounded-xl">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      placeholder="10:30 AM"
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setConvertingLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConvertLead}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Confirm Conversion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
