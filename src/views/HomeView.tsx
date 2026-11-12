import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  ArrowRight, 
  ShieldCheck, 
  Settings, 
  Sparkles, 
  Star, 
  ChevronDown, 
  Navigation, 
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { 
  BUSINESS_INFO, 
  BRANDS_LIST, 
  AREAS_LIST 
} from '../data/businessData';
import { 
  trackEvent, 
  buildWhatsAppLink, 
  getStoredServices, 
  getStoredReviews, 
  getStoredFAQs, 
  getStoredGallery, 
  getStoredSettings 
} from '../utils/businessLogic';
import { ServiceItem, CustomerReview, FAQItem, GalleryItem, SiteSettings } from '../types';

interface HomeViewProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

// Unified cinematic motion design variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenBooking }) => {
  const [services] = useState<ServiceItem[]>(() => getStoredServices());
  const [reviews] = useState<CustomerReview[]>(() => getStoredReviews());
  const [faqs] = useState<FAQItem[]>(() => getStoredFAQs());
  const [gallery] = useState<GalleryItem[]>(() => getStoredGallery());
  const [settings] = useState<SiteSettings>(() => getStoredSettings());

  // Estimator interactive widget state
  const [estBrand, setEstBrand] = useState('Honda');
  const [estServiceSlug, setEstServiceSlug] = useState('bike-tuning');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedEstService = services.find(s => s.slug === estServiceSlug) || services[0];

  const handleCall = () => {
    trackEvent('phoneCallClicks');
    window.location.href = `tel:${settings.phoneRaw || BUSINESS_INFO.phoneRaw}`;
  };

  const handleWhatsApp = () => {
    trackEvent('whatsappClicks');
    window.open(buildWhatsAppLink(), '_blank');
  };

  const handleDirections = () => {
    trackEvent('mapDirectionsClicks');
    window.open(BUSINESS_INFO.googleMapsDirectionsUrl, '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-24 overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0F172A] via-[#0B0F17] to-[#111827] text-white overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-slate-800/80">
        {/* Subtle decorative background workshop texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
          <img
            src="/assets/images/home/motorcycle-workshop-hero.jpg"
            alt="Real Motorcycle Repair Workshop - Hamza Autos Badami Bagh Lahore"
            className="w-full h-full object-cover scale-105 filter blur-[0.5px]"
          />
        </div>
        {/* Carbon mechanical grid pattern overlay */}
        <div className="absolute inset-0 bg-dark-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/50 pointer-events-none" />

        {/* Slow rotating ambient sprocket watermark in background */}
        <div className="absolute -right-24 -top-24 w-96 h-96 opacity-5 pointer-events-none animate-[spin_60s_linear_infinite]">
          <svg viewBox="0 0 120 120" fill="currentColor" className="text-white w-full h-full">
            <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="12 6" />
            <circle cx="60" cy="60" r="28" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Heading, Value Proposition & Conversion CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Animated Hero Brand Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-600/40 text-red-400 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50914]"></span>
                </span>
                <span className="tracking-[0.14em]">Badami Bagh's Trusted Motorcycle Workshop</span>
              </motion.div>

              {/* Exact H1 Title preserved */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12] font-heading"
              >
                Trusted Bike Mechanic &amp; Motorcycle Repair Shop in Badami Bagh, Lahore
              </motion.h1>

              {/* Exact Subheading preserved */}
              <motion.p 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal"
              >
                Looking for reliable motorcycle repair and maintenance in Badami Bagh, Lahore? Visit Hamza Autos for bike engine repairs, tuning, oil changes, electrical work and general motorcycle maintenance.
              </motion.p>

              {/* 3 Primary CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCall}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#E50914] to-[#B20710] hover:from-[#FF1E28] hover:to-[#CC0812] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Hamza Autos ({BUSINESS_INFO.phone})</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsApp}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDirections}
                  className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/90 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-red-400" />
                  <span>Get Directions</span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.48 }}
                className="pt-4 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300"
              >
                <div className="flex items-center gap-2 bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent Quotes First</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Same-Day Turnaround</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All 70cc to 150cc Bikes</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Workshop Presence Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-4 sm:space-y-5">
                <div className="group relative rounded-xl overflow-hidden aspect-video border border-slate-700/80 shadow-inner">
                  <img
                    src="/assets/images/home/motorcycle-service-bay-presence.jpg"
                    alt="Hamza Autos Motorcycle Workshop Abu Bakar Road Badami Bagh Lahore"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-slate-950/90 text-white rounded text-[11px] font-medium backdrop-blur-xs border border-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Abu Bakar Road Service Bay · Open</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                    <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Official Workshop Address</span>
                      <span className="text-slate-300 leading-relaxed">{BUSINESS_INFO.fullAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#E50914] shrink-0" />
                      <span className="text-slate-300 font-medium">Daily Operating Hours</span>
                    </div>
                    <span className="font-bold text-white bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded">
                      {BUSINESS_INFO.operatingHours}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenBooking()}
                  className="w-full py-3 bg-gradient-to-r from-[#E50914] to-[#B20710] hover:from-[#FF1E28] hover:to-[#CC0812] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-950/50 hover:shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Reserve a Repair Slot Online</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT HAMZA AUTOS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={itemVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-automotive hover:shadow-automotive-hover transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block">
                About Hamza Autos
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
                Honest Mechanics, High Standards &amp; Genuine Care in Badami Bagh
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Founded to give Lahore motorcycle riders a straightforward, dependable alternative to guesswork mechanics, <strong className="text-slate-900 font-bold">Hamza Autos</strong> is located directly on Abu Bakar Road, Badami Bagh (near Ali Hajvery Marriage Hall).
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We believe in complete transparency: before taking apart any engine, transmission, or wiring harness, we inspect your bike, diagnose the real root cause, and explain the required repairs and parts cost upfront. Whether you need a 15-minute engine oil change or a full cylinder engine overhaul, you receive honest craftsmanship.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>No hidden charges or fabricated defects</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>Authentic 4T motorcycle lubricants</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>Specialized feeler gauges &amp; diagnostic tools</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>Convenient location on Abu Bakar Road</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="group rounded-2xl overflow-hidden border border-slate-200 aspect-square shadow-sm">
                <img
                  src="/assets/images/about/engine-overhaul-workbench.jpg"
                  alt="Motorcycle Engine Overhaul and Precision Cylinder Head Repair at Hamza Autos"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="group rounded-2xl overflow-hidden border border-slate-200 aspect-square shadow-sm">
                <img
                  src="/assets/images/about/tuning-carburetor-setup.jpg"
                  alt="Professional Motorcycle Carburetor Tuning and Fuel System Calibration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. MOTORCYCLE REPAIR SERVICES (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block mb-1">
              Complete Workshop Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
              Our Motorcycle Repair Services in Badami Bagh
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              From engine overhauls to tyre punctures, our workshop handles all mechanical and electrical requirements for your motorcycle.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E50914] hover:text-red-700 cursor-pointer group"
          >
            <span>Explore All 13 Services</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Bento Grid with Motion Stagger & Card Lift */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.slice(0, 6).map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-automotive hover:shadow-automotive-hover hover:border-red-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/85 text-white rounded-md text-[11px] font-semibold backdrop-blur-xs border border-slate-800">
                    {service.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-bold text-slate-950 group-hover:text-[#E50914] transition-colors mb-2 font-heading">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {service.shortDescription}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                    <span className="font-semibold text-slate-700">Estimated Duration:</span> {service.estimatedTime}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {service.supportedBikes.slice(0, 3).map((bike, i) => (
                      <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {bike}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('service-detail', service.slug)}
                  className="text-xs font-bold text-slate-700 hover:text-[#E50914] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onOpenBooking(service.title)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-[#E50914] hover:bg-[#E50914] hover:text-white rounded-xl transition-all duration-200 cursor-pointer shadow-xs"
                >
                  Book Service
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. MOTORCYCLE BRANDS WE SERVICE */}
      <section className="bg-slate-100/90 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block mb-1">
              Broad Brand Expertise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
              Motorcycle Brands We Service at Hamza Autos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We service all popular commuter, utility, and sporty motorcycles in Pakistan with model-appropriate techniques and factory-spec tolerances.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {BRANDS_LIST.map((brand) => (
              <motion.div
                key={brand.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                onClick={() => onNavigate('brand-detail', brand.slug)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E50914] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E50914] group-hover:bg-[#E50914] group-hover:text-white transition-colors duration-200 flex items-center justify-center font-bold text-sm mb-3">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="text-sm font-bold text-slate-950 mb-1 group-hover:text-[#E50914] transition-colors font-heading">
                    {brand.name} Repair
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {brand.overview}
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-[#E50914] font-semibold">
                  <span>View Repair Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              onClick={() => onNavigate('brands')}
              className="bg-gradient-to-br from-[#E50914] to-[#B20710] text-white p-5 rounded-2xl shadow-md flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <Sparkles className="w-8 h-8 text-red-200 mb-3" />
                <h3 className="text-sm font-bold mb-1 font-heading">Need Service for Another Brand?</h3>
                <p className="text-xs text-red-100 leading-relaxed">
                  We handle all 4-stroke commuter motorcycles running in Lahore.
                </p>
              </div>
              <span className="text-xs font-bold underline mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Brand Directory →
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. INTERACTIVE SERVICE ESTIMATOR & DIAGNOSTIC WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={itemVariants}
          className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-dark-grid opacity-30 pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Quick Service Planner
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white font-heading">
                Check Service Details &amp; Estimated Duration
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose your motorcycle brand and the service you require to see the diagnostic process, symptoms solved, and estimated workshop turnaround time at Badami Bagh.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Select Motorcycle Brand
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BRANDS_LIST.slice(0, 6).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setEstBrand(b.name)}
                        className={`text-xs py-2 px-2 rounded-xl font-medium transition-all duration-200 cursor-pointer text-center truncate ${
                          estBrand === b.name
                            ? 'bg-[#E50914] text-white font-bold shadow-md shadow-red-950/60'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Select Required Service
                  </label>
                  <select
                    value={estServiceSlug}
                    onChange={(e) => setEstServiceSlug(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-hidden focus:border-[#E50914] cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.slug}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900/95 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">{selectedEstService.title}</h3>
                  <span className="text-xs text-red-400 font-medium">Configured for: {estBrand}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Est. Turnaround</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg inline-block">
                    {selectedEstService.estimatedTime}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-300 block">What Hamza Autos Checks &amp; Fixes:</span>
                <ul className="space-y-1.5 text-slate-300">
                  {selectedEstService.keyFeatures.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenBooking(selectedEstService.title)}
                  className="flex-1 py-2.5 px-4 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center shadow-md shadow-red-950/50"
                >
                  Book This Repair Slot
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={buildWhatsAppLink({
                    brand: estBrand,
                    service: selectedEstService.title
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsappClicks')}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-950/50 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask on WhatsApp</span>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. WHY CHOOSE HAMZA AUTOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block mb-1">
            Built on Integrity
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
            Why Choose Hamza Autos in Badami Bagh?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            We understand the daily importance of your motorcycle for commuting, business, and livelihood in Lahore.
          </p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-automotive hover:shadow-automotive-hover transition-all">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-heading">Transparent Pricing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We inspect the motorcycle, explain the exact fault, and quote the repair and parts cost before turning a single screw. No surprise bills.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-automotive hover:shadow-automotive-hover transition-all">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center mb-4">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-heading">Proper Mechanics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We use calibrated feeler gauges for tappets, multimeters for electrical coils, and torque patterns rather than hammering or careless force.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-automotive hover:shadow-automotive-hover transition-all">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-heading">Fast Turnaround</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Routine oil servicing takes 15-20 minutes. Bike tuning takes under an hour. Most engine overhauls are completed on the very same day.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-automotive hover:shadow-automotive-hover transition-all">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-heading">Genuine Lubricants</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We supply authentic 4T motorcycle lubricants sealed in bottles, preventing counterfeit oil that ruins engine pistons and clutches in summer heat.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. AREAS WE SERVE HIGHLIGHT */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block mb-1">
                Local Proximity
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
                Areas We Serve from Badami Bagh, Lahore
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Our main workshop is located in Badami Bagh. Riders from nearby neighborhoods easily reach us via main roads.
              </p>
            </div>
            <button
              onClick={() => onNavigate('areas')}
              className="text-xs font-bold text-[#E50914] hover:text-red-700 flex items-center gap-1 cursor-pointer group"
            >
              <span>View All Served Localities</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {AREAS_LIST.slice(0, 4).map((area) => (
              <motion.div
                key={area.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                onClick={() => onNavigate('area-detail', area.slug)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#E50914] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-950 font-heading">{area.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {area.estimatedDriveTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {area.commuterContext}
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-[#E50914] flex items-center gap-1 pt-2 border-t border-slate-100">
                  <span>View Route &amp; Common Issues</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. WORKSHOP GALLERY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block mb-1">
              Visual Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
              Our Workshop &amp; Repair Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Take a look at our clean service bays, precision engine overhauls, and tuning setups in Badami Bagh.
            </p>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs font-bold text-[#E50914] hover:text-red-700 flex items-center gap-1 cursor-pointer group"
          >
            <span>Explore Workshop Gallery</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {gallery.map((item) => (
            <motion.div 
              key={item.id} 
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] text-[#E50914] font-bold uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-slate-950 line-clamp-1 font-heading">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 9. CUSTOMER TESTIMONIALS */}
      <section className="bg-slate-950 text-white py-16 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-grid opacity-30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
              Real Local Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              What Badami Bagh Motorcycle Owners Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Genuine reviews from riders in Badami Bagh, Shadbagh, Misri Shah, and surrounding Lahore neighborhoods.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {reviews.slice(0, 3).map((rev) => (
              <motion.div
                key={rev.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg shadow-black/20"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{rev.authorName}</span>
                      <span className="text-[11px] text-slate-400">{rev.area} · {rev.bikeModel}</span>
                    </div>
                    {rev.isVerifiedCustomer && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('reviews')}
              className="text-xs font-bold text-red-400 hover:text-red-300 underline cursor-pointer transition-colors"
            >
              Read All Verified Reviews or Leave Feedback →
            </button>
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block mb-1">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Everything you need to know about visiting Hamza Autos in Badami Bagh.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all shadow-automotive"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-[#E50914] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#E50914]' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. LOCATION & GOOGLE MAPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-automotive">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E50914]">
                Physical Workshop
              </span>
              <h2 className="text-2xl font-bold text-slate-950 tracking-tight font-heading">
                Visit Hamza Autos on Abu Bakar Road
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Located near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore. We are easily accessible from Lorry Adda, Circular Road, and Timber Market.
              </p>

              <div className="space-y-3 text-xs text-slate-700 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Exact Address:</span>
                    <span>{BUSINESS_INFO.fullAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#E50914] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Phone &amp; WhatsApp:</span>
                    <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="text-[#E50914] font-semibold hover:underline">
                      {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#E50914] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Working Hours:</span>
                    <span>{BUSINESS_INFO.operatingHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDirections}
                  className="px-4 py-2.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Google Maps Directions</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCall}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </motion.button>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="lg:col-span-7 h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
              <iframe
                title="Hamza Autos Badami Bagh Google Map"
                src={BUSINESS_INFO.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={itemVariants}
          className="bg-gradient-to-r from-[#E50914] via-[#B20710] to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-red-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-dark-grid opacity-20 pointer-events-none" />
          <div className="relative space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
              Ready for a Smooth, Reliable Ride?
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
              Visit Hamza Autos today on Abu Bakar Road, Badami Bagh, or send a quick WhatsApp enquiry. Our mechanics are ready to assist you.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCall}
              className="px-5 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#E50914]" />
              <span>Call +92 325 1814548</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleWhatsApp}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Message</span>
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
