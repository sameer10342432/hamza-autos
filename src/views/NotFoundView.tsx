import React from 'react';
import { Wrench, Home, Phone, ArrowLeft, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

interface NotFoundViewProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
        <Wrench className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
          Error 404 · Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Oops! That Page Is Out of Service
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The link you followed may be broken or the motorcycle guide has moved. Use the quick links below to get back on track:
        </p>
      </div>

      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Return to Homepage
        </button>

        <button
          onClick={() => onNavigate('services')}
          className="px-5 py-2.5 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-red-600" />
          View All Repair Services
        </button>

        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-slate-500" />
          Find Badami Bagh Workshop
        </button>
      </div>

      <div className="pt-8 border-t border-slate-200 text-xs text-slate-500">
        Need immediate bike help? Call Hamza Autos workshop directly at{' '}
        <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="text-red-600 font-bold hover:underline">
          {BUSINESS_INFO.phone}
        </a>{' '}
        (Abu Bakar Road, Badami Bagh, Lahore).
      </div>
    </div>
  );
};
