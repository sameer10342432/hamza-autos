import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  Navigation, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_INFO } from '../data/businessData';
import { 
  buildWhatsAppLink, 
  trackEvent, 
  saveLead, 
  validateLeadSubmission,
  getStoredSettings,
  getStoredServices
} from '../utils/businessLogic';
import { ServiceItem, SiteSettings } from '../types';

export const ContactView: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());
  const [services, setServices] = useState<ServiceItem[]>(getStoredServices());

  useEffect(() => {
    setSettings(getStoredSettings());
    setServices(getStoredServices());
  }, []);

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [area, setArea] = useState('Badami Bagh');
  const [serviceRequested, setServiceRequested] = useState(services[0]?.title || 'General Motorcycle Tuning');
  const [problemDetails, setProblemDetails] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadSubmission({
      customerName,
      phoneNumber,
      serviceRequested,
      honeypot
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    saveLead({
      customerName,
      phoneNumber,
      area,
      bikeBrand: 'Customer Bike',
      bikeModel: 'Standard',
      serviceRequested,
      problemDetails,
      preferredTime: 'Direct Contact Form'
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
          Contact Hamza Autos Badami Bagh
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Need an urgent motorcycle repair, engine overhaul quotation, or directions to our workshop? Call us directly, send a WhatsApp message, or submit an enquiry below.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Workshop Contact Cards */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Workshop Contact Information
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Full Address</span>
                  <span className="text-slate-600 leading-relaxed block mt-0.5">
                    {settings.fullAddress || BUSINESS_INFO.fullAddress}
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-1">
                    Landmark: Near Ali Hajvery Marriage Hall, Abu Bakar Road
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Direct Phone Line</span>
                  <a
                    href={`tel:${settings.phoneRaw || BUSINESS_INFO.phoneRaw}`}
                    onClick={() => trackEvent('phoneCallClicks')}
                    className="text-red-600 font-bold hover:underline block mt-0.5"
                  >
                    {settings.phone || BUSINESS_INFO.phone}
                  </a>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Click to call immediately
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Official WhatsApp</span>
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsappClicks')}
                    className="text-emerald-700 font-bold hover:underline block mt-0.5"
                  >
                    {settings.whatsappNumber || BUSINESS_INFO.whatsappNumber}
                  </a>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Instant message and share bike audio/video
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Workshop Hours</span>
                  <span className="text-slate-700 font-medium block mt-0.5">
                    {settings.operatingHours || BUSINESS_INFO.operatingHours}
                  </span>
                  <span className="text-slate-500 block text-[11px]">
                    Open Monday to Sunday (7 Days a Week)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={BUSINESS_INFO.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('mapDirectionsClicks')}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Directions in Google Maps</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsappClicks')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact & Booking Form */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-2 font-heading">
            Send an Online Service Enquiry
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            Leave your name and repair problem. Our mechanic will review the details and get back to you promptly.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="submitted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Enquiry Received Successfully!</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for contacting Hamza Autos. We have noted your request for {serviceRequested}. You may also reach us directly at {settings.phone || BUSINESS_INFO.phone}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer mt-2 transition-colors hover:bg-emerald-800"
                >
                  Send Another Enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-4 text-xs"
              >
                {(errors.cooldown || errors.form) && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{errors.cooldown || errors.form}</span>
                  </div>
                )}

                {/* Anti-spam honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Website URL (leave blank)</label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Asif Raza"
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                    />
                    {errors.customerName && (
                      <span className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.customerName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0325 1814548"
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                    />
                    {errors.phoneNumber && (
                      <span className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Locality in Lahore</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Badami Bagh, Misri Shah"
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Motorcycle Service Needed</label>
                    <select
                      value={serviceRequested}
                      onChange={(e) => setServiceRequested(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-hidden cursor-pointer"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Describe Problem / Issue (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={problemDetails}
                    onChange={(e) => setProblemDetails(e.target.value)}
                    placeholder="e.g. Engine making knocking sound, white smoke from silencer, carburetor leaking, oil change required..."
                    className="w-full p-3 rounded-xl border border-slate-300 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-hidden"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry to Hamza Autos</span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
