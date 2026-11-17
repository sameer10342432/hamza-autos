import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  Star,
  Activity,
  FileText
} from 'lucide-react';
import { MechanicProfile, MechanicStatus, JobCard } from '../../types';
import { AdminApiService } from '../../services/adminApiService';
import { getStoredJobCards, updateJobCard } from '../../utils/workshopLogic';

interface MechanicManagementSectionProps {
  onNotify?: (msg: string) => void;
  onNavigateToJobCards?: () => void;
}

export const MechanicManagementSection: React.FC<MechanicManagementSectionProps> = ({
  onNotify = () => {},
  onNavigateToJobCards
}) => {
  const [mechanics, setMechanics] = useState<MechanicProfile[]>([]);
  const [jobCards, setJobCards] = useState<JobCard[]>(getStoredJobCards());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMechanic, setEditingMechanic] = useState<MechanicProfile | null>(null);
  const [assigningJobMechanic, setAssigningJobMechanic] = useState<MechanicProfile | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState<Partial<MechanicProfile>>({
    fullName: '',
    phoneNumber: '',
    whatsAppNumber: '',
    email: '',
    address: 'Badami Bagh, Lahore',
    joiningDate: new Date().toISOString().split('T')[0],
    specializations: ['Engine Repair'],
    skills: [],
    employmentStatus: 'Active',
    hourlyRate: 500,
    internalNotes: ''
  });

  const loadMechanics = async () => {
    try {
      setLoading(true);
      const res = await AdminApiService.getMechanics();
      if (res.success && res.mechanics) {
        setMechanics(res.mechanics);
      }
    } catch (err) {
      console.error('Failed to load mechanics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMechanics();
    setJobCards(getStoredJobCards());
  }, []);

  const filteredMechanics = mechanics.filter(m => {
    if (statusFilter !== 'all' && m.employmentStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchPhone = m.phoneNumber.includes(q);
      const matchSpec = m.specializations.some(s => s.toLowerCase().includes(q));
      return matchName || matchPhone || matchSpec;
    }
    return true;
  });

  // Calculate live workload per mechanic from actual Job Cards
  const getWorkload = (mechanicName: string) => {
    const active = jobCards.filter(j => 
      (j.assignedMechanicName === mechanicName || j.assignedMechanicId === mechanicName) &&
      !['Delivered', 'Completed'].includes(j.repairStatus)
    ).length;
    const completed = jobCards.filter(j => 
      (j.assignedMechanicName === mechanicName || j.assignedMechanicId === mechanicName) &&
      ['Delivered', 'Completed'].includes(j.repairStatus)
    ).length;
    return { active, completed };
  };

  const handleSaveMechanic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMechanic) {
        const res = await AdminApiService.updateMechanic(editingMechanic.id, formData);
        if (res.success) {
          setMechanics(prev => prev.map(m => m.id === editingMechanic.id ? res.mechanic : m));
          onNotify(`Mechanic ${res.mechanic.fullName} updated`);
        }
      } else {
        const res = await AdminApiService.createMechanic(formData);
        if (res.success) {
          setMechanics(prev => [...prev, res.mechanic]);
          onNotify(`Added ${res.mechanic.fullName} to workshop staff`);
        }
      }
      setShowAddModal(false);
      setEditingMechanic(null);
    } catch (err: any) {
      alert(`Error saving mechanic: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this mechanic from directory?')) return;
    try {
      await AdminApiService.deleteMechanic(id);
      setMechanics(prev => prev.filter(m => m.id !== id));
      onNotify('Mechanic profile removed');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleAssignJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningJobMechanic || !selectedJobId) return;

    // Update job card directly
    updateJobCard(selectedJobId, {
      assignedMechanicId: assigningJobMechanic.id,
      assignedMechanicName: assigningJobMechanic.fullName
    });
    setJobCards(getStoredJobCards());
    onNotify(`Assigned Job Card to ${assigningJobMechanic.fullName}`);
    setAssigningJobMechanic(null);
    setSelectedJobId('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            WORKSHOP OPERATIONS &amp; STAFF
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mechanic Management System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage certified bike mechanics, skills specialization, repair bay workload, and job card assignments.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMechanic(null);
            setFormData({
              fullName: '',
              phoneNumber: '',
              whatsAppNumber: '',
              email: '',
              address: 'Badami Bagh, Lahore',
              joiningDate: new Date().toISOString().split('T')[0],
              specializations: ['Engine Repair'],
              skills: [],
              employmentStatus: 'Active',
              hourlyRate: 500,
              internalNotes: ''
            });
            setShowAddModal(true);
          }}
          className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Mechanic</span>
        </button>
      </div>

      {/* 2. Mechanics Workload KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Staff</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{mechanics.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Master mechanics &amp; technicians</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active on Duty</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">
            {mechanics.filter(m => m.employmentStatus === 'Active').length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Bays manned currently</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Active Repairs</div>
          <div className="text-2xl font-black text-red-900 mt-1 tabular-nums">
            {jobCards.filter(j => !['Delivered', 'Completed'].includes(j.repairStatus)).length}
          </div>
          <div className="text-[11px] text-red-600 mt-0.5 font-medium">Bikes under maintenance</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Completed Jobs</div>
          <div className="text-2xl font-black text-blue-900 mt-1 tabular-nums">
            {jobCards.filter(j => ['Delivered', 'Completed'].includes(j.repairStatus)).length}
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5 font-medium">Verified repairs delivered</div>
        </div>
      </div>

      {/* 3. Search and Status Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mechanics by name, phone, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
        >
          <option value="all">All Employment Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* 4. Mechanics Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMechanics.map(m => {
          const workload = getWorkload(m.fullName);
          return (
            <div 
              key={m.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-red-900/20">
                      {m.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{m.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{m.phoneNumber}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    m.employmentStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {m.employmentStatus}
                  </span>
                </div>

                {/* Specializations Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {m.specializations.map(spec => (
                    <span 
                      key={spec}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Workload Metric Pills */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div>
                    <div className="text-lg font-black text-red-600 tabular-nums">{workload.active}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Active Jobs</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-800 tabular-nums">{workload.completed}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Delivered</div>
                  </div>
                </div>

                {m.internalNotes && (
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {m.internalNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setAssigningJobMechanic(m)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] shadow-xs transition-colors cursor-pointer"
                >
                  Assign Job Card
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingMechanic(m);
                      setFormData(m);
                      setShowAddModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                    title="Edit Profile"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Assign Job Card Modal */}
      {assigningJobMechanic && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Assign Job to {assigningJobMechanic.fullName}
              </h3>
              <button onClick={() => setAssigningJobMechanic(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAssignJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Active Job Card *
                </label>
                <select
                  required
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-red-500"
                >
                  <option value="">-- Choose Job Card from Bay --</option>
                  {jobCards
                    .filter(j => !['Delivered', 'Completed'].includes(j.repairStatus))
                    .map(j => (
                      <option key={j.id} value={j.id}>
                        {j.jobCardNumber} — {j.customerName} ({j.bikeBrand} {j.bikeModel}) · {j.repairStatus}
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningJobMechanic(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedJobId}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add / Edit Mechanic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingMechanic ? 'Edit Mechanic Profile' : 'Add New Mechanic'}
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMechanic} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Bilal Ahmad"
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
                    placeholder="0301 7788990"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={formData.employmentStatus || 'Active'}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as MechanicStatus })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  value={formData.specializations?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    specializations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                  })}
                  placeholder="Engine Repair, Motorcycle Tuning, Brake Repair"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Bay Allocation</label>
                <textarea
                  rows={2}
                  value={formData.internalNotes || ''}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  placeholder="Specialist for 4-stroke engines, allocated Bay 1..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingMechanic ? 'Update Profile' : 'Save Mechanic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
