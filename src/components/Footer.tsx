import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Wrench, Shield, ChevronRight } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { BUSINESS_INFO, SERVICES_LIST, AREAS_LIST, BRANDS_LIST } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
}

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (view: string, slug?: string) => {
    onNavigate(view, slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={footerVariants}
      className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80 relative overflow-hidden"
    >
      {/* Subtle carbon mechanical grid accent in footer background */}
      <div className="absolute inset-0 bg-dark-grid opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Business Identity & Address */}
          <div>
            <div className="mb-5">
              <BrandLogo variant="white" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">
              Professional motorcycle repair and maintenance workshop in Badami Bagh, Lahore. Dedicated to honest engine overhauls, fuel economy tuning, electrical repairs, and genuine servicing for Pakistani riders.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  {BUSINESS_INFO.fullAddress}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E50914] shrink-0" />
                <span className="text-slate-300">
                  {BUSINESS_INFO.operatingHours} · 7 Days a Week
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E50914] shrink-0" />
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  onClick={() => trackEvent('phoneCallClicks')}
                  className="text-white hover:text-red-400 font-bold transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Motorcycle Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50914]" />
              Repair Services
            </h3>
            <ul className="space-y-2 text-xs">
              {SERVICES_LIST.slice(0, 8).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => handleNav('service-detail', service.slug)}
                    className="hover:text-white text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer text-left group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#E50914] shrink-0 transform group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:text-red-400 transition-colors">{service.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="text-[#E50914] hover:text-red-300 font-bold mt-2 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All 13 Services →</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Areas We Serve */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50914]" />
              Areas We Serve
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Physical workshop in Badami Bagh, welcoming riders from across North &amp; Central Lahore:
            </p>
            <ul className="space-y-2 text-xs">
              {AREAS_LIST.slice(0, 7).map((area) => (
                <li key={area.id}>
                  <button
                    onClick={() => handleNav('area-detail', area.slug)}
                    className="hover:text-white text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer text-left group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#E50914] shrink-0 transform group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:text-red-400 transition-colors">{area.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('areas')}
                  className="text-[#E50914] hover:text-red-300 font-bold mt-2 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Check Route From Your Area →</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Actions & Brands */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50914]" />
              Instant Contact
            </h3>
            <div className="space-y-3 mb-6">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsappClicks')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={BUSINESS_INFO.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('mapDirectionsClicks')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Open in Google Maps</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNav('track-repair')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700/80 transition-all cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Track Repair Status (Job Card)</span>
              </motion.button>
            </div>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-heading">
              Bikes We Service:
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
              {BRANDS_LIST.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => handleNav('brand-detail', b.slug)}
                  className="hover:text-red-400 transition-colors cursor-pointer"
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
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => handleNav('sitemap')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              HTML Sitemap &amp; SEO
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
    </motion.footer>
  );
};
