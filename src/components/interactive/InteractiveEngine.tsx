import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { buttonPressProps } from '../../utils/motion';

export interface EngineComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string;
  workshopCheck: string;
  x: number; // Percentage coordinates for marker
  y: number;
}

const ENGINE_COMPONENTS: EngineComponent[] = [
  {
    id: 'spark-plug',
    name: 'Spark Plug & Ignition Electrode',
    category: 'Electrical & Combustion',
    description: 'Delivers the timed electrical spark from CDI unit to ignite the compressed fuel-air charge.',
    symptoms: 'Hard morning starts, engine misfire under load, black carbon buildup from rich mixture.',
    workshopCheck: 'Feeler gauge electrode gap check (0.6–0.7 mm) and heat range verification.',
    x: 48,
    y: 18
  },
  {
    id: 'carburetor',
    name: 'Fuel Carburetor & Pilot Jet',
    category: 'Fuel Delivery & Tuning',
    description: 'Atomizes petrol with intake air through primary and idle jets for optimal fuel economy.',
    symptoms: 'Fuel overflow, poor fuel average (below 45 km/L), throttle stutter, jerky low-speed riding.',
    workshopCheck: 'Ultrasonic bath jet decarb, float pin height calibration, and air-fuel screw tuning.',
    x: 24,
    y: 35
  },
  {
    id: 'cylinder-piston',
    name: 'Cylinder Barrel & Piston Rings',
    category: 'Mechanical Core',
    description: 'Contains explosive combustion pressures and transfers kinetic energy downward to connecting rod.',
    symptoms: 'White exhaust smoke (burning engine oil), loss of compression, low hill-climbing power.',
    workshopCheck: 'Cylinder bore micrometer measurement, piston clearance check, 0.25–0.50 mm re-boring.',
    x: 48,
    y: 42
  },
  {
    id: 'cooling-fins',
    name: 'Aluminum Air-Cooling Fins',
    category: 'Thermal Management',
    description: 'High-surface-area aluminum fins that dissipate intense combustion heat into passing airstream.',
    symptoms: 'Engine overheating, loss of power in Lahore summer traffic, premature tappet noise.',
    workshopCheck: 'Fin debris clearance, cylinder head torque check, and heat sink integrity.',
    x: 68,
    y: 36
  },
  {
    id: 'clutch-assembly',
    name: 'Multi-Plate Clutch Assembly',
    category: 'Transmission & Drive',
    description: 'Friction plates, steel discs, and clutch basket coupling engine crankshaft to 4-speed gearbox.',
    symptoms: 'Clutch slippage at high revs, stiff gear shifts, motorcycle jerking when engaging first gear.',
    workshopCheck: 'Friction lining thickness test, clutch spring free-length measurement, cable slack adjustment.',
    x: 74,
    y: 72
  },
  {
    id: 'crankshaft',
    name: 'Crankshaft & Main Bearings',
    category: 'Bottom End Core',
    description: 'Heavy counterbalanced shaft converting reciprocating piston travel into smooth rotary torque.',
    symptoms: 'Deep rhythmic engine knocking noise, excessive chassis vibration, lower end rumble.',
    workshopCheck: 'Big-end rod play dial gauge inspection, crankshaft truing, and Japanese sealed bearing fit.',
    x: 46,
    y: 78
  },
  {
    id: 'oil-sump',
    name: 'Engine Oil Lubrication System',
    category: 'Lubrication',
    description: 'Oil pump, magnetic drain plug, and centrifugal oil filter bathing all gears in protective film.',
    symptoms: 'Rapid oil blackening, metallic shimmer in drained lubricant, elevated engine noise.',
    workshopCheck: 'Sump screen mesh cleaning, oil pump flow rate test, genuine 4T sealed oil replenishment.',
    x: 32,
    y: 88
  }
];

interface InteractiveEngineProps {
  onSelectService?: (serviceName: string) => void;
  className?: string;
}

/**
 * InteractiveEngine
 * Interactive 4-Stroke Motorcycle Single-Cylinder Engine Anatomy
 * Allows riders to inspect components, diagnose symptoms, and explore workshop maintenance
 */
export const InteractiveEngine: React.FC<InteractiveEngineProps> = ({
  onSelectService,
  className = ''
}) => {
  const [selectedId, setSelectedId] = useState<string>('cylinder-piston');

  const selectedComponent = ENGINE_COMPONENTS.find(c => c.id === selectedId) || ENGINE_COMPONENTS[0];

  return (
    <div 
      data-interactive-engine="true"
      className={`bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Carbon Grid Texture */}
      <div className="absolute inset-0 bg-dark-grid opacity-35 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-600/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5 text-[#E50914]" />
            <span>Interactive Mechanical Anatomy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading">
            Motorcycle Engine Anatomy &amp; Diagnostics
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Explore the internal anatomy of a 4-stroke commuter motorcycle engine. Click any technical component to inspect symptoms and Badami Bagh workshop repair standards.
          </p>
        </div>

        <button
          onClick={() => setSelectedId('cylinder-piston')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        {/* Left Column: Interactive Engine Diagram with Component Hotspots */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[480px] aspect-[4/4.5] bg-slate-900/90 rounded-3xl border border-slate-800 p-4 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Background Mechanical Blueprint Graphic */}
            <svg viewBox="0 0 400 450" className="w-full h-full select-none" fill="none">
              {/* Outer Engine Crankcase Silhouette */}
              <path
                d="M 120 180 L 280 180 L 270 280 L 330 330 L 320 410 L 90 410 L 80 330 L 130 280 Z"
                fill="#0F172A"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Cylinder Barrel with Cooling Fins */}
              <g id="cooling-fins-svg" className="transition-opacity">
                <rect x="135" y="100" width="130" height="90" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                {/* Horizontal Fin Lines */}
                <line x1="115" y1="115" x2="285" y2="115" stroke={selectedId === 'cooling-fins' ? '#E50914' : '#64748B'} strokeWidth="4" strokeLinecap="round" />
                <line x1="115" y1="130" x2="285" y2="130" stroke={selectedId === 'cooling-fins' ? '#E50914' : '#64748B'} strokeWidth="4" strokeLinecap="round" />
                <line x1="115" y1="145" x2="285" y2="145" stroke={selectedId === 'cooling-fins' ? '#E50914' : '#64748B'} strokeWidth="4" strokeLinecap="round" />
                <line x1="115" y1="160" x2="285" y2="160" stroke={selectedId === 'cooling-fins' ? '#E50914' : '#64748B'} strokeWidth="4" strokeLinecap="round" />
                <line x1="115" y1="175" x2="285" y2="175" stroke={selectedId === 'cooling-fins' ? '#E50914' : '#64748B'} strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Spark Plug on Cylinder Head */}
              <g id="spark-plug-svg">
                <rect x="188" y="45" width="24" height="40" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
                <rect x="195" y="20" width="10" height="25" rx="2" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />
                <circle cx="200" cy="18" r="4" fill={selectedId === 'spark-plug' ? '#E50914' : '#94A3B8'} />
                {selectedId === 'spark-plug' && (
                  <path d="M 197 32 L 202 38 L 199 41 L 204 46" stroke="#EF4444" strokeWidth="2" fill="none" />
                )}
              </g>

              {/* Carburetor on Intake Side */}
              <g id="carburetor-svg">
                <path d="M 60 120 L 135 135 L 135 155 L 60 170 Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                <circle cx="95" cy="145" r="22" fill="#0F172A" stroke={selectedId === 'carburetor' ? '#E50914' : '#64748B'} strokeWidth="2" />
                <rect x="80" y="165" width="30" height="25" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              </g>

              {/* Piston & Honed Sleeve Inside Cylinder */}
              <g id="piston-svg">
                <rect 
                  x="155" 
                  y="125" 
                  width="90" 
                  height="50" 
                  rx="6" 
                  fill={selectedId === 'cylinder-piston' ? 'rgba(229,9,20,0.2)' : '#334155'} 
                  stroke={selectedId === 'cylinder-piston' ? '#E50914' : '#94A3B8'} 
                  strokeWidth="2" 
                />
                {/* 3 Compression Ring Grooves */}
                <line x1="160" y1="135" x2="240" y2="135" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="160" y1="142" x2="240" y2="142" stroke="#E2E8F0" strokeWidth="1.5" />
                <line x1="160" y1="149" x2="240" y2="149" stroke="#E2E8F0" strokeWidth="1.5" />
                {/* Wrist Pin (Gudgeon pin) */}
                <circle cx="200" cy="155" r="8" fill="#64748B" stroke="#CBD5E1" strokeWidth="1.5" />
              </g>

              {/* Connecting Rod */}
              <line x1="200" y1="155" x2="190" y2="330" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />

              {/* Crankshaft Flywheel */}
              <g id="crankshaft-svg">
                <circle 
                  cx="190" 
                  cy="330" 
                  r="55" 
                  fill="#1E293B" 
                  stroke={selectedId === 'crankshaft' ? '#E50914' : '#475569'} 
                  strokeWidth="2.5" 
                />
                <circle cx="190" cy="330" r="30" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
                <circle cx="190" cy="330" r="12" fill={selectedId === 'crankshaft' ? '#E50914' : '#94A3B8'} />
              </g>

              {/* Clutch Basket (Right Side of Crankcase) */}
              <g id="clutch-svg">
                <circle 
                  cx="285" 
                  cy="330" 
                  r="45" 
                  fill="#1E293B" 
                  stroke={selectedId === 'clutch-assembly' ? '#E50914' : '#475569'} 
                  strokeWidth="2" 
                  strokeDasharray="6 3"
                />
                <circle cx="285" cy="330" r="24" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
                <circle cx="285" cy="330" r="8" fill={selectedId === 'clutch-assembly' ? '#E50914' : '#94A3B8'} />
              </g>

              {/* Oil Sump Strainer & Drain (Bottom) */}
              <g id="oil-sump-svg">
                <path 
                  d="M 120 395 L 260 395 L 240 425 L 140 425 Z" 
                  fill="#1E293B" 
                  stroke={selectedId === 'oil-sump' ? '#E50914' : '#475569'} 
                  strokeWidth="2" 
                />
                <rect x="180" y="425" width="20" height="8" fill="#64748B" stroke="#94A3B8" strokeWidth="1" />
              </g>
            </svg>

            {/* Interactive Pulse Hotspots */}
            {ENGINE_COMPONENTS.map((comp) => {
              const isSelected = comp.id === selectedId;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedId(comp.id)}
                  style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-300 cursor-pointer group z-20 ${
                    isSelected ? 'scale-125' : 'hover:scale-115'
                  }`}
                  aria-label={`Inspect ${comp.name}`}
                >
                  <span className={`flex h-4 w-4 relative`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSelected ? 'bg-red-400' : 'bg-slate-400 group-hover:bg-red-400'
                    }`} />
                    <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white items-center justify-center shadow-md ${
                      isSelected ? 'bg-[#E50914]' : 'bg-slate-700 group-hover:bg-[#E50914]'
                    }`} />
                  </span>
                  
                  {/* Floating Micro-Badge */}
                  <span className={`absolute left-full ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap backdrop-blur-md border transition-all ${
                    isSelected 
                      ? 'bg-[#E50914] text-white border-red-500 shadow-md' 
                      : 'bg-slate-900/80 text-slate-300 border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none'
                  }`}>
                    {comp.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Component Selection Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 pt-4 max-w-lg">
            {ENGINE_COMPONENTS.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedId(comp.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedId === comp.id
                    ? 'bg-[#E50914] text-white font-bold shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {comp.name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Component Inspector Card */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedComponent.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-900/95 rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-5 shadow-2xl"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
                  {selectedComponent.category}
                </span>
                <h3 className="text-xl font-bold text-white font-heading">
                  {selectedComponent.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {selectedComponent.description}
                </p>
              </div>

              {/* Signs & Symptoms */}
              <div className="p-3.5 bg-red-950/40 rounded-xl border border-red-900/60 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Rider Symptoms &amp; Warning Signs:</span>
                </div>
                <p className="text-xs text-red-200 leading-relaxed">
                  {selectedComponent.symptoms}
                </p>
              </div>

              {/* Hamza Autos Workshop Standard */}
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Badami Bagh Workshop Standard:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedComponent.workshopCheck}
                </p>
              </div>

              {/* CTA Booking Link */}
              <motion.button
                {...buttonPressProps}
                onClick={() => onSelectService && onSelectService('Motorcycle Engine Repair')}
                className="w-full py-3 bg-[#E50914] hover:bg-[#CC0812] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-950/50 transition-colors cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Book Mechanical Diagnostic</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
