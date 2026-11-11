import React, { useState } from 'react';
import { 
  Bell, 
  MessageCircle, 
  Calendar, 
  Plus, 
  CheckCircle, 
  Clock, 
  Search, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { ServiceReminder } from '../../types';
import { generatePreparedWhatsApp } from '../../utils/workshopLogic';

interface RemindersTabProps {
  reminders: ServiceReminder[];
  onSaveReminder: (reminder: ServiceReminder) => void;
  onUpdateStatus: (id: string, status: 'Pending' | 'Sent' | 'Dismissed') => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersTab: React.FC<RemindersTabProps> = ({
  reminders,
  onSaveReminder,
  onUpdateStatus,
  onDeleteReminder
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bikeBrand, setBikeBrand] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('CD 70');
  const [serviceType, setServiceType] = useState('Engine Oil Change (1,000 km)');
  const [nextDueDate, setNextDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('Havoline 20W-50 oil replacement due.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber) return;

    onSaveReminder({
      id: `rem-${Date.now()}`,
      customerName,
      phoneNumber,
      bikeBrand,
      bikeModel,
      serviceType,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextDueDate,
      status: 'Pending',
      notes
    });

    setShowModal(false);
    setCustomerName('');
    setPhoneNumber('');
  };

  const filtered = reminders.filter(r => 
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phoneNumber.includes(searchQuery) ||
    r.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reminders by Name, Phone, Service..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Schedule Maintenance Reminder
        </button>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Customer Name</th>
                <th className="py-3 px-4 font-bold">Phone Number</th>
                <th className="py-3 px-4 font-bold">Motorcycle &amp; Due Service</th>
                <th className="py-3 px-4 font-bold">Next Due Date</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No service reminders scheduled.
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const reminderWhatsApp = generatePreparedWhatsApp('service_reminder', {
                    customerName: r.customerName,
                    phoneNumber: r.phoneNumber,
                    bikeBrand: r.bikeBrand,
                    bikeModel: r.bikeModel,
                    serviceType: r.serviceType
                  });

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {r.customerName}
                      </td>

                      <td className="py-3.5 px-4">
                        <a href={`tel:${r.phoneNumber}`} className="text-red-600 font-mono font-semibold hover:underline">
                          {r.phoneNumber}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{r.serviceType}</span>
                        <span className="text-[11px] text-slate-500">{r.bikeBrand} {r.bikeModel}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-red-500" />
                          <span>{r.nextDueDate}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'Sent' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'Dismissed' ? 'bg-slate-100 text-slate-600' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={reminderWhatsApp.waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onUpdateStatus(r.id, 'Sent')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                            title="Send personalized WhatsApp reminder"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Send WhatsApp
                          </a>

                          <button
                            onClick={() => onDeleteReminder(r.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete reminder"
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

      {/* Modal: Schedule Reminder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Schedule Service Reminder</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Usman Ali"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl"
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
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Brand</label>
                  <input
                    type="text"
                    value={bikeBrand}
                    onChange={(e) => setBikeBrand(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Model</label>
                  <input
                    type="text"
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Type Due</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl cursor-pointer"
                >
                  <option value="Engine Oil Change (1,000 km)">Engine Oil Change (1,000 km)</option>
                  <option value="General Periodic Tuning & Carburetor Clean">General Periodic Tuning &amp; Carburetor Clean</option>
                  <option value="Brake Shoes Inspection & Relining">Brake Shoes Inspection &amp; Relining</option>
                  <option value="Drive Chain Slack Adjustment & Lubrication">Drive Chain Slack Adjustment &amp; Lubrication</option>
                  <option value="Full Seasonal Pre-Summer Inspection">Full Seasonal Pre-Summer Inspection</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Due Date</label>
                <input
                  type="date"
                  required
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl"
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
