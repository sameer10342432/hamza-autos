import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Clock, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { AREAS_LIST, BUSINESS_INFO } from '../../data/businessData';
import { buttonPressProps } from '../../utils/motion';

interface InteractiveLocationMapProps {
  onNavigateArea?: (slug: string) => void;
  className?: string;
}

// 12 Lahore Localities with geometrical relative offset from central Badami Bagh hub
const LOCALITY_NODES = [
  { id: 'badami-bagh', name: 'Badami Bagh', tag: 'Workshop Hub', slug: 'badami-bagh', x: 50, y: 50, distance: 'Abu Bakar Road (Physical Location)', isHub: true },
  { id: 'shadbagh', name: 'Shadbagh', tag: '2.5 km', slug: 'shadbagh', x: 74, y: 32, distance: '5-8 mins via Ring Road Feeder' },
  { id: 'misri-shah', name: 'Misri Shah', tag: '1.8 km', slug: 'misri-shah', x: 68, y: 64, distance: '4-7 mins via Circular Road' },
  { id: 'ravi-road', name: 'Ravi Road', tag: '2.0 km', slug: 'ravi-road', x: 26, y: 34, distance: '5-8 mins via Timber Market' },
  { id: 'azadi-chowk', name: 'Azadi Chowk', tag: '3.1 km', slug: 'azadi-chowk', x: 34, y: 68, distance: '8-10 mins via Minar-e-Pakistan' },
  { id: 'timber-market', name: 'Timber Market', tag: '1.2 km', slug: 'timber-market', x: 38, y: 40, distance: '3-5 mins direct connecting road' },
  { id: 'bund-road', name: 'Bund Road', tag: '4.5 km', slug: 'bund-road', x: 82, y: 78, distance: '10-14 mins via Outer Bypass' },
  { id: 'garhi-shahu', name: 'Garhi Shahu', tag: '4.8 km', slug: 'garhi-shahu', x: 78, y: 52, distance: '12-15 mins via Allama Iqbal Road' },
  { id: 'bhatti-gate', name: 'Bhatti Gate', tag: '3.6 km', slug: 'bhatti-gate', x: 28, y: 56, distance: '9-12 mins via Circular Road' },
  { id: 'shahdara', name: 'Shahdara', tag: '6.2 km', slug: 'shahdara', x: 42, y: 16, distance: '14-18 mins via Ravi Bridge' },
  { id: 'sanda', name: 'Sanda', tag: '5.5 km', slug: 'sanda', x: 18, y: 76, distance: '12-16 mins via Bund Road' },
  { id: 'islampura', name: 'Islampura', tag: '4.2 km', slug: 'islampura', x: 30, y: 84, distance: '10-14 mins via Lower Mall' },
];

/**
 * InteractiveLocationMap
 * Interactive Lahore Transit Network diagram illustrating commuter proximity to Badami Bagh workshop
 */
export const InteractiveLocationMap: React.FC<InteractiveLocationMapProps> = ({
  onNavigateArea,
  className = ''
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('badami-bagh');

  const activeNode = LOCALITY_NODES.find(n => n.id === activeNodeId) || LOCALITY_NODES[0];

  return (
    <div 
      data-location-map="true"
      className={`bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-automotive relative overflow-hidden ${className}`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-engineering-grid-light opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Interactive Lahore Commuter Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
            Rider Routes to Badami Bagh Workshop
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Select your Lahore locality to view the direct transit route and estimated ride time to our Abu Bakar Road workshop.
          </p>
        </div>

        <a
          href={BUSINESS_INFO.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#CC0812] text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Directions to Workshop</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Interactive Map Visual Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Vector Map Stage */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative aspect-[16/10] overflow-hidden">
          {/* Radial Radar Rings Centered on Badami Bagh (50%, 50%) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <circle cx="50" cy="50" r="15" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="28" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* Connecting Transit Lines from Hub (50, 50) to each Locality */}
              {LOCALITY_NODES.filter(n => !n.isHub).map((node) => {
                const isActive = node.id === activeNodeId;
                return (
                  <g key={node.id}>
                    <line
                      x1="50"
                      y1="50"
                      x2={node.x}
                      y2={node.y}
                      stroke={isActive ? '#E50914' : 'rgba(255,255,255,0.12)'}
                      strokeWidth={isActive ? '0.8' : '0.4'}
                      strokeDasharray={isActive ? 'none' : '1.5 1.5'}
                    />
                    {isActive && (
                      <circle cx={(50 + node.x) / 2} cy={(50 + node.y) / 2} r="0.8" fill="#E50914" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Locality Hotspot Buttons */}
          {LOCALITY_NODES.map((node) => {
            const isActive = node.id === activeNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 transition-all duration-300 cursor-pointer select-none group z-20 ${
                  isActive ? 'scale-115' : 'hover:scale-110 opacity-75 hover:opacity-100'
                }`}
                aria-label={`Select ${node.name}`}
              >
                {node.isHub ? (
                  /* Central Workshop Hub Beacon */
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute h-8 w-8 rounded-full bg-red-500 opacity-60" />
                    <div className="relative w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="w-4 h-4 fill-white text-white" />
                    </div>
                    <span className="absolute top-full mt-1 px-2 py-0.5 rounded bg-[#E50914] text-white font-bold text-[9px] uppercase tracking-wider whitespace-nowrap shadow-md">
                      Hamza Autos Workshop
                    </span>
                  </div>
                ) : (
                  /* Satellite Locality Pin */
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all shadow-sm ${
                      isActive 
                        ? 'bg-[#E50914] border-white ring-4 ring-red-500/30' 
                        : 'bg-slate-700 border-slate-300 group-hover:bg-[#E50914]'
                    }`} />
                    <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.2 rounded whitespace-nowrap transition-colors ${
                      isActive ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 bg-slate-900/80'
                    }`}>
                      {node.name}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Selected Locality Transit Card */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider block">
                    {activeNode.isHub ? 'Primary Workshop Location' : 'Connecting Locality'}
                  </span>
                  <h3 className="text-lg font-black text-slate-950 font-heading">
                    {activeNode.name}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-mono">
                  {activeNode.tag}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">Estimated Ride Time:</span>
                    <span>{activeNode.distance}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">Destination:</span>
                    <span>Abu Bakar Road, Badami Bagh, Lahore (Near Ali Hajvery Marriage Hall)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => onNavigateArea && onNavigateArea(activeNode.slug)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View {activeNode.name} Route Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                * Note: Hamza Autos operates exclusively at its Badami Bagh workshop facility. Riders commuting from {activeNode.name} receive prompt same-day service.
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
