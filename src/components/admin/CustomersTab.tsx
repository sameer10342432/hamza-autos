import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MessageCircle, 
  Wrench, 
  Calendar, 
  CreditCard, 
  Clock, 
  Bell, 
  FileText,
  UserCheck
} from 'lucide-react';
import { CustomerProfile, JobCard, WorkshopInvoice, AppointmentBooking } from '../../types';
import { buildWhatsAppLink } from '../../utils/businessLogic';

interface CustomersTabProps {
  customers: CustomerProfile[];
  jobCards: JobCard[];
  invoices: WorkshopInvoice[];
  bookings: AppointmentBooking[];
  onUpdateCustomer: (id: string, updates: Partial<CustomerProfile>) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  jobCards,
  invoices,
  bookings,
  onUpdateCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [internalNotes, setInternalNotes] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phoneNumber.includes(searchQuery) ||
    (c.registrationNumber && c.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenProfile = (c: CustomerProfile) => {
    setSelectedCustomer(c);
    setInternalNotes(c.notes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    onUpdateCustomer(selectedCustomer.id, { notes: internalNotes });
    setSelectedCustomer({ ...selectedCustomer, notes: internalNotes });
  };

  const handleToggleReminders = () => {
    if (!selectedCustomer) return;
    const newVal = !selectedCustomer.optInReminders;
    onUpdateCustomer(selectedCustomer.id, { optInReminders: newVal });
    setSelectedCustomer({ ...selectedCustomer, optInReminders: newVal });
  };

  // Find linked customer records
  const linkedJobs = selectedCustomer ? jobCards.filter(j => j.phoneNumber.replace(/\s+/g, '') === selectedCustomer.phoneNumber.replace(/\s+/g, '')) : [];
  const linkedInvoices = selectedCustomer ? invoices.filter(i => i.phoneNumber.replace(/\s+/g, '') === selectedCustomer.phoneNumber.replace(/\s+/g, '')) : [];
  const linkedBookings = selectedCustomer ? bookings.filter(b => b.phoneNumber.replace(/\s+/g, '') === selectedCustomer.phoneNumber.replace(/\s+/g, '')) : [];

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by Name, Phone, Area, Plate #..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filtered.length}</strong> motorcycle riders in CRM
        </div>
      </div>

      {/* Customer CRM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => {
          const custJobs = jobCards.filter(j => j.phoneNumber.replace(/\s+/g, '') === cust.phoneNumber.replace(/\s+/g, ''));
          const custInvoices = invoices.filter(i => i.phoneNumber.replace(/\s+/g, '') === cust.phoneNumber.replace(/\s+/g, ''));
          const totalSpent = custInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);

          return (
            <div
              key={cust.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{cust.name}</h3>
                    <a
                      href={`tel:${cust.phoneNumber}`}
                      className="text-xs font-mono text-red-600 font-semibold hover:underline"
                    >
                      {cust.phoneNumber}
                    </a>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    {cust.area || 'Badami Bagh'}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Bike:</span>
                    <strong className="text-slate-900">{cust.bikeBrand} {cust.bikeModel}</strong>
                  </div>
                  {cust.registrationNumber && (
                    <div className="flex justify-between text-slate-600">
                      <span>Plate #:</span>
                      <strong className="font-mono text-slate-900">{cust.registrationNumber}</strong>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Workshop Visits:</span>
                    <strong className="text-red-600">{custJobs.length} Job Cards</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Spent:</span>
                    <strong className="font-mono text-emerald-700">PKR {totalSpent.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <a
                  href={`https://wa.me/${cust.phoneNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1 font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => handleOpenProfile(cust)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Full History →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Profile & History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500">Registered Customer Profile · {selectedCustomer.area}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* Profile Overview Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedCustomer.phoneNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Motorcycle</span>
                <span className="font-bold text-slate-900">{selectedCustomer.bikeBrand} {selectedCustomer.bikeModel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration</span>
                <span className="font-mono font-bold text-slate-900">{selectedCustomer.registrationNumber || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Reminder Opt-In</span>
                <button
                  onClick={handleToggleReminders}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 cursor-pointer ${
                    selectedCustomer.optInReminders ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedCustomer.optInReminders ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Job Card Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-red-600" />
                Workshop Job Card History ({linkedJobs.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {linkedJobs.length === 0 ? (
                  <div className="p-3 bg-slate-50 text-slate-400 text-xs rounded-lg text-center">
                    No job cards linked yet.
                  </div>
                ) : (
                  linkedJobs.map(job => (
                    <div key={job.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-red-600 block">{job.jobCardNumber}</span>
                        <span className="text-slate-700 font-medium">{job.customerComplaint}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Date: {job.createdDate} · Status: {job.repairStatus}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        PKR {(job.finalCost || job.estimatedCost).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Invoices Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Invoices &amp; Payments ({linkedInvoices.length})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {linkedInvoices.length === 0 ? (
                  <div className="p-3 bg-slate-50 text-slate-400 text-xs rounded-lg text-center">
                    No invoices generated yet.
                  </div>
                ) : (
                  linkedInvoices.map(inv => (
                    <div key={inv.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-semibold text-slate-900">{inv.invoiceNumber}</span>
                        <span className="text-[10px] text-slate-500 ml-2">{inv.invoiceDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">PKR {inv.totalAmount.toLocaleString()}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          {inv.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Internal Customer Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                Internal Workshop Notes &amp; Rider Preferences
              </label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="e.g. Regular rider, prefers Havoline 20W-50 oil, asks for chain lube check..."
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
