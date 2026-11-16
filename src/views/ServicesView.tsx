import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, ArrowRight, Clock, Search, CheckCircle2 } from 'lucide-react';
import { getStoredServices } from '../utils/businessLogic';
import { ServiceItem } from '../types';
import {
  staggerContainerVariants,
  staggerItemVariants,
  buttonPressProps,
  interactiveCardHover
} from '../utils/motion';
import { SectionBackground } from '../components/backgrounds';
import { Card3D } from '../components/interactive/Card3D';

interface ServicesViewProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onOpenBooking }) => {
  const [services] = useState<ServiceItem[]>(() => getStoredServices());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Engine & Mechanical',
    'Performance & Tuning',
    'Routine Servicing',
    'Electrical & Ignition',
    'Brakes & Safety',
    'Transmission & Clutch',
    'Wheels & Tyres',
    'Parts & Replacement',
    'General Maintenance'
  ];

  const filteredServices = services.filter((service) => {
    const matchesCat = selectedCategory === 'All' || service.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.supportedBikes.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative overflow-hidden">
      <SectionBackground variant="services" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block">
            Badami Bagh Workshop Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-heading">
            Motorcycle Repair &amp; Maintenance Services in Badami Bagh
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Hamza Autos provides 13 specialized motorcycle mechanical, electrical, and routine services for Honda, Yamaha, Suzuki, United, Road Prince, and Chinese motorcycles.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-automotive space-y-4"
        >
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search service, symptom (e.g. smoke, tuning, brakes, clutch)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E50914] focus:ring-2 focus:ring-red-100 bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Filter tags with Animated Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${selectedCategory === cat
                  ? 'text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {selectedCategory === cat && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-[#E50914] rounded-xl shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </motion.div>

      {/* Services Grid (All 13 Services) */}
      <motion.div 
        layout
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              layout
              key={service.id}
              variants={staggerItemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card3D className="h-full">
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-automotive hover:shadow-automotive-hover hover:border-red-300 transition-colors duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        width={600}
                        height={338}
                        decoding="async"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/85 text-white rounded-md text-[11px] font-semibold backdrop-blur-xs border border-slate-800">
                        {service.category}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-base font-bold text-slate-950 group-hover:text-[#E50914] transition-colors font-heading">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {service.shortDescription}
                      </p>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Turnaround: <strong className="text-slate-800 font-semibold">{service.estimatedTime}</strong></span>
                      </div>

                      <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-800 block">Key Checklist:</span>
                        {service.keyFeatures.slice(0, 2).map((feat, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#E50914] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate('service-detail', service.slug)}
                      className="text-xs font-bold text-slate-700 hover:text-[#E50914] inline-flex items-center gap-1 cursor-pointer transition-colors group/btn"
                    >
                      <span>Service Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <motion.button
                      {...buttonPressProps}
                      onClick={() => onOpenBooking(service.title)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-[#E50914] text-white hover:bg-[#CC0812] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs"
          >
            <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
            <h3 className="text-sm font-bold text-slate-900 font-heading">No matching services found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or view all available services above.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
