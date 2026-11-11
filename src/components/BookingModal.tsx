import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  AlertCircle, 
  Wrench, 
  Calendar, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_INFO } from '../data/businessData';
import { getStoredServices, buildWhatsAppLink, trackEvent } from '../utils/businessLogic';
import { 
  APPOINTMENT_TIME_SLOTS, 
  isTimeSlotAvailable, 
  createAppointmentBooking 
} from '../utils/workshopLogic';
import { ServiceItem, AppointmentBooking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  initialService?: string;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, initialService, onClose }) => {
  const [services] = useState<ServiceItem[]>(() => getStoredServices());
  
  // Tomorrow as default appointment date
  const tomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const todayStr = () => new Date().toISOString().slice(0, 10);

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [area, setArea] = useState('Badami Bagh');
  const [bikeBrand, setBikeBrand] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('CD 70');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [serviceRequested, setServiceRequested] = useState(initialService || services[0]?.title || 'Bike Tuning');
  const [problemDescription, setProblemDescription] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(tomorrowStr());
  const [appointmentTime, setAppointmentTime] = useState(APPOINTMENT_TIME_SLOTS[1]); // 10:30 AM
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdBooking, setCreatedBooking] = useState<AppointmentBooking | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialService) {
      setServiceRequested(initialService);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam honeypot
    if (honeypot.trim() !== '') {
      setIsSubmitted(true);
      return;
    }

    if (!customerName.trim()) {
      setErrors({ customerName: 'Please provide your full name' });
      return;
    }

    if (!phoneNumber.trim()) {
      setErrors({ phoneNumber: 'Please provide a valid Pakistani mobile number' });
      return;
    }

    const result = createAppointmentBooking({
      customerName,
      phoneNumber,
      area,
      bikeBrand,
      bikeModel,
      registrationNumber: registrationNumber || undefined,
      serviceRequested,
      problemDescription,
      appointmentDate,
      appointmentTime
    });

    if (!result.success) {
      setErrors({ form: result.error || 'Failed to submit appointment request.' });
      return;
    }

    setErrors({});
    setCreatedBooking(result.booking || null);
    setIsSubmitted(true);
  };

  const handleWhatsAppHandoff = () => {
    trackEvent('whatsappClicks');
    const bookingNo = createdBooking?.bookingNumber || 'New Request';
    const msg = `Salam Hamza Autos, I have submitted an appointment booking request:\n\n` +
                `📋 *Booking #:* ${bookingNo}\n` +
                `👤 *Name:* ${customerName}\n` +
                `🏍 *Bike:* ${bikeBrand} ${bikeModel}\n` +
                `📅 *Date:* ${appointmentDate}\n` +
                `⏰ *Time:* ${appointmentTime}\n` +
                `🔧 *Service:* ${serviceRequested}\n\n` +
                `Please let me know once my bay is confirmed. Thank you!`;
    window.open(`https://wa.me/923251814548?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto z-10"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Book Workshop Appointment"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  Book Workshop Appointment
                </h3>
                <p className="text-xs text-slate-500">
                  Hamza Autos · Abu Bakar Road, Badami Bagh, Lahore
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Reserve your motorcycle repair slot in advance to avoid waiting. Double-booking prevention ensures your mechanic is ready for your arrival.
            </p>

            {errors.form && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Anti-spam trap */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* 1. Date & Time Selection */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-red-600" />
                    Preferred Appointment Date &amp; Time
                  </span>
                  <span className="text-[11px] text-slate-500">Workshop: 9 AM – 9 PM</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Appointment Date *</label>
                    <input
                      type="date"
                      required
                      min={todayStr()}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-red-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Available Time Slot *</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-red-500 focus:outline-hidden"
                    >
                      {APPOINTMENT_TIME_SLOTS.map((slot) => {
                        const status = isTimeSlotAvailable(appointmentDate, slot);
                        return (
                          <option key={slot} value={slot} disabled={!status.available}>
                            {slot} {status.available ? `(${status.remaining} slot${status.remaining > 1 ? 's' : ''} left)` : '(Fully Booked)'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Usman"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                  {errors.customerName && (
                    <span className="text-[11px] text-red-600 mt-1 block">{errors.customerName}</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0325 1814548"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                  {errors.phoneNumber && (
                    <span className="text-[11px] text-red-600 mt-1 block">{errors.phoneNumber}</span>
                  )}
                </div>
              </div>

              {/* 3. Motorcycle Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Brand *</label>
                  <select
                    value={bikeBrand}
                    onChange={(e) => setBikeBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-red-500 focus:outline-hidden"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="United">United</option>
                    <option value="Road Prince">Road Prince</option>
                    <option value="Super Power">Super Power</option>
                    <option value="Chinese Motorcycles">Chinese Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Model *</label>
                  <input
                    type="text"
                    required
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    placeholder="e.g. CG 125 / CD 70"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration (Opt)</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. LEB-22-1082"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden font-mono uppercase"
                  />
                </div>
              </div>

              {/* 4. Service and Problem */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Required *</label>
                  <select
                    value={serviceRequested}
                    onChange={(e) => setServiceRequested(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:border-red-500 focus:outline-hidden"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Locality in Lahore</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Badami Bagh / Shadbagh"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Describe Mechanical / Electrical Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="e.g. White smoke, low fuel average, tapping sound in engine, spongy brake lever..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Booking Confirmation Policy:</strong> To ensure fairness, appointment requests are confirmed by our workshop supervisor based on mechanic bay capacity. You will receive a WhatsApp message once your slot is locked in.
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Submit Appointment Request
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-red-600 uppercase block tracking-wider">
                Booking Reference: {createdBooking?.bookingNumber || 'HA-BK-2026'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Appointment Request Submitted!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{customerName}</strong>. We have registered your repair request for your <strong>{bikeBrand} {bikeModel}</strong> on:
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-xs mx-auto text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Date:</span>
                <span className="font-bold text-slate-900">{appointmentDate}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Requested Time:</span>
                <span className="font-bold text-red-600">{appointmentTime}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Service:</span>
                <span className="font-medium text-slate-900 truncate max-w-[170px]">{serviceRequested}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 max-w-sm mx-auto">
              <button
                onClick={handleWhatsAppHandoff}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Notify Workshop on WhatsApp
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Done / Close
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Workshop Location: Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )}
</AnimatePresence>
  );
};
