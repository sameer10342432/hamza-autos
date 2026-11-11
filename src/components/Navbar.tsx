import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Wrench, MapPin, Search } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenBooking, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top quick utility announcement */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Abu Bakar Road, Badami Bagh, Lahore
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Open 7 Days: {BUSINESS_INFO.operatingHours}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenSearch}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              Search Services
            </button>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              onClick={() => trackEvent('phoneCallClicks')}
              className="hover:text-white transition-colors"
            >
              Call: {BUSINESS_INFO.phone}
            </a>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-xs"
            >
              Owner Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: [Brand Wordmark] - [Single-Line Nav Links] - [1 Primary Action] */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left group cursor-pointer min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-black tracking-wider shadow-sm group-hover:bg-red-700 transition-colors shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 block leading-tight truncate">
                HAMZA AUTOS
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-red-600 tracking-wider uppercase block truncate">
                Motorcycle Repair · Badami Bagh
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleNavClick(link.view)}
                  className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
                    isActive
                      ? 'text-red-600 font-semibold border-b-2 border-red-600'
                      : 'hover:text-red-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium border border-slate-200"
              aria-label="Search Services, Brands & Knowledge Base"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search</span>
            </button>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsappClicks')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              WhatsApp
            </a>
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Book Repair / Call
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-700 hover:text-red-600 rounded-lg"
              aria-label="Search site"
            >
              <Search className="w-5 h-5" />
            </button>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              onClick={() => trackEvent('phoneCallClicks')}
              className="p-2 text-red-600 bg-red-50 rounded-lg"
              aria-label="Call Hamza Autos"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-red-600 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentView === link.view
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-red-600 rounded-lg shadow-xs"
            >
              Book Service Online
            </button>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setMobileMenuOpen(false);
                trackEvent('whatsappClicks');
              }}
              className="w-full py-2.5 text-center text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp ({BUSINESS_INFO.whatsappNumber})
            </a>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-center text-xs text-slate-500 py-1"
            >
              Workshop Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
