import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  Lock,
  ExternalLink
} from 'lucide-react';
import { lookupJobCardForTracking, PublicTrackingResult } from '../utils/workshopLogic';
import { BUSINESS_INFO } from '../data/businessData';
import { trackEvent, buildWhatsAppLink } from '../utils/businessLogic';
import { RepairStatus } from '../types';

interface TrackRepairViewProps {
  initialJobCard?: string;
  onNavigate: (view: string, slug?: string) => void;
}

export const TrackRepairView: React.FC<TrackRepairViewProps> = ({ initialJobCard, onNavigate }) => {
  const [jobCardNumber, setJobCardNumber] = useState(initialJobCard || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<PublicTrackingResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Track Motorcycle Repair Status – Hamza Autos Badami Bagh";
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const res = lookupJobCardForTracking(jobCardNumber, phoneNumber);
      setResult(res);
      setLoading(false);
    }, 250);
  };

  const statusSteps: { status: RepairStatus; label: string; desc: string }[] = [
    { status: 'Received', label: 'Bike Received', desc: 'Bike checked into Abu Bakar Road workshop bay' },
    { status: 'Diagnosis', label: 'Inspection & Diagnosis', desc: 'Mechanical & electrical fault testing' },
    { status: 'Parts Waiting', label: 'Parts Procurement', desc: 'Sourcing authentic replacement parts' },
    { status: 'Work In Progress', label: 'Work In Progress', desc: 'Active repair, tuning or engine assembly' },
    { status: 'Testing & Quality Check', label: 'Testing & QC', desc: 'Test ride, tappet check & leak verification' },
    { status: 'Ready for Delivery', label: 'Ready for Delivery', desc: 'Cleaned and ready for customer pickup' },
    { status: 'Delivered', label: 'Delivered', desc: 'Handed over to rider with warranty notes' },
  ];

  const getStepIndex = (currentStatus?: RepairStatus) => {
    if (!currentStatus) return -1;
    return statusSteps.findIndex(s => s.status === currentStatus);
  };

  const currentIndex = getStepIndex(result?.repairStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Live Workshop Status Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your Motorcycle Repair
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Enter your unique Job Card Number and registered mobile number to check the real-time diagnosis, assembly progress, estimated turnaround, and bill for your bike.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Job Card Number *
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={jobCardNumber}
                  onChange={(e) => setJobCardNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. HA-JC-2026-001"
                  className="w-full text-xs font-mono uppercase pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Printed on your paper slip or sent via WhatsApp
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Registered Mobile Number *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0300 7654321"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Security verification prevents unauthorized access
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Verifying with Workshop...' : 'Track Repair Progress'}
          </button>
        </form>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Customer Privacy Protected:</strong> Only the owner with the registered phone number can view job details. Confidential mechanic notes are never displayed.
          </span>
        </div>
      </div>

      {/* Search Result Display */}
      {hasSearched && (
        <>
          {result?.found ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Status Banner */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <span className="text-xs text-red-400 font-mono font-bold block uppercase tracking-wider">
                      Job Card #{result.jobCardNumber}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {result.bikeBrand} {result.bikeModel}
                    </h2>
                    {result.registrationNumber && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-xs">
                        Reg: {result.registrationNumber}
                      </span>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400 block mb-1">Current Repair Status:</span>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white font-bold rounded-lg text-xs tracking-wide">
                      <Clock className="w-3.5 h-3.5" />
                      {result.repairStatus}
                    </span>
                  </div>
                </div>

                {/* Interactive Multi-Step Timeline */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                    Live Workshop Milestones
                  </h3>

                  <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
                      {statusSteps.map((step, idx) => {
                        const isDone = idx < currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                          <div key={step.status} className="flex flex-row sm:flex-col items-start gap-3 sm:gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                isDone 
                                  ? 'bg-emerald-500 text-white' 
                                  : isCurrent 
                                  ? 'bg-red-600 text-white ring-4 ring-red-500/30' 
                                  : 'bg-slate-800 text-slate-500'
                              }`}>
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <div className="hidden sm:block h-0.5 bg-slate-800 flex-1" />
                            </div>

                            <div>
                              <span className={`text-xs font-bold block ${isCurrent ? 'text-red-400' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                                {step.label}
                              </span>
                              <span className="text-[10px] text-slate-400 hidden sm:block leading-tight mt-0.5">
                                {step.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Card: Customer Request & Diagnostics */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Repair Request & Diagnostics
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-500 block mb-0.5">Reported Complaint:</span>
                      <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {result.customerComplaint || 'Standard periodic servicing and inspection requested.'}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-500 block mb-1">Approved Repair Services:</span>
                      <ul className="space-y-1.5">
                        {result.requiredServices?.map((service, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="font-semibold text-slate-500 block">Check-in Date:</span>
                        <span className="font-bold text-slate-800 mt-0.5 block">{result.createdDate}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500 block">Est. Completion:</span>
                        <span className="font-bold text-red-600 mt-0.5 block">
                          {result.expectedCompletionDate || 'Same-day completion'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Cost Estimate & Workshop Communication */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Cost Quotation & Workshop Contact
                  </h3>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Approved Estimate / Bill:</span>
                      <span className="text-lg font-black text-slate-900">
                        PKR {(result.finalCost || result.estimatedCost || 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Includes diagnostic testing, labour charges, and replacement 4T lubricants.
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/923251814548?text=${encodeURIComponent(
                        `Salam Hamza Autos, I am inquiring about my Job Card #${result.jobCardNumber} (${result.bikeBrand} ${result.bikeModel}). Please share the latest update.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat with Mechanic on WhatsApp
                    </a>

                    <a
                      href={`tel:${BUSINESS_INFO.phoneRaw}`}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Workshop: {BUSINESS_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Photos Before / After (if available) */}
              {((result.photosBefore && result.photosBefore.length > 0) || (result.photosAfter && result.photosAfter.length > 0)) && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Workshop Inspection Photography
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.photosBefore && result.photosBefore.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-slate-600 block mb-2">Check-in Condition:</span>
                        <img 
                          src={result.photosBefore[0]} 
                          alt="Motorcycle Before Repair" 
                          className="w-full h-48 object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                    )}
                    {result.photosAfter && result.photosAfter.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-slate-600 block mb-2">Completed Work:</span>
                        <img 
                          src={result.photosAfter[0]} 
                          alt="Motorcycle After Repair" 
                          className="w-full h-48 object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
              <h3 className="text-base font-bold text-rose-900">Record Not Found</h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto">
                {result?.error || 'Unable to locate this job card. Please check the job card number on your workshop receipt or contact Hamza Autos directly.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="px-4 py-2 bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Workshop
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* Workshop Location Helper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900">
            Picking up or dropping off your motorcycle?
          </h4>
          <p className="text-xs text-slate-600">
            {BUSINESS_INFO.fullAddress} · Open 9:00 AM – 9:00 PM (Monday – Sunday)
          </p>
        </div>
        <a
          href={BUSINESS_INFO.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Open Google Maps Directions
        </a>
      </div>
    </div>
  );
};
