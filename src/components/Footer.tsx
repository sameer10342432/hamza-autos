import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Wrench, Shield, ChevronRight } from 'lucide-react';
import { BUSINESS_INFO, SERVICES_LIST, AREAS_LIST, BRANDS_LIST } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (view: string, slug?: string) => {
    onNavigate(view, slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Business Identity & Address */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  HAMZA AUTOS
                </span>
                <span className="text-xs text-red-500 font-medium">Motorcycle Repair Workshop</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Professional motorcycle repair and maintenance workshop in Badami Bagh, Lahore. Dedicated to honest engine overhauls, fuel economy tuning, electrical repairs, and genuine servicing for Pakistani riders.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  {BUSINESS_INFO.fullAddress}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-slate-300">
                  {BUSINESS_INFO.operatingHours} · 7 Days a Week
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  onClick={() => trackEvent('phoneCallClicks')}
                  className="text-white hover:text-red-400 font-semibold transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Motorcycle Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Repair Services
            </h3>
            <ul className="space-y-2 text-xs">
              {SERVICES_LIST.slice(0, 8).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => handleNav('service-detail', service.slug)}
                    className="hover:text-white text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{service.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="text-red-400 hover:text-red-300 font-medium mt-2 inline-block cursor-pointer"
                >
                  View All 13 Services →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Areas We Serve */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Areas We Serve
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Physical workshop in Badami Bagh, welcoming riders from across North & Central Lahore:
            </p>
            <ul className="space-y-2 text-xs">
              {AREAS_LIST.slice(0, 7).map((area) => (
                <li key={area.id}>
                  <button
                    onClick={() => handleNav('area-detail', area.slug)}
                    className="hover:text-white text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{area.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('areas')}
                  className="text-red-400 hover:text-red-300 font-medium mt-2 inline-block cursor-pointer"
                >
                  Check Route From Your Area →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Actions & Brands */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Instant Contact
            </h3>
            <div className="space-y-3 mb-6">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsappClicks')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message on WhatsApp
              </a>

              <a
                href={BUSINESS_INFO.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('mapDirectionsClicks')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                <MapPin className="w-4 h-4 text-red-400" />
                Open in Google Maps
              </a>

              <button
                onClick={() => handleNav('track-repair')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-red-500" />
                Track Repair Status (Job Card)
              </button>
            </div>

            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Bikes We Service:
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              {BRANDS_LIST.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => handleNav('brand-detail', b.slug)}
                  className="hover:text-white cursor-pointer"
                >
                  {b.name}{i < BRANDS_LIST.length - 1 ? ' ·' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal zone */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Hamza Autos. All Rights Reserved. Located at Abu Bakar Road, Badami Bagh, Lahore.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('privacy')}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => handleNav('sitemap')}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              HTML Sitemap & SEO
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
