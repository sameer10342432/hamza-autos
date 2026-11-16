import React, { useState } from 'react';
import { Wrench, CheckCircle2, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRANDS_LIST, BUSINESS_INFO } from '../data/businessData';
import { buildWhatsAppLink, trackEvent } from '../utils/businessLogic';
import { buttonPressProps } from '../utils/motion';
import { SectionBackground } from '../components/backgrounds';

interface BrandsViewProps {
  selectedSlug?: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({ selectedSlug, onNavigate, onOpenBooking }) => {
  const [activeBrandId, setActiveBrandId] = useState<string>(() => {
    if (selectedSlug) {
      const found = BRANDS_LIST.find((b) => b.slug === selectedSlug);
      if (found) return found.id;
    }
    return BRANDS_LIST[0].id;
  });

  const activeBrand = BRANDS_LIST.find((b) => b.id === activeBrandId) || BRANDS_LIST[0];

  return (
    <div className="relative overflow-hidden">
      <SectionBackground variant="brands" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block">
          Motorcycle Brand Specialization
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-heading">
          Motorcycle Repair for All Major Brands in Badami Bagh
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Hamza Autos services Honda, Yamaha, Suzuki, United, Road Prince, Super Power, and Chinese commuter motorcycles. Select a brand below to view specialized repair procedures and maintenance tips.
        </p>
      </motion.div>

      {/* Brand Selection Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {BRANDS_LIST.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setActiveBrandId(brand.id)}
            className={`relative px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex items-center gap-2 ${
              activeBrandId === brand.id
                ? 'text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {activeBrandId === brand.id && (
              <motion.span
                layoutId="brandTabPill"
                className="absolute inset-0 bg-[#E50914] rounded-xl shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{brand.name} Repair</span>
          </button>
        ))}
      </div>

      {/* Selected Brand Deep-Dive Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBrand.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-automotive space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-red-50 text-[#E50914] font-bold text-xs rounded-md border border-red-100">
                  Brand Guide
                </span>
                <span className="text-xs text-slate-500">Badami Bagh Workshop</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
                {activeBrand.name} Motorcycle Repair &amp; Maintenance in Lahore
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mt-2">
                {activeBrand.overview}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <motion.button
                {...buttonPressProps}
                onClick={() => onOpenBooking(`${activeBrand.name} Service`)}
                className="px-4 py-2.5 bg-[#E50914] hover:bg-[#CC0812] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Book {activeBrand.name} Repair
              </motion.button>
              <motion.a
                {...buttonPressProps}
                href={buildWhatsAppLink({ brand: activeBrand.name })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsappClicks')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Specialist</span>
              </motion.a>
            </div>
          </div>

          {/* Brand Real Visual Showcase */}
          {activeBrand.image && (
            <div className="group rounded-2xl overflow-hidden aspect-21/9 sm:aspect-3/1 bg-slate-900 border border-slate-200 shadow-xs relative">
              <img
                src={activeBrand.image}
                alt={activeBrand.imageAlt || `${activeBrand.name} Motorcycle Repair Lahore`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 sm:p-6">
                <span className="text-white text-xs sm:text-sm font-semibold">
                  Genuine repair techniques and authentic maintenance procedures for {activeBrand.name} motorcycles
                </span>
              </div>
            </div>
          )}

          {/* Popular Models Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Common {activeBrand.name} Models Serviced:
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeBrand.popularModels.map((model, i) => (
                <span
                  key={i}
                  className="bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/80"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          {/* 2-Column: Common Services vs Maintenance Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <Wrench className="w-4 h-4 text-[#E50914]" />
                <span>Frequent {activeBrand.name} Repairs at Our Workshop</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeBrand.commonServices.map((svc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{svc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <span className="w-2 h-2 rounded-full bg-[#E50914]"></span>
                <span>Maintenance Advice for {activeBrand.name} Riders</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeBrand.maintenanceTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#E50914] font-bold mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer Note */}
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            * Note: Hamza Autos is an independent local motorcycle workshop in Badami Bagh, Lahore. Brand names and model designations are used solely to identify repair compatibility.
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
};
