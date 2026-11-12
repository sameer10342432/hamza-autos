import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AREAS_LIST, BUSINESS_INFO } from '../data/businessData';
import { buildWhatsAppLink, trackEvent } from '../utils/businessLogic';

interface AreasViewProps {
  selectedSlug?: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const AreasView: React.FC<AreasViewProps> = ({ selectedSlug, onNavigate, onOpenBooking }) => {
  const [activeAreaId, setActiveAreaId] = useState<string>(() => {
    if (selectedSlug) {
      const found = AREAS_LIST.find((a) => a.slug === selectedSlug);
      if (found) return found.id;
    }
    return AREAS_LIST[0].id;
  });

  const activeArea = AREAS_LIST.find((a) => a.id === activeAreaId) || AREAS_LIST[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Local SEO &amp; Service Coverage
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Areas We Serve from Badami Bagh, Lahore
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Our physical workshop is located on <strong className="text-slate-900">Abu Bakar Road, Badami Bagh, Lahore</strong>. We welcome riders commuting from Shadbagh, Misri Shah, Ravi Road, Azadi Chowk, Timber Market, Bund Road, and Garhi Shahu.
        </p>
      </div>

      {/* Area Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {AREAS_LIST.map((area) => (
          <button
            key={area.id}
            onClick={() => setActiveAreaId(area.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAreaId === area.id
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{area.name}</span>
          </button>
        ))}
      </div>

      {/* Selected Local Landing Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-md">
                Local Landing Guide
              </span>
              <span className="text-xs text-slate-500">
                {activeArea.distanceFromBadamiBagh} · {activeArea.estimatedDriveTime}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Motorcycle Mechanic &amp; Bike Repair for Riders in {activeArea.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mt-2">
              {activeArea.localIntro}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              onClick={() => {
                trackEvent('mapDirectionsClicks');
                window.open(BUSINESS_INFO.googleMapsDirectionsUrl, '_blank');
              }}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              Get Route to Workshop
            </button>
            <a
              href={buildWhatsAppLink({ problem: `Visiting from ${activeArea.name}` })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsappClicks')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Message
            </a>
          </div>
        </div>

        {/* Local Area Photography & Commuter Scene */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-16/9 group shadow-xs">
            <img
              src="/assets/images/locations/lahore-badami-bagh-traffic.jpg"
              alt="Lahore Badami Bagh and Circular Road Commuter Traffic Scene"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-white text-xs font-semibold drop-shadow-sm">
                Badami Bagh &amp; Abu Bakar Road Commuter Corridor
              </span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-16/9 group shadow-xs">
            <img
              src="/assets/images/locations/lahore-commuter-road.jpg"
              alt="Lahore Urban Commuter Road and Connecting Transit Routes"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-white text-xs font-semibold drop-shadow-sm">
                Lahore Northern Arterial &amp; Feeder Routes
              </span>
            </div>
          </div>
        </div>

        {/* Driving Route & Commuter Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-red-600" />
              <span>Recommended Route to Badami Bagh Workshop:</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeArea.bestRouteDescription}
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Estimated ride time: <strong>{activeArea.estimatedDriveTime}</strong></span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Key Landmarks &amp; Commuter Road Conditions:</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeArea.commuterContext}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeArea.landmarks.map((mark, i) => (
                <span key={i} className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                  {mark}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transparent Location Notice (as required by prompt: "Badami Bagh must remain the primary business location. Never create fake physical branches.") */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <span className="font-bold text-amber-800 shrink-0">Official Workshop Note:</span>
          <span>
            Hamza Autos maintains its physical motorcycle workshop exclusively in <strong>Badami Bagh, Lahore (Abu Bakar Road, near Ali Hajvery Marriage Hall)</strong>. We do not operate remote branch shops in other localities; rather, we warmly welcome and assist riders traveling from nearby areas across Lahore.
          </span>
        </div>
      </div>
    </div>
  );
};
