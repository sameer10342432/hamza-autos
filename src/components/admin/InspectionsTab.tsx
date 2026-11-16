import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Printer,
  MessageCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  Calendar,
  FileText,
  Trash2
} from 'lucide-react';
import { inspectionService, whatsappService } from '../../services';
import { BikeInspectionReport, InspectionItem } from '../../types';

interface InspectionsTabProps {
  onRefreshStats?: () => void;
}

const DEFAULT_COMPONENTS = [
  'Engine Condition & Compression',
  'Engine Oil Level & Viscosity',
  'Front & Rear Brake Shoes / Pads',
  'Front Tyre Tread Depth & Pressure',
  'Rear Tyre Tread Depth & Pressure',
  'Battery Voltage & Terminal Health',
  'Headlight & High/Low Beam Focus',
  'Turn Indicators & Hazard Warning',
  'Main Wiring Harness & CDI Ignition',
  'Drive Chain Tension & Sprocket Teeth',
  'Clutch Cable Freeplay & Friction Plates',
  'Front Telescopic & Rear Shock Absorbers',
  'Steering Cone Bearings & Handle Alignment',
  'Electric Horn & Handlebar Switchgear',
  'Fuel Line, Petcock & Carburetor / EFI',
  'Chassis Frame, Nuts, Bolts & Roadworthiness'
];

export const InspectionsTab: React.FC<InspectionsTabProps> = ({ onRefreshStats }) => {
  const [inspections, setInspections] = useState<BikeInspectionReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<BikeInspectionReport | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Inspection Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bikeBrand, setBikeBrand] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('CD 70');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [inspectorName, setInspectorName] = useState('Master Mechanic Hamza');
  const [overallCondition, setOverallCondition] = useState<'Good' | 'Fair' | 'Requires Immediate Attention'>('Good');
  const [maintenanceUrgency, setMaintenanceUrgency] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [estimatedCost, setEstimatedCost] = useState(1500);
  const [technicianNotes, setTechnicianNotes] = useState('Clean spark plug and adjusted chain slack.');
  const [items, setItems] = useState<InspectionItem[]>(
    DEFAULT_COMPONENTS.map(name => ({
      componentName: name,
      status: 'Good',
      notes: 'Inspected and passed standard tolerances'
    }))
  );

  const loadInspections = async () => {
    try {
      const all = await inspectionService.getAll();
      setInspections(all);
    } catch (err) {
      console.error('Failed to load inspections', err);
    }
  };

  useEffect(() => {
    loadInspections();
  }, []);

  const handleComponentStatusChange = (index: number, status: InspectionItem['status']) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status };
      return updated;
    });
  };

  const handleComponentNotesChange = (index: number, notes: string) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], notes };
      return updated;
    });
  };

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    try {
      const created = await inspectionService.create({
        customerName,
        customerPhone,
        bikeBrand,
        bikeModel,
        registrationNumber: registrationNumber || undefined,
        inspectorName,
        overallCondition,
        maintenanceUrgency,
        estimatedCost: Number(estimatedCost) || 0,
        technicianNotes,
        recommendedRepairs: items
          .filter(i => i.status === 'Requires Repair' || i.status === 'Needs Attention')
          .map(i => `${i.componentName}: ${i.notes || 'Service or replacement required'}`),
        items
      });

      await loadInspections();
      setSelectedInspection(created);
      setShowCreateModal(false);
      onRefreshStats?.();
    } catch (err) {
      console.error('Failed to create inspection report', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this inspection report?')) {
      await inspectionService.delete(id);
      await loadInspections();
      if (selectedInspection?.id === id) setSelectedInspection(null);
      onRefreshStats?.();
    }
  };

  const filtered = inspections.filter(ins => {
    const term = searchTerm.toLowerCase();
    return (
      ins.inspectionNumber.toLowerCase().includes(term) ||
      ins.customerName.toLowerCase().includes(term) ||
      ins.customerPhone.includes(term) ||
      ins.bikeModel.toLowerCase().includes(term) ||
      (ins.registrationNumber && ins.registrationNumber.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <span>16-Point Motorcycle Health Inspections ({inspections.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Standardized mechanical &amp; electrical checklist stored locally in browser IndexedDB
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New 16-Point Inspection</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by customer name, phone, inspection # or bike model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 pl-9 pr-4 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Main Grid: List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inspection Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No inspection reports found. Click &quot;New 16-Point Inspection&quot; to perform an audit.
            </div>
          ) : (
            filtered.map((ins) => {
              const isSelected = selectedInspection?.id === ins.id;
              return (
                <div
                  key={ins.id}
                  onClick={() => setSelectedInspection(ins)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-600">
                      {ins.inspectionNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ins.overallCondition === 'Good' ? 'bg-emerald-100 text-emerald-800' :
                      ins.overallCondition === 'Fair' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ins.overallCondition}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-1">
                    {ins.customerName} · {ins.bikeBrand} {ins.bikeModel}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{new Date(ins.inspectionDate).toLocaleDateString()}</span>
                    <span>Est: PKR {(ins.estimatedCost || 0).toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed 16-Point Report View */}
        <div className="lg:col-span-7">
          {selectedInspection ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-600">
                      {selectedInspection.inspectionNumber}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">
                      {new Date(selectedInspection.inspectionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {selectedInspection.customerName} ({selectedInspection.customerPhone})
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedInspection.bikeBrand} {selectedInspection.bikeModel} {selectedInspection.registrationNumber ? `· Reg: ${selectedInspection.registrationNumber}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer"
                    title="Print Inspection"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <a
                    href={whatsappService.buildInspectionLink(selectedInspection.inspectionNumber, selectedInspection.overallCondition, selectedInspection.customerPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => handleDelete(selectedInspection.id)}
                    className="p-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl cursor-pointer"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 16-point component breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  16 Inspection Checkpoints
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-96 overflow-y-auto pr-1">
                  {selectedInspection.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span className="truncate pr-1">{item.componentName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                          item.status === 'Good' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'Needs Attention' ? 'bg-amber-100 text-amber-800' :
                          item.status === 'Requires Repair' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{item.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Notes */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <span className="font-bold block">Technician Feedback:</span>
                <p>{selectedInspection.technicianNotes || 'All normal tolerances satisfied.'}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Select an inspection report on the left to review the 16-point checklist.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CREATE 16-POINT INSPECTION */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>New 16-Point Inspection Diagnostic</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    placeholder="e.g. Tariq Mahmood"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    placeholder="e.g. 0300 1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <select
                    value={bikeBrand}
                    onChange={(e) => setBikeBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="United">United</option>
                    <option value="Road Prince">Road Prince</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    placeholder="e.g. CG 125"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reg # (Optional)</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    placeholder="e.g. LEB-21-9988"
                  />
                </div>
              </div>

              {/* 16 Checkpoints Editor */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block mb-2">16 Diagnostic Checkpoints:</span>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-xs font-semibold text-slate-800 w-1/3 truncate">
                        {idx + 1}. {item.componentName}
                      </span>
                      <select
                        value={item.status}
                        onChange={(e) => handleComponentStatusChange(idx, e.target.value as any)}
                        className="p-1 rounded border border-slate-300 text-xs w-36"
                      >
                        <option value="Good">Good</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Requires Repair">Requires Repair</option>
                        <option value="Not Inspected">Not Inspected</option>
                        <option value="N/A">N/A</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Condition remarks..."
                        value={item.notes}
                        onChange={(e) => handleComponentNotesChange(idx, e.target.value)}
                        className="p-1 rounded border border-slate-300 text-xs flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overall Condition</label>
                  <select
                    value={overallCondition}
                    onChange={(e) => setOverallCondition(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Requires Immediate Attention">Requires Immediate Attention</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maintenance Urgency</label>
                  <select
                    value={maintenanceUrgency}
                    onChange={(e) => setMaintenanceUrgency(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Cost (PKR)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technician Advice</label>
                <textarea
                  rows={2}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
                >
                  Save &amp; Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
