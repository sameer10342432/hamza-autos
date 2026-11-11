import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Calendar, X, ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO, SERVICES_LIST, BRANDS_LIST } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';

interface FloatingActionsProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenBooking }) => {
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('');
  const [selectedService, setSelectedService] = useState('Bike Tuning & Fuel Economy');
  const [issueSummary, setIssueSummary] = useState('');

  const handleLaunchWhatsApp = () => {
    trackEvent('whatsappClicks');
    const link = buildWhatsAppLink({
      brand: selectedBrand,
      model: bikeModel || 'Standard',
      service: selectedService,
      problem: issueSummary || 'General maintenance check'
    });
    window.open(link, '_blank');
    setShowWhatsAppPopup(false);
  };

  return (
    <>
      {/* WhatsApp Quick Message Creator Modal Popup */}
      {showWhatsAppPopup && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">Chat with Hamza Autos</h4>
                <p className="text-xs text-emerald-600 font-medium">Badami Bagh Workshop · Online</p>
              </div>
            </div>
            <button
              onClick={() => setShowWhatsAppPopup(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
              aria-label="Close WhatsApp Popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-3">
            Select your bike & service to prefill a quick WhatsApp enquiry directly with our workshop technician:
          </p>

          <div className="space-y-2.5 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Motorcycle Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-500 focus:outline-hidden"
              >
                {BRANDS_LIST.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Model (e.g. CD 70, CG 125, YBR)
              </label>
              <input
                type="text"
                value={bikeModel}
                onChange={(e) => setBikeModel(e.target.value)}
                placeholder="e.g. CD 70 / CG 125"
                className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Service Needed
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-500 focus:outline-hidden"
              >
                {SERVICES_LIST.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                Problem Description (Optional)
              </label>
              <input
                type="text"
                value={issueSummary}
                onChange={(e) => setIssueSummary(e.target.value)}
                placeholder="e.g. Starting issue, white smoke, tuning"
                className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            onClick={handleLaunchWhatsApp}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Send WhatsApp Message
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating WhatsApp Action Button (Desktop & Tablet) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2">
        <button
          onClick={() => setShowWhatsAppPopup(!showWhatsAppPopup)}
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          aria-label="Chat with Hamza Autos on WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold leading-none">WhatsApp Us</span>
            <span className="block text-[10px] text-emerald-100 font-medium">Quick Reply · Badami Bagh</span>
          </div>
        </button>
      </div>

      {/* Sticky Mobile Quick Action Bar (Strictly <= 15% Mobile Viewport Height Cap: 56px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center justify-around h-14">
        <a
          href={`tel:${BUSINESS_INFO.phoneRaw}`}
          onClick={() => trackEvent('phoneCallClicks')}
          className="flex flex-col items-center justify-center text-slate-700 hover:text-red-600 py-1 px-2"
        >
          <Phone className="w-4 h-4 text-red-600 mb-0.5" />
          <span className="text-[10px] font-semibold">Call Now</span>
        </a>

        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsappClicks')}
          className="flex flex-col items-center justify-center text-slate-700 hover:text-emerald-600 py-1 px-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[10px] font-semibold">WhatsApp</span>
        </a>

        <a
          href={BUSINESS_INFO.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('mapDirectionsClicks')}
          className="flex flex-col items-center justify-center text-slate-700 hover:text-blue-600 py-1 px-2"
        >
          <MapPin className="w-4 h-4 text-blue-600 mb-0.5" />
          <span className="text-[10px] font-semibold">Directions</span>
        </a>

        <button
          onClick={() => onOpenBooking()}
          className="flex flex-col items-center justify-center bg-red-600 text-white rounded-md py-1 px-3 shadow-xs"
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">Book</span>
        </button>
      </div>
    </>
  );
};
