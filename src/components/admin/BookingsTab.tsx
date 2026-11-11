import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wrench, 
  AlertTriangle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { AppointmentBooking, BookingStatus } from '../../types';
import { 
  APPOINTMENT_TIME_SLOTS, 
  isTimeSlotAvailable, 
  generatePreparedWhatsApp 
} from '../../utils/workshopLogic';

interface BookingsTabProps {
  bookings: AppointmentBooking[];
  onUpdateStatus: (id: string, status: BookingStatus, internalNotes?: string) => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
  onCreateBooking: (booking: any) => void;
  onConvertToJobCard: (booking: AppointmentBooking) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  onUpdateStatus,
  onReschedule,
  onCreateBooking,
  onConvertToJobCard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Reschedule Modal
  const [rescheduleBooking, setRescheduleBooking] = useState<AppointmentBooking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState(APPOINTMENT_TIME_SLOTS[0]);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // New Booking Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custBrand, setCustBrand] = useState('Honda');
  const [custModel, setCustModel] = useState('CD 70');
  const [custReg, setCustReg] = useState('');
  const [custService, setCustService] = useState('Bike Tuning & Fuel Economy Optimization');
  const [custDesc, setCustDesc] = useState('');
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookTime, setBookTime] = useState(APPOINTMENT_TIME_SLOTS[0]);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleOpenReschedule = (b: AppointmentBooking) => {
    setRescheduleBooking(b);
    setNewDate(b.appointmentDate);
    setNewTime(b.appointmentTime);
    setRescheduleError(null);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking) return;

    // Check capacity
    const available = isTimeSlotAvailable(newDate, newTime, rescheduleBooking.id);
    if (!available) {
      setRescheduleError(`Selected slot (${newDate} at ${newTime}) is fully booked (2/2 bikes capacity reached). Please choose a different hour.`);
      return;
    }

    onReschedule(rescheduleBooking.id, newDate, newTime);
    setRescheduleBooking(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    const available = isTimeSlotAvailable(bookDate, bookTime);
    if (!available) {
      setBookingError(`Selected time slot (${bookDate} at ${bookTime}) is at full capacity. Please select another slot.`);
      return;
    }

    onCreateBooking({
      customerName: custName,
      phoneNumber: custPhone,
      bikeBrand: custBrand,
      bikeModel: custModel,
      registrationNumber: custReg,
      serviceRequested: custService,
      problemDescription: custDesc || 'Customer walk-in / manual telephone appointment',
      appointmentDate: bookDate,
      appointmentTime: bookTime,
      status: 'Confirmed'
    });

    setShowCreateModal(false);
    setCustName('');
    setCustPhone('');
    setCustDesc('');
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phoneNumber.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'New Request':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Pending Confirmation':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'In Progress':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Booking #, Name, Phone..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Bookings</option>
            <option value="New Request">New Requests</option>
            <option value="Pending Confirmation">Pending Confirmation</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Direct Booking
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Booking #</th>
                <th className="py-3 px-4 font-bold">Customer Name</th>
                <th className="py-3 px-4 font-bold">Phone Number</th>
                <th className="py-3 px-4 font-bold">Motorcycle &amp; Service</th>
                <th className="py-3 px-4 font-bold">Appointment Slot</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No appointments match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map(b => {
                  const confirmWhatsApp = generatePreparedWhatsApp('booking_confirmation', {
                    customerName: b.customerName,
                    phoneNumber: b.phoneNumber,
                    bookingNumber: b.bookingNumber,
                    bikeBrand: b.bikeBrand,
                    bikeModel: b.bikeModel,
                    appointmentDate: b.appointmentDate,
                    appointmentTime: b.appointmentTime
                  });

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                        {b.bookingNumber}
                        <span className="block text-[10px] text-slate-400 font-normal">{b.createdAt}</span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {b.customerName}
                      </td>

                      <td className="py-3.5 px-4">
                        <a href={`tel:${b.phoneNumber}`} className="text-red-600 font-semibold hover:underline">
                          {b.phoneNumber}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{b.serviceRequested}</span>
                        <span className="text-[11px] text-slate-500">{b.bikeBrand} {b.bikeModel}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.appointmentDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{b.appointmentTime}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase border ${getStatusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Approve Button */}
                          {['New Request', 'Pending Confirmation'].includes(b.status) && (
                            <button
                              onClick={() => onUpdateStatus(b.id, 'Confirmed', 'Approved by workshop admin')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer"
                              title="Approve Appointment"
                            >
                              Approve
                            </button>
                          )}

                          {/* WhatsApp Confirmation Link */}
                          <a
                            href={confirmWhatsApp.waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Send WhatsApp confirmation to customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Reschedule Button */}
                          <button
                            onClick={() => handleOpenReschedule(b)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Reschedule appointment date/time"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {/* Convert to Job Card */}
                          <button
                            onClick={() => onConvertToJobCard(b)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Convert to formal Job Card"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                          </button>

                          {/* Cancel */}
                          {b.status !== 'Cancelled' && (
                            <button
                              onClick={() => onUpdateStatus(b.id, 'Cancelled', 'Cancelled by workshop admin')}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Cancel appointment"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Modal: Reschedule Appointment */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reschedule Appointment</h3>
                <span className="font-mono text-xs text-red-600 font-semibold">{rescheduleBooking.bookingNumber}</span>
              </div>
              <button onClick={() => setRescheduleBooking(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {rescheduleError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Appointment Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Time Slot (9:00 AM – 9:00 PM)</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden cursor-pointer"
                >
                  {APPOINTMENT_TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm &amp; Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Direct Manual Booking */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Manual Workshop Booking</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="0325 1814548"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <select
                    value={custBrand}
                    onChange={(e) => setCustBrand(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl"
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
                    value={custModel}
                    onChange={(e) => setCustModel(e.target.value)}
                    placeholder="CD 70 / CG 125"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plate #</label>
                  <input
                    type="text"
                    value={custReg}
                    onChange={(e) => setCustReg(e.target.value)}
                    placeholder="LEN-23-4412"
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl cursor-pointer"
                  >
                    {APPOINTMENT_TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Problem / Work Notes</label>
                <textarea
                  rows={2}
                  value={custDesc}
                  onChange={(e) => setCustDesc(e.target.value)}
                  placeholder="e.g. Engine noise check, oil change, tuning"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
