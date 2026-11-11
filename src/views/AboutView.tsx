import React from 'react';
import { ShieldCheck, Wrench, Clock, MapPin, Phone, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { BUSINESS_INFO } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';

interface AboutViewProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-red-600 cursor-pointer">Home</button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">About Hamza Autos</span>
      </nav>

      {/* Main Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl space-y-4"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          About Our Workshop
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading">
          Professional Motorcycle Repair &amp; Maintenance in Badami Bagh, Lahore
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Located on Abu Bakar Road near Ali Hajvery Marriage Hall, Hamza Autos was established to provide riders across northern and central Lahore with honest, dependable, and precision motorcycle mechanical and electrical repairs.
        </p>
      </motion.div>

      {/* 2-Column Story and Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed"
        >
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Our Workshop Philosophy: Transparency First
          </h2>
          <p>
            Too many motorcycle owners in Lahore experience guesswork mechanics, unnecessary parts replacements, and inflated bills. At Hamza Autos, we operate under a strict code of transparency: before any tool touches your bike's engine or wiring, our mechanics inspect the machine, explain the root issue in plain terms, and provide a clear quotation.
          </p>
          <p>
            Whether your daily commuter is a Honda CD 70, CG 125, Yamaha YBR 125, Suzuki GS 150, or a Chinese-platform 70cc bike, we treat every vehicle with mechanical care and calibrated tools.
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Authentic 4T Lubricants</span>
              <p className="text-slate-600">Only genuine sealed engine oils formulated to withstand Lahore's summer heat.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Calibrated Feeler Gauges</span>
              <p className="text-slate-600">Valve tappet clearances adjusted to factory millimeters rather than guessing.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Fast Turnaround</span>
              <p className="text-slate-600">Routine servicing in 20 minutes; same-day completion for standard overhauls.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Honest Pricing</span>
              <p className="text-slate-600">Quotes provided and agreed before disassembling components.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-5 space-y-4"
        >
          <div className="group rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3 bg-slate-100">
            <img
              src="/src/assets/images/hero_motorcycle_workshop_1794329001886.jpg"
              alt="Hamza Autos Badami Bagh Workshop Bay"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <MapPin className="w-4 h-4" />
              <span>Workshop Location</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {BUSINESS_INFO.fullAddress}
            </p>
            <span className="text-slate-400 block pt-1">
              Hours: {BUSINESS_INFO.operatingHours} · 7 Days a Week
            </span>
          </div>
        </motion.div>
      </div>

      {/* CTA Box */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-600 to-slate-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
      >
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold font-heading">Visit Hamza Autos Today</h3>
          <p className="text-xs text-red-100">
            Located near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenBooking()}
            className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-100 cursor-pointer transition-colors"
          >
            Book Repair Online
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsappClicks')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Workshop</span>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};
