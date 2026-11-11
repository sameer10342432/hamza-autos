import React, { useEffect } from 'react';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  Calendar, 
  MapPin,
  ArrowRight
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { buildWhatsAppLink, trackEvent, getStoredServices } from '../utils/businessLogic';

interface ServiceDetailViewProps {
  slug: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ slug, onNavigate, onOpenBooking }) => {
  const allServices = getStoredServices();
  const service = allServices.find((s) => s.slug === slug) || allServices[0];

  useEffect(() => {
    document.title = `${service.title} in Badami Bagh Lahore – Hamza Autos`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${service.shortDescription} Located at Abu Bakar Road, Badami Bagh, Lahore. Call +92 325 1814548.`);
    }
  }, [service]);

  const relatedServices = allServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-red-600 cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button onClick={() => onNavigate('services')} className="hover:text-red-600 cursor-pointer">
          Services
        </button>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{service.title}</span>
      </nav>

      {/* Main Service Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Technical Overview, Symptoms, Steps */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-2">
              {service.category} · Badami Bagh Workshop
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {service.title} in Badami Bagh, Lahore
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-4">
              {service.fullDescription}
            </p>
          </div>

          {/* Hero Visual for Service */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs aspect-16/9 bg-slate-100">
            <img
              src={service.image}
              alt={`${service.title} at Hamza Autos Badami Bagh`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Common Symptoms Addressed */}
          <div className="bg-red-50/70 rounded-2xl p-6 border border-red-100 space-y-3">
            <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Signs Your Bike Needs This Service:</span>
            </div>
            <ul className="space-y-2 text-xs text-red-950">
              {service.commonSymptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 6-Step Workshop Process */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Our 6-Step Repair &amp; Service Workflow
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 shadow-2xs"
                >
                  <span className="font-semibold text-slate-900 block">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Checklist Features */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              What Is Included in This Service
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Motorcycles */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Supported Motorcycle Models for This Repair:
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.supportedBikes.map((bike, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  {bike}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking / Quick Contact Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-5">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                Workshop Estimate
              </span>
              <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Transparent inspection &amp; upfront pricing at Abu Bakar Road, Badami Bagh.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 border-y border-slate-100 py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimated Duration:</span>
                <span className="font-bold text-slate-900">{service.estimatedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service Location:</span>
                <span className="font-medium text-slate-900">Hamza Autos, Badami Bagh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Parts Quality:</span>
                <span className="font-medium text-emerald-600">OEM / Verified Grade</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Workshop Hours:</span>
                <span className="font-medium text-slate-900">9:00 AM – 9:00 PM</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => onOpenBooking(service.title)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Book This Repair Slot
              </button>

              <a
                href={buildWhatsAppLink({ service: service.title })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsappClicks')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire via WhatsApp
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                onClick={() => trackEvent('phoneCallClicks')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-red-600" />
                Call Workshop: {BUSINESS_INFO.phone}
              </a>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Abu Bakar Road, Badami Bagh, Lahore</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Other Services You Might Need</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedServices.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onNavigate('service-detail', rel.slug)}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-red-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-red-600 font-bold uppercase">{rel.category}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 mb-2">{rel.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{rel.shortDescription}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs font-semibold text-red-600">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
