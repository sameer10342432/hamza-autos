import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  Printer, 
  MessageCircle, 
  FileText, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { JobCard, RepairStatus, StaffMember } from '../../types';
import { SERVICES_LIST } from '../../data/businessData';
import { generatePreparedWhatsApp } from '../../utils/workshopLogic';

interface JobCardsTabProps {
  jobCards: JobCard[];
  staff: StaffMember[];
  onSaveJobCard: (jobCard: Partial<JobCard> & { customerName: string; phoneNumber: string; bikeBrand: string; bikeModel: string; customerComplaint: string; initialInspectionNotes: string; requiredServices: string[]; estimatedCost: number; finalCost: number; expectedCompletionDate: string; repairStatus: RepairStatus }) => void;
  onUpdateStatus: (id: string, status: RepairStatus) => void;
  onDeleteJobCard: (id: string) => void;
  onPrintJobCard: (jobCard: JobCard) => void;
  onGenerateInvoiceFromJob: (jobCard: JobCard) => void;
}

export const JobCardsTab: React.FC<JobCardsTabProps> = ({
  jobCards,
  staff,
  onSaveJobCard,
  onUpdateStatus,
  onDeleteJobCard,
  onPrintJobCard,
  onGenerateInvoiceFromJob
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<JobCard | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bikeBrand, setBikeBrand] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('CD 70');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [customerComplaint, setCustomerComplaint] = useState('');
  const [initialInspectionNotes, setInitialInspectionNotes] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [estimatedCost, setEstimatedCost] = useState<number>(1500);
  const [finalCost, setFinalCost] = useState<number>(1500);
  const [assignedMechanicId, setAssignedMechanicId] = useState('');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [repairStatus, setRepairStatus] = useState<RepairStatus>('Received');

  const openCreateModal = () => {
    setEditingCard(null);
    setCustomerName('');
    setPhoneNumber('');
    setBikeBrand('Honda');
    setBikeModel('CD 70');
    setRegistrationNumber('');
    setCustomerComplaint('');
    setInitialInspectionNotes('Preliminary visual check completed.');
    setSelectedServices(['General Tuning & Fuel Economy Optimization']);
    setEstimatedCost(1500);
    setFinalCost(1500);
    setAssignedMechanicId(staff[0]?.id || '');
    setExpectedCompletionDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setRepairStatus('Received');
    setShowModal(true);
  };

  const openEditModal = (card: JobCard) => {
    setEditingCard(card);
    setCustomerName(card.customerName);
    setPhoneNumber(card.phoneNumber);
    setBikeBrand(card.bikeBrand);
    setBikeModel(card.bikeModel);
    setRegistrationNumber(card.registrationNumber || '');
    setCustomerComplaint(card.customerComplaint);
    setInitialInspectionNotes(card.initialInspectionNotes);
    setSelectedServices(card.requiredServices || []);
    setEstimatedCost(card.estimatedCost || 0);
    setFinalCost(card.finalCost || 0);
    setAssignedMechanicId(card.assignedMechanicId || '');
    setExpectedCompletionDate(card.expectedCompletionDate);
    setRepairStatus(card.repairStatus);
    setShowModal(true);
  };

  const handleToggleService = (title: string) => {
    if (selectedServices.includes(title)) {
      setSelectedServices(selectedServices.filter(s => s !== title));
    } else {
      setSelectedServices([...selectedServices, title]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber) return;

    const assignedStaff = staff.find(s => s.id === assignedMechanicId);

    onSaveJobCard({
      ...(editingCard ? { id: editingCard.id, jobCardNumber: editingCard.jobCardNumber, createdDate: editingCard.createdDate } : {}),
      customerName,
      phoneNumber,
      bikeBrand,
      bikeModel,
      registrationNumber,
      customerComplaint,
      initialInspectionNotes,
      requiredServices: selectedServices,
      estimatedCost: Number(estimatedCost),
      finalCost: Number(finalCost),
      assignedMechanicId,
      assignedMechanicName: assignedStaff ? assignedStaff.name : 'Hamza Mechanics',
      expectedCompletionDate,
      repairStatus,
      photosBefore: editingCard?.photosBefore || ['/assets/images/services/motorcycle-engine-repair.jpg'],
      photosAfter: editingCard?.photosAfter || ['/assets/images/home/motorcycle-service-bay-presence.jpg']
    });

    setShowModal(false);
  };

  // Filter logic
  const filteredCards = jobCards.filter(card => {
    const matchesSearch = 
      card.jobCardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.phoneNumber.includes(searchQuery) ||
      (card.registrationNumber && card.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || card.repairStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'Received':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Diagnosis':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Parts Waiting':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Work In Progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Testing & Quality Check':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Ready for Delivery':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold';
      case 'Delivered':
        return 'bg-slate-200 text-slate-600 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Job #, Name, Phone, Reg #..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Received">Received</option>
            <option value="Diagnosis">Diagnosis</option>
            <option value="Parts Waiting">Parts Waiting</option>
            <option value="Work In Progress">Work In Progress</option>
            <option value="Testing & Quality Check">Testing &amp; QC</option>
            <option value="Ready for Delivery">Ready for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Digital Job Card
        </button>
      </div>

      {/* Job Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Job Card #</th>
                <th className="py-3 px-4 font-bold">Customer &amp; Contact</th>
                <th className="py-3 px-4 font-bold">Motorcycle Details</th>
                <th className="py-3 px-4 font-bold">Complaint &amp; Service</th>
                <th className="py-3 px-4 font-bold">Estimated Cost</th>
                <th className="py-3 px-4 font-bold">Status Pipeline</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No motorcycle job cards match your criteria.
                  </td>
                </tr>
              ) : (
                filteredCards.map(card => {
                  const estimateWhatsApp = generatePreparedWhatsApp('job_estimate', {
                    customerName: card.customerName,
                    phoneNumber: card.phoneNumber,
                    jobCardNumber: card.jobCardNumber,
                    bikeBrand: card.bikeBrand,
                    bikeModel: card.bikeModel,
                    totalCost: card.estimatedCost,
                    completionTime: card.expectedCompletionDate
                  });

                  const readyWhatsApp = generatePreparedWhatsApp('ready_for_pickup', {
                    customerName: card.customerName,
                    phoneNumber: card.phoneNumber,
                    jobCardNumber: card.jobCardNumber,
                    bikeBrand: card.bikeBrand,
                    bikeModel: card.bikeModel,
                    totalCost: card.finalCost || card.estimatedCost
                  });

                  return (
                    <tr key={card.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-black text-red-600 block text-xs">
                          {card.jobCardNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {card.createdDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium">
                        <span className="font-bold text-slate-900 block">{card.customerName}</span>
                        <a href={`tel:${card.phoneNumber}`} className="text-red-600 font-mono text-[11px] hover:underline">
                          {card.phoneNumber}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{card.bikeBrand} {card.bikeModel}</span>
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {card.registrationNumber || 'No Plate Recorded'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-800 truncate" title={card.customerComplaint}>
                          {card.customerComplaint || 'Standard periodic maintenance'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                          Mech: <strong>{card.assignedMechanicName || 'Unassigned'}</strong>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        PKR {(card.finalCost || card.estimatedCost || 0).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={card.repairStatus}
                          onChange={(e) => onUpdateStatus(card.id, e.target.value as RepairStatus)}
                          className={`py-1 px-2.5 rounded-lg border text-[11px] font-semibold cursor-pointer focus:outline-hidden ${getStatusBadge(card.repairStatus)}`}
                        >
                          <option value="Received">Received</option>
                          <option value="Diagnosis">Diagnosis</option>
                          <option value="Parts Waiting">Parts Waiting</option>
                          <option value="Work In Progress">Work In Progress</option>
                          <option value="Testing & Quality Check">Testing &amp; QC</option>
                          <option value="Ready for Delivery">Ready for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* 1-Click WhatsApp update */}
                          {card.repairStatus === 'Ready for Delivery' ? (
                            <a
                              href={readyWhatsApp.waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Send 'Ready for Pickup' WhatsApp alert"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <a
                              href={estimateWhatsApp.waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                              title="Send Job Estimate WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Print A4 Job Card */}
                          <button
                            onClick={() => onPrintJobCard(card)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Print A4 Job Card"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Generate Invoice shortcut */}
                          <button
                            onClick={() => onGenerateInvoiceFromJob(card)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Create Invoice from this Job Card"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => openEditModal(card)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Edit Job Card"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteJobCard(card.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete Job Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit Job Card */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCard ? `Edit Job Card (${editingCard.jobCardNumber})` : 'New Motorcycle Repair Job Card'}
                </h3>
                <p className="text-xs text-slate-500">Record customer complaints, assign mechanics and estimate repairs</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Bilal"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Brand</label>
                  <select
                    value={bikeBrand}
                    onChange={(e) => setBikeBrand(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="United">United</option>
                    <option value="Road Prince">Road Prince</option>
                    <option value="Crown">Crown</option>
                    <option value="Hi-Speed">Hi-Speed</option>
                    <option value="Other">Other Chinese / Local Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Model &amp; Year</label>
                  <input
                    type="text"
                    required
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    placeholder="e.g. CD 70 Dream (2024)"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Plate (Optional)</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. LEN-23-4412"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Mechanic</label>
                  <select
                    value={assignedMechanicId}
                    onChange={(e) => setAssignedMechanicId(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  >
                    <option value="">Workshop Pool / Unassigned</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Complaint / Symptoms *</label>
                <textarea
                  rows={2}
                  required
                  value={customerComplaint}
                  onChange={(e) => setCustomerComplaint(e.target.value)}
                  placeholder="e.g. White smoke from exhaust, excessive oil consumption, gears slipping..."
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Inspection &amp; Diagnosis Notes</label>
                <textarea
                  rows={2}
                  value={initialInspectionNotes}
                  onChange={(e) => setInitialInspectionNotes(e.target.value)}
                  placeholder="e.g. Piston rings worn out, carburetor dirty, cylinder bore required."
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                />
              </div>

              {/* Service Checkboxes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Select Services Included:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {SERVICES_LIST.map(srv => (
                    <label key={srv.id} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(srv.title)}
                        onChange={() => handleToggleService(srv.title)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span className="truncate">{srv.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Cost (PKR)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Final Bill (PKR)</label>
                  <input
                    type="number"
                    value={finalCost}
                    onChange={(e) => setFinalCost(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Completion</label>
                  <input
                    type="date"
                    value={expectedCompletionDate}
                    onChange={(e) => setExpectedCompletionDate(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={repairStatus}
                  onChange={(e) => setRepairStatus(e.target.value as RepairStatus)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                >
                  <option value="Received">Received (In Intake)</option>
                  <option value="Diagnosis">Inspection &amp; Diagnosis</option>
                  <option value="Parts Waiting">Waiting for Spare Parts</option>
                  <option value="Work In Progress">Work In Progress</option>
                  <option value="Testing & Quality Check">Testing &amp; Quality Check</option>
                  <option value="Ready for Delivery">Ready for Customer Delivery</option>
                  <option value="Delivered">Delivered &amp; Handed Over</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
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
                  {editingCard ? 'Save Changes' : 'Create Job Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
