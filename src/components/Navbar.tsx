import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  MapPin, 
  Search, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  ChevronDown,
  Calendar,
  Sparkles,
  Wrench,
  Bike,
  FileText,
  Camera,
  Star,
  BookOpen,
  Settings2,
  Gauge,
  Droplets,
  Zap,
  Cable,
  ShieldAlert,
  Cog,
  CircleDot,
  LifeBuoy,
  PackageCheck,
  Sliders,
  ClipboardCheck,
  ArrowRight,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_INFO, SERVICES_LIST, BRANDS_LIST, AREAS_LIST } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
  onOpenSearch: () => void;
}

// Service Icons & Micro-Descriptions
const SERVICE_META: Record<string, { icon: React.ElementType; tag: string; desc: string }> = {
  'motorcycle-engine-repair': {
    icon: Settings2,
    tag: 'Engine Repair',
    desc: '4-stroke overhaul, cylinder boring & valve seating'
  },
  'bike-tuning': {
    icon: Gauge,
    tag: 'Bike Tuning',
    desc: 'Carburetor ultrasonic cleaning & mileage tuning'
  },
  'bike-oil-change': {
    icon: Droplets,
    tag: 'Oil Change',
    desc: 'Genuine 4T oil drain, sump cleaning & filter check'
  },
  'general-bike-repair': {
    icon: Wrench,
    tag: 'General Repair',
    desc: 'Chassis diagnostics, bolt torquing & lubrication'
  },
  'motorcycle-electrical-repair': {
    icon: Zap,
    tag: 'Electrical Repair',
    desc: 'CDI units, stator coils, rectifiers & battery testing'
  },
  'bike-wiring-repair': {
    icon: Cable,
    tag: 'Wiring Harness',
    desc: 'Complete rewiring, switchgear & headlamp circuitry'
  },
  'motorcycle-brake-repair': {
    icon: ShieldAlert,
    tag: 'Brake Repair',
    desc: 'Drum brake shoes, disc pads & hydraulic caliper fluid'
  },
  'bike-clutch-repair': {
    icon: Cog,
    tag: 'Clutch Repair',
    desc: 'Friction plates, pressure plates & clutch hub overhaul'
  },
  'motorcycle-tyre-repair': {
    icon: CircleDot,
    tag: 'Tyre Fitting',
    desc: 'Tyre replacement, wheel alignment & rim truing'
  },
  'bike-puncture-repair': {
    icon: LifeBuoy,
    tag: 'Puncture Repair',
    desc: 'Rapid water leak detection & heat vulcanized patch'
  },
  'motorcycle-spare-parts': {
    icon: PackageCheck,
    tag: 'Spare Parts',
    desc: 'Heavy-duty 428H chains, sprockets, cables & plugs'
  },
  'bike-modification': {
    icon: Sliders,
    tag: 'Modification',
    desc: 'Ergonomic handlebars, crash bars & accessories'
  },
  'motorcycle-general-maintenance': {
    icon: ClipboardCheck,
    tag: 'Maintenance',
    desc: '25-point safety inspection & roadworthiness check'
  }
};

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenBooking, 
  onOpenSearch 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Desktop Hover Dropdowns: 'services' | 'brands' | 'areas' | null
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'brands' | 'areas' | null>(null);
  const dropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Accordion State
  const [mobileAccordions, setMobileAccordions] = useState<{
    services: boolean;
    brands: boolean;
    areas: boolean;
  }>({
    services: false,
    brands: false,
    areas: false
  });

  // Smooth scroll listener for sticky header transition
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu and dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Hover Handlers with graceful debounce
  const handleDropdownEnter = (menu: 'services' | 'brands' | 'areas') => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleDropdownLeave = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
    }
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleNavClick = (view: string, slug?: string) => {
    onNavigate(view, slug);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileAccordion = (key: 'services' | 'brands' | 'areas') => {
    setMobileAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full transition-all duration-300 box-border bg-white">
      {/* 1. TOP INFORMATION BAR (Collapsible on Scroll) */}
      <div 
        className={`bg-slate-950 text-slate-300 text-xs border-b border-slate-800/80 transition-all duration-300 ease-in-out overflow-hidden w-full ${
          isScrolled ? 'max-h-0 opacity-0 py-0 border-b-0' : 'max-h-12 opacity-100 py-1.5 sm:py-2'
        } hidden lg:block`}
      >
        <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Location & Hours */}
          <div className="flex items-center gap-3 xl:gap-4 text-[11px] xl:text-xs min-w-0">
            <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
              <span>Abu Bakar Road, Badami Bagh, Lahore</span>
            </span>
            <span className="text-slate-700 shrink-0">|</span>
            <span className="inline-flex items-center gap-1.5 text-slate-300 shrink-0">
              <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Hours: <strong className="text-white font-semibold">9 AM – 9 PM</strong> (7 Days)</span>
            </span>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-3 xl:gap-4 text-[11px] xl:text-xs font-medium shrink-0">
            <button
              onClick={onOpenSearch}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800/80"
              title="Search Services (Ctrl+K)"
            >
              <Search className="w-3 h-3 text-[#E50914]" />
              <span>Search Services</span>
            </button>
            <span className="text-slate-700">|</span>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              onClick={() => trackEvent('phoneCallClicks')}
              className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
            >
              <Phone className="w-3 h-3 text-[#E50914] group-hover:scale-110 transition-transform" />
              <span>Call: <strong className="text-white font-bold">{BUSINESS_INFO.phone}</strong></span>
            </a>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
            >
              <ShieldCheck className="w-3 h-3 text-slate-500" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN SIMPLIFIED NAVIGATION BAR */}
      <div 
        className={`w-full max-w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all duration-300 relative ${
          isScrolled ? 'shadow-md shadow-slate-950/5' : 'shadow-2xs'
        }`}
      >
        <div className="w-full max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'h-16' : 'h-18 lg:h-20'
            }`}
          >
            {/* LEFT SIDE: Brand Logo & Wordmark */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left group cursor-pointer shrink-0 select-none py-1 focus-automotive rounded-lg"
              aria-label="Hamza Autos - Return to Home"
            >
              <BrandLogo variant={isScrolled ? 'compact' : 'horizontal'} />
            </button>

            {/* CENTER: Main Desktop Navigation (Simplified, Zero Overflow, Pure Focus) */}
            <nav 
              className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] xl:text-[13.5px] font-semibold text-slate-700"
              aria-label="Main Navigation"
            >
              {/* Home */}
              <button
                onClick={() => handleNavClick('home')}
                className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  currentView === 'home'
                    ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                    : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                }`}
              >
                <span>Home</span>
                {currentView === 'home' && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* SERVICES (With Hover Mega Menu) */}
              <div 
                className="relative py-2"
                onMouseEnter={() => handleDropdownEnter('services')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  onClick={() => handleNavClick('services')}
                  className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5 ${
                    currentView === 'services' || currentView === 'service-detail' || activeDropdown === 'services'
                      ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                      : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                  }`}
                  aria-expanded={activeDropdown === 'services'}
                  aria-haspopup="true"
                >
                  <span>Services</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'services' ? 'rotate-180 text-[#E50914]' : 'text-slate-400'
                  }`} />
                  {(currentView === 'services' || currentView === 'service-detail') && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>

                {/* SERVICES HOVER MEGA MENU DROPDOWN */}
                <AnimatePresence>
                  {activeDropdown === 'services' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 top-full w-[880px] xl:w-[940px] max-w-[95vw] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden"
                      onMouseEnter={() => handleDropdownEnter('services')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {/* Invisible hover bridge to prevent cursor gap drop */}
                      <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                      {/* Header bar */}
                      <div className="bg-slate-950 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-[#E50914]" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Specialized Motorcycle Repair Services · Badami Bagh
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Genuine Atlas Honda / Yamaha / Suzuki Spec
                        </span>
                      </div>

                      {/* 3-Column Services Mega Grid */}
                      <div className="p-6 grid grid-cols-3 gap-3 bg-white">
                        {SERVICES_LIST.map((service) => {
                          const meta = SERVICE_META[service.slug] || {
                            icon: Wrench,
                            tag: service.title,
                            desc: service.shortDescription
                          };
                          const Icon = meta.icon;

                          return (
                            <button
                              key={service.id}
                              onClick={() => handleNavClick('services', service.slug)}
                              className="group text-left p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all duration-150 flex items-start gap-3 cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E50914] group-hover:bg-[#E50914] group-hover:text-white transition-all duration-150 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#E50914] transition-colors leading-snug truncate">
                                  {meta.tag}
                                </h4>
                                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                                  {meta.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Mega Menu Footer Banner */}
                      <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-[#E50914]" />
                          <span>Same-day turnaround on most commuter repairs</span>
                        </div>
                        <button
                          onClick={() => handleNavClick('services')}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E50914] hover:text-[#CC0812] group cursor-pointer"
                        >
                          <span>View All 13 Repair Services</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* BRANDS (With Hover Dropdown) */}
              <div 
                className="relative py-2"
                onMouseEnter={() => handleDropdownEnter('brands')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  onClick={() => handleNavClick('brands')}
                  className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5 ${
                    currentView === 'brands' || currentView === 'brand-detail' || activeDropdown === 'brands'
                      ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                      : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                  }`}
                  aria-expanded={activeDropdown === 'brands'}
                  aria-haspopup="true"
                >
                  <span>Brands</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'brands' ? 'rotate-180 text-[#E50914]' : 'text-slate-400'
                  }`} />
                  {(currentView === 'brands' || currentView === 'brand-detail') && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>

                {/* BRANDS DROPDOWN */}
                <AnimatePresence>
                  {activeDropdown === 'brands' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 top-full w-80 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden p-3"
                      onMouseEnter={() => handleDropdownEnter('brands')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Supported Bike Brands</span>
                      </div>

                      <div className="space-y-1">
                        {BRANDS_LIST.map((brand) => (
                          <button
                            key={brand.id}
                            onClick={() => handleNavClick('brands', brand.slug)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <div>
                              <span className="text-xs font-bold text-slate-900 group-hover:text-[#E50914] transition-colors block">
                                {brand.name} Repair
                              </span>
                              <span className="text-[10px] text-slate-500 line-clamp-1">
                                {brand.popularModels.slice(0, 3).join(', ')}
                              </span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E50914] group-hover:translate-x-0.5 transition-all" />
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                        <button
                          onClick={() => handleNavClick('brands')}
                          className="text-xs font-bold text-[#E50914] hover:text-[#CC0812] inline-flex items-center gap-1 py-1 cursor-pointer"
                        >
                          <span>Explore All Brand Specializations</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Track Repair */}
              <button
                onClick={() => handleNavClick('track-repair')}
                className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  currentView === 'track-repair'
                    ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                    : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                }`}
              >
                <span>Track Repair</span>
                {currentView === 'track-repair' && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* AREAS WE SERVE (With Hover Dropdown) */}
              <div 
                className="relative py-2"
                onMouseEnter={() => handleDropdownEnter('areas')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  onClick={() => handleNavClick('areas')}
                  className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5 ${
                    currentView === 'areas' || currentView === 'area-detail' || activeDropdown === 'areas'
                      ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                      : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                  }`}
                  aria-expanded={activeDropdown === 'areas'}
                  aria-haspopup="true"
                >
                  <span>Areas We Serve</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'areas' ? 'rotate-180 text-[#E50914]' : 'text-slate-400'
                  }`} />
                  {(currentView === 'areas' || currentView === 'area-detail') && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>

                {/* AREAS DROPDOWN (2 Columns of Local Areas) */}
                <AnimatePresence>
                  {activeDropdown === 'areas' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 top-full w-[460px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden p-4"
                      onMouseEnter={() => handleDropdownEnter('areas')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                      <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                          <span>Lahore Commuter Localities</span>
                        </span>
                        <span className="text-[10px] text-slate-400 lowercase">Shop: Abu Bakar Rd</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {AREAS_LIST.map((area) => (
                          <button
                            key={area.id}
                            onClick={() => handleNavClick('areas', area.slug)}
                            className="text-left p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer flex items-start gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E50914] shrink-0 mt-0.5 transition-colors" />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 group-hover:text-[#E50914] transition-colors block truncate">
                                {area.name.replace(', Lahore', '')}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {area.estimatedDriveTime}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">Direct workshop access</span>
                        <button
                          onClick={() => handleNavClick('areas')}
                          className="font-bold text-[#E50914] hover:text-[#CC0812] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>All Areas &amp; Routes</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Workshop Gallery */}
              <button
                onClick={() => handleNavClick('gallery')}
                className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  currentView === 'gallery'
                    ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                    : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                }`}
              >
                <span>Workshop Gallery</span>
                {currentView === 'gallery' && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* Reviews */}
              <button
                onClick={() => handleNavClick('reviews')}
                className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  currentView === 'reviews'
                    ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                    : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                }`}
              >
                <span>Reviews</span>
                {currentView === 'reviews' && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* Blog */}
              <button
                onClick={() => handleNavClick('blog')}
                className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  currentView === 'blog'
                    ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                    : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                }`}
              >
                <span>Blog</span>
                {currentView === 'blog' && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>

              {/* Contact */}
              <button
                onClick={() => handleNavClick('contact')}
                className={`relative px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  currentView === 'contact'
                    ? 'text-[#E50914] font-bold bg-red-50/80 shadow-2xs'
                    : 'text-slate-700 hover:text-[#E50914] hover:bg-slate-50'
                }`}
              >
                <span>Contact</span>
                {currentView === 'contact' && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E50914] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </nav>

            {/* MOBILE & TABLET HAMBURGER BUTTON (< 1024px) */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="p-2 text-slate-700 hover:text-[#E50914] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Search website"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                onClick={() => trackEvent('phoneCallClicks')}
                className="p-2 text-white bg-[#E50914] hover:bg-red-700 rounded-xl shadow-2xs transition-colors"
                aria-label="Call Hamza Autos directly"
                title="Call Now"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-800 hover:text-[#E50914] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-IN ACCORDION DRAWER (< 1024px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop overlay with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-in drawer panel from right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              {/* Drawer Top Bar */}
              <div>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                  <BrandLogo variant="compact" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Info Bar */}
                <div className="px-4 py-2.5 bg-slate-950 text-slate-300 text-xs flex flex-col gap-1 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                    <span className="truncate">Abu Bakar Road, Badami Bagh, Lahore</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Hours: <strong className="text-white font-medium">9:00 AM – 9:00 PM</strong></span>
                  </div>
                </div>

                {/* Mobile Navigation List with Accordions */}
                <nav className="p-3 space-y-1">
                  {/* Home */}
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                      currentView === 'home'
                        ? 'bg-red-50 text-[#E50914] font-bold border-l-4 border-[#E50914]'
                        : 'text-slate-800 hover:bg-slate-100/80 hover:text-[#E50914]'
                    }`}
                  >
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* SERVICES ACCORDION */}
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => toggleMobileAccordion('services')}
                      className="w-full text-left px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer text-slate-800 hover:text-[#E50914]"
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-[#E50914]" />
                        <span>Services (13 Available)</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        mobileAccordions.services ? 'rotate-180 text-[#E50914]' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {mobileAccordions.services && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-slate-100 bg-white"
                        >
                          <div className="p-2 space-y-0.5">
                            {SERVICES_LIST.map((svc) => (
                              <button
                                key={svc.id}
                                onClick={() => handleNavClick('services', svc.slug)}
                                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-[#E50914] flex items-center justify-between cursor-pointer"
                              >
                                <span>{svc.title}</span>
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                              </button>
                            ))}
                            <button
                              onClick={() => handleNavClick('services')}
                              className="w-full text-center py-2 text-xs font-bold text-[#E50914] border-t border-slate-100 mt-1 cursor-pointer"
                            >
                              View All Services Overview →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* BRANDS ACCORDION */}
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => toggleMobileAccordion('brands')}
                      className="w-full text-left px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer text-slate-800 hover:text-[#E50914]"
                    >
                      <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-[#E50914]" />
                        <span>Brands (7 Covered)</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        mobileAccordions.brands ? 'rotate-180 text-[#E50914]' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {mobileAccordions.brands && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-slate-100 bg-white"
                        >
                          <div className="p-2 space-y-0.5">
                            {BRANDS_LIST.map((brand) => (
                              <button
                                key={brand.id}
                                onClick={() => handleNavClick('brands', brand.slug)}
                                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-[#E50914] flex items-center justify-between cursor-pointer"
                              >
                                <span>{brand.name} Repair</span>
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Track Repair */}
                  <button
                    onClick={() => handleNavClick('track-repair')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                      currentView === 'track-repair'
                        ? 'bg-red-50 text-[#E50914] font-bold border-l-4 border-[#E50914]'
                        : 'text-slate-800 hover:bg-slate-100/80 hover:text-[#E50914]'
                    }`}
                  >
                    <span>Track Repair</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* AREAS ACCORDION */}
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => toggleMobileAccordion('areas')}
                      className="w-full text-left px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer text-slate-800 hover:text-[#E50914]"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#E50914]" />
                        <span>Areas We Serve (10 Localities)</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        mobileAccordions.areas ? 'rotate-180 text-[#E50914]' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {mobileAccordions.areas && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-slate-100 bg-white"
                        >
                          <div className="p-2 space-y-0.5">
                            {AREAS_LIST.map((area) => (
                              <button
                                key={area.id}
                                onClick={() => handleNavClick('areas', area.slug)}
                                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-[#E50914] flex items-center justify-between cursor-pointer"
                              >
                                <span>{area.name}</span>
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Workshop Gallery */}
                  <button
                    onClick={() => handleNavClick('gallery')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                      currentView === 'gallery'
                        ? 'bg-red-50 text-[#E50914] font-bold border-l-4 border-[#E50914]'
                        : 'text-slate-800 hover:bg-slate-100/80 hover:text-[#E50914]'
                    }`}
                  >
                    <span>Workshop Gallery</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Reviews */}
                  <button
                    onClick={() => handleNavClick('reviews')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                      currentView === 'reviews'
                        ? 'bg-red-50 text-[#E50914] font-bold border-l-4 border-[#E50914]'
                        : 'text-slate-800 hover:bg-slate-100/80 hover:text-[#E50914]'
                    }`}
                  >
                    <span>Customer Reviews</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Blog */}
                  <button
                    onClick={() => handleNavClick('blog')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                      currentView === 'blog'
                        ? 'bg-red-50 text-[#E50914] font-bold border-l-4 border-[#E50914]'
                        : 'text-slate-800 hover:bg-slate-100/80 hover:text-[#E50914]'
                    }`}
                  >
                    <span>Maintenance Blog</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Contact */}
                  <button
                    onClick={() => handleNavClick('contact')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                      currentView === 'contact'
                        ? 'bg-red-50 text-[#E50914] font-bold border-l-4 border-[#E50914]'
                        : 'text-slate-800 hover:bg-slate-100/80 hover:text-[#E50914]'
                    }`}
                  >
                    <span>Contact Workshop</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3 px-4 text-center text-xs font-bold text-white bg-gradient-to-r from-[#E50914] to-[#B20710] hover:from-[#FF1E28] hover:to-[#CC0812] rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve a Repair Slot Online</span>
                </button>

                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    trackEvent('whatsappClicks');
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: {BUSINESS_INFO.whatsappNumber}</span>
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    trackEvent('phoneCallClicks');
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Direct Call: {BUSINESS_INFO.phone}</span>
                </a>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 py-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workshop Owner &amp; Staff Portal</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
