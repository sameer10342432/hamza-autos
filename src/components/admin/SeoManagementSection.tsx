import React, { useState, useEffect } from 'react';
import { Globe, Save, Search, CheckCircle, ExternalLink, Sparkles, AlertTriangle } from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export interface SeoPageSetting {
  route: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
}

export const SeoManagementSection: React.FC = () => {
  const [pages, setPages] = useState<SeoPageSetting[]>([
    {
      route: '/',
      pageName: 'Homepage',
      metaTitle: 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop Badami Bagh Lahore',
      metaDescription: 'Trusted motorcycle mechanic & repair workshop in Badami Bagh, Lahore. Engine overhaul, tuning, electrical wiring, brakes & maintenance for Honda, Yamaha, Suzuki. Call +92 325 1814548.',
      keywords: ['bike mechanic lahore', 'motorcycle repair badami bagh', 'honda 70 tuning', 'engine overhaul lahore'],
      canonicalUrl: 'https://hamzaautos.com.pk/'
    },
    {
      route: '/services',
      pageName: 'Services Page',
      metaTitle: 'Motorcycle Repair & Maintenance Services | Hamza Autos Lahore',
      metaDescription: 'Comprehensive bike repair services in Badami Bagh: engine overhaul, carburetor tuning, oil change, brake inspection, electrical repair & genuine Japanese spare parts.',
      keywords: ['bike repair services', 'motorcycle oil change lahore', 'engine tuning badami bagh'],
      canonicalUrl: 'https://hamzaautos.com.pk/services'
    },
    {
      route: '/contact',
      pageName: 'Contact & Location',
      metaTitle: 'Contact Hamza Autos – Workshop Location & Phone | Badami Bagh Lahore',
      metaDescription: 'Visit Hamza Autos on Abu Bakar Road, Badami Bagh, Lahore. Call +92 325 1814548 or chat on WhatsApp for urgent breakdown help and booking appointments.',
      keywords: ['bike mechanic phone number lahore', 'hamza autos location', 'badami bagh bike workshop'],
      canonicalUrl: 'https://hamzaautos.com.pk/contact'
    },
    {
      route: '/blog',
      pageName: 'Motorcycle Care Blog',
      metaTitle: 'Motorcycle Care & Maintenance Blog | Hamza Autos Badami Bagh',
      metaDescription: 'Expert maintenance advice, troubleshooting common bike problems in Pakistan, fuel economy tips, and technical engine care guides by Master Mechanic Hamza.',
      keywords: ['motorcycle maintenance tips pakistan', 'bike fuel average guide', 'honda 125 engine problems'],
      canonicalUrl: 'https://hamzaautos.com.pk/blog'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchSeo = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getSeoSettings();
      if (res.success && res.pages && res.pages.length > 0) {
        setPages(res.pages);
      }
    } catch (e) {
      console.warn('Seo load:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const handleSave = async () => {
    try {
      const res = await AdminApiService.saveSeoSettings({
        pages,
        general: {
          siteName: 'Hamza Autos',
          phone: '+92 325 1814548',
          locality: 'Badami Bagh, Lahore'
        }
      });
      if (res.success) {
        setNotice('SEO meta tags saved successfully to storage/seo-settings.json.');
        setTimeout(() => setNotice(null), 3000);
      }
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    }
  };

  const activePage = pages[selectedIndex] || pages[0];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Search Engine Optimization (SEO) Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure meta titles, descriptions, canonical URLs, and OpenGraph search snippets for every page route.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow"
        >
          <Save className="w-4 h-4" />
          Save SEO Config
        </button>
      </div>

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Page Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Pages & Routes</span>
          {pages.map((p, idx) => (
            <button
              key={p.route}
              onClick={() => setSelectedIndex(idx)}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all flex flex-col ${
                selectedIndex === idx 
                  ? 'bg-red-600 text-white font-semibold shadow' 
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{p.pageName}</span>
              <span className={`text-[10px] font-mono mt-0.5 ${selectedIndex === idx ? 'text-red-200' : 'text-slate-500'}`}>
                {p.route}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Active Page SEO Editor */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              SEO Settings for {activePage.pageName} ({activePage.route})
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Page Meta Title Tag (60 chars recommended)</span>
                <span className={`text-[10px] ${activePage.metaTitle.length > 65 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {activePage.metaTitle.length} chars
                </span>
              </label>
              <input
                type="text"
                value={activePage.metaTitle}
                onChange={(e) => {
                  const copy = [...pages];
                  copy[selectedIndex].metaTitle = e.target.value;
                  setPages(copy);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Page Meta Description (155-160 chars recommended)</span>
                <span className={`text-[10px] ${activePage.metaDescription.length > 165 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {activePage.metaDescription.length} chars
                </span>
              </label>
              <textarea
                rows={3}
                value={activePage.metaDescription}
                onChange={(e) => {
                  const copy = [...pages];
                  copy[selectedIndex].metaDescription = e.target.value;
                  setPages(copy);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={activePage.canonicalUrl || ''}
                  onChange={(e) => {
                    const copy = [...pages];
                    copy[selectedIndex].canonicalUrl = e.target.value;
                    setPages(copy);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={(activePage.keywords || []).join(', ')}
                  onChange={(e) => {
                    const copy = [...pages];
                    copy[selectedIndex].keywords = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setPages(copy);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Google Search Live Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Google Search Appearance Preview
              </span>
              <div className="text-[11px] text-emerald-400 truncate">
                {activePage.canonicalUrl || `https://hamzaautos.com.pk${activePage.route}`}
              </div>
              <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                {activePage.metaTitle}
              </div>
              <div className="text-xs text-slate-400 line-clamp-2">
                {activePage.metaDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
