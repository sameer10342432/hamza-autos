import React, { useState } from 'react';
import { Wrench, ArrowRight, Clock, Search, CheckCircle2 } from 'lucide-react';
import { getStoredServices } from '../utils/businessLogic';
import { ServiceItem } from '../types';

interface ServicesViewProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onOpenBooking }) => {
  const [services] = useState<ServiceItem[]>(() => getStoredServices());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Engine & Mechanical', 'Performance & Tuning', 'Routine Servicing', 'Electrical & Ignition', 'Brakes & Safety', 'Transmission & Clutch', 'Wheels & Tyres', 'Parts & Replacement', 'General Maintenance'];

  const filteredServices = services.filter((service) => {
    const matchesCat = selectedCategory === 'All' || service.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.supportedBikes.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Badami Bagh Workshop Services
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Motorcycle Repair &amp; Maintenance Services in Badami Bagh
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Hamza Autos provides 13 specialized motorcycle mechanical, electrical, and routine services for Honda, Yamaha, Suzuki, United, Road Prince, and Chinese motorcycles.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service, symptom (e.g. smoke, tuning, brakes, clutch)..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Filter tags (interactive button segmented controls as allowed by frontend design constitution) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (All 13 Services) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white rounded text-[11px] font-semibold backdrop-blur-xs">
                  {service.category}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-base font-bold text-slate-900 hover:text-red-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-600" />
                  <span>Turnaround: <strong>{service.estimatedTime}</strong></span>
                </div>

                <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700 block">Key Checklist:</span>
                  {service.keyFeatures.slice(0, 2).map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <button
                onClick={() => onNavigate('service-detail', service.slug)}
                className="text-xs font-bold text-slate-700 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
              >
                Service Details
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenBooking(service.title)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No matching services found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or view all available services above.
          </p>
        </div>
      )}
    </div>
  );
};
