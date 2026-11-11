import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Wrench, 
  ShieldCheck, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Edit,
  Eye
} from 'lucide-react';
import { StaffMember, StaffRole, JobCard } from '../../types';

interface StaffTabProps {
  staff: StaffMember[];
  jobCards: JobCard[];
  onSaveStaff: (member: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
  activeRoleView: string;
  onSelectRoleView: (role: string) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  staff,
  jobCards,
  onSaveStaff,
  onDeleteStaff,
  activeRoleView,
  onSelectRoleView
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<StaffRole>('Mechanic');
  const [specialtiesStr, setSpecialtiesStr] = useState('Engine Overhaul, Tuning');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');

  const openCreate = () => {
    setEditingStaff(null);
    setName('');
    setPhoneNumber('0325 1814548');
    setRole('Mechanic');
    setSpecialtiesStr('Engine Tuning, Carburetor ultrasonic cleaning');
    setStatus('Active');
    setShowModal(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setName(s.name);
    setPhoneNumber(s.phoneNumber);
    setRole(s.role);
    setSpecialtiesStr(s.specialties.join(', '));
    setStatus(s.status);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phoneNumber) return;

    onSaveStaff({
      id: editingStaff?.id || `stf-${Date.now()}`,
      name,
      phoneNumber,
      role,
      specialties: specialtiesStr.split(',').map(s => s.trim()).filter(Boolean),
      status,
      joinedDate: editingStaff?.joinedDate || new Date().toISOString().split('T')[0]
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Role View Switcher Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
            Role-Based Access Control Simulation
          </span>
          <h3 className="text-sm font-bold text-white mt-0.5">
            Current Portal View: <span className="text-red-400 font-extrabold">{activeRoleView}</span>
          </h3>
          <p className="text-xs text-slate-400">
            Switch perspective to test the workshop workflow for technicians and floor managers
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl text-xs">
          <button
            onClick={() => onSelectRoleView('Super Admin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeRoleView === 'Super Admin' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Super Admin
          </button>
          <button
            onClick={() => onSelectRoleView('Workshop Manager')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeRoleView === 'Workshop Manager' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Manager
          </button>
          <button
            onClick={() => onSelectRoleView('Mechanic')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeRoleView === 'Mechanic' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Mechanic (Floor Bay)
          </button>
        </div>
      </div>

      {/* Staff Actions Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Workshop Mechanics &amp; Staff</h3>
          <p className="text-xs text-slate-500">Manage mechanics, assign repair bays and track individual workloads</p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => {
          const assignedJobs = jobCards.filter(j => 
            j.assignedMechanicId === member.id && !['Delivered', 'Completed'].includes(j.repairStatus)
          );

          return (
            <div
              key={member.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-50 text-red-700 font-bold text-[10px] rounded uppercase">
                      {member.role}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    member.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{member.phoneNumber}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200">
                    <span>Active Repairs on Bay:</span>
                    <strong className="font-mono text-red-600 font-bold text-sm">
                      {assignedJobs.length} Bikes
                    </strong>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Specialties</span>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((spec, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => openEdit(member)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit staff details"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteStaff(member.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove staff member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit Staff */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingStaff ? `Edit Staff Member (${editingStaff.name})` : 'Add New Mechanic / Staff Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ustad Hamza / Bilal Ahmed"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0325 1814548"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Workshop Manager">Workshop Manager</option>
                    <option value="Mechanic">Mechanic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specialties (Comma-separated)
                </label>
                <input
                  type="text"
                  value={specialtiesStr}
                  onChange={(e) => setSpecialtiesStr(e.target.value)}
                  placeholder="Engine Overhaul, Tuning, Wiring, Brake Relining"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
