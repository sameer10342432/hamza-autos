import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Wrench, 
  MapPin, 
  Search, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_INFO } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenBooking, 
  onOpenSearch 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for sticky collapse effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
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

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (view: string, slug?: string) => {
    onNavigate(view, slug);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Services', view: 'services' },
    { label: 'Brands', view: 'brands' },
    { label: 'Track Repair', view: 'track-repair' },
    { label: 'Areas We Serve', view: 'areas' },
    { label: 'Workshop Gallery', view: 'gallery' },
    { label: 'Reviews', view: 'reviews' },
    { label: 'Blog', view: 'blog' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. TOP INFORMATION BAR (Dark Navy, Compact, Collapses on Scroll) */}
      <div 
        className={`bg-slate-950 text-slate-300 text-xs border-b border-slate-800/80 transition-all duration-300 ease-in-out overflow-hidden ${
          isScrolled ? 'max-h-0 opacity-0 py-0 border-b-0' : 'max-h-12 opacity-100 py-2'
        } hidden md:block`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Location & Hours (No unconfirmed operating days) */}
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Abu Bakar Road, Badami Bagh, Lahore</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Hours: <strong className="text-white font-semibold">9:00 AM – 9:00 PM</strong></span>
            </span>
          </div>

          {/* Right: Quick Utility Actions */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenSearch}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800/60"
              title="Search Services (Ctrl+K)"
            >
              <Search className="w-3 h-3 text-red-400" />
              <span>Search Services</span>
            </button>
            <span className="text-slate-700">|</span>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              onClick={() => trackEvent('phoneCallClicks')}
              className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-red-500" />
              <span>Call: <strong className="text-white">{BUSINESS_INFO.phone}</strong></span>
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

      {/* 2. MAIN NAVIGATION BAR */}
      <div 
        className={`w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all duration-300 ${
          isScrolled ? 'shadow-md shadow-slate-900/5' : 'shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`flex items-center justify-between gap-2 lg:gap-4 transition-all duration-300 ${
              isScrolled ? 'h-16' : 'h-18 lg:h-20'
            }`}
          >
            {/* LEFT SIDE: Brand Logo & Wordmark (Fixed truncation completely) */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group cursor-pointer shrink-0 select-none py-1"
              aria-label="Hamza Autos - Return to Home"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center shadow-md shadow-red-600/20 group-hover:from-red-500 group-hover:to-red-700 group-hover:shadow-red-600/30 transition-all duration-300 shrink-0">
                <Wrench className="w-5 h-5 sm:w-5 sm:h-5 transform group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="shrink-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 block leading-tight whitespace-nowrap font-heading">
                    HAMZA AUTOS
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-red-600 tracking-wider uppercase block leading-tight whitespace-nowrap mt-0.5">
                  Motorcycle Repair · Badami Bagh
                </span>
              </div>
            </button>

            {/* CENTER: Main Navigation Links */}
            <nav 
              className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] xl:text-sm font-medium text-slate-700"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => handleNavClick(link.view)}
                    className={`relative px-2.5 xl:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer font-medium ${
                      isActive
                        ? 'text-red-600 font-bold bg-red-50/70'
                        : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-red-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT SIDE: Action Buttons */}
            <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 shrink-0">
              {/* Search button with shortcut indicator */}
              <button
                onClick={onOpenSearch}
                className="p-2 xl:px-3 xl:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 text-xs font-semibold border border-slate-200 shadow-xs hover:border-slate-300"
                aria-label="Search Services, Brands & Articles"
                title="Search (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span className="hidden xl:inline">Search</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded">
                  Ctrl K
                </kbd>
              </button>

              {/* WhatsApp Quick Chat button */}
              <motion.a
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsappClicks')}
                className="inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100/90 rounded-xl border border-emerald-200/80 hover:border-emerald-300 transition-all duration-200 whitespace-nowrap shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">WhatsApp</span>
              </motion.a>

              {/* Primary Call / Book Repair button */}
              <motion.button
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 px-3.5 xl:px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-700 rounded-xl shadow-sm hover:shadow-red-600/30 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Book Repair / Call</span>
              </motion.button>
            </div>

            {/* MOBILE QUICK ACTIONS & HAMBURGER */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                onClick={onOpenSearch}
                className="p-2 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Search website"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                onClick={() => trackEvent('phoneCallClicks')}
                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors"
                aria-label="Call Hamza Autos directly"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-800 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-IN NAVIGATION DRAWER (Separate, accessible, beautiful) */}
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
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
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
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-base font-extrabold text-slate-950 block leading-tight font-heading">
                        HAMZA AUTOS
                      </span>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                        Badami Bagh, Lahore
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Info Bar */}
                <div className="px-4 py-2.5 bg-slate-900 text-slate-300 text-xs flex flex-col gap-1 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">Abu Bakar Road, Badami Bagh</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Hours: <strong className="text-white font-medium">9:00 AM – 9:00 PM</strong></span>
                  </div>
                </div>

                {/* Navigation Links List */}
                <nav className="p-3 space-y-1">
                  {navLinks.map((link) => {
                    const isActive = currentView === link.view;
                    return (
                      <button
                        key={link.view}
                        onClick={() => handleNavClick(link.view)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                          isActive
                            ? 'bg-red-50 text-red-700 font-bold border-l-4 border-red-600'
                            : 'text-slate-800 hover:bg-slate-100/80 hover:text-red-600'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-3 px-4 text-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
                  className="w-full py-3 px-4 text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
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
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>Direct Call: {BUSINESS_INFO.phone}</span>
                </a>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 py-1"
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
