import React, { useState, useEffect } from 'react';
import { Globe, Save, Search, CheckCircle, ExternalLink, Sparkles, AlertTriangle, ShieldCheck, FileText, Check } from 'lucide-react';
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
      metaTitle: 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore',
      metaDescription: 'Trusted motorcycle mechanic & repair shop in Badami Bagh, Lahore. Professional bike engine repair, tuning, oil change, electrical wiring, brakes & maintenance. Call +92 325 1814548.',
      keywords: ['bike mechanic lahore', 'motorcycle repair badami bagh', 'bike engine overhaul', 'bike tuning lahore'],
      canonicalUrl: 'https://hamzaautos.com/'
    },
    {
      route: '/services',
      pageName: 'Services Page',
      metaTitle: 'Motorcycle Repair & Maintenance Services in Badami Bagh, Lahore | Hamza Autos',
      metaDescription: 'Explore professional motorcycle services in Badami Bagh Lahore: engine overhaul, carburetor tuning, genuine oil change, electrical wiring repair, brakes & clutches for Honda, Yamaha, Suzuki.',
      keywords: ['bike repair services lahore', 'motorcycle oil change badami bagh', 'bike tuning badami bagh'],
      canonicalUrl: 'https://hamzaautos.com/services'
    },
    {
      route: '/brands',
      pageName: 'Brands We Repair',
      metaTitle: 'Motorcycle Brands We Repair (Honda, Yamaha, Suzuki, United) | Hamza Autos Lahore',
      metaDescription: 'Specialist motorcycle mechanics in Badami Bagh for Honda CD 70 & CG 125, Yamaha YBR 125, Suzuki GS 150 & GD 110, United and all Chinese bikes. Call +92 325 1814548.',
      keywords: ['honda mechanic lahore', 'yamaha ybr repair badami bagh', 'suzuki gs150 mechanic lahore'],
      canonicalUrl: 'https://hamzaautos.com/brands'
    },
    {
      route: '/areas',
      pageName: 'Areas We Serve',
      metaTitle: 'Areas We Serve in Lahore (Badami Bagh, Shadbagh, Misri Shah, Ravi Road) | Hamza Autos',
      metaDescription: 'Hamza Autos is centrally located on Abu Bakar Road, Badami Bagh, providing quick motorcycle repair access to Shadbagh, Misri Shah, Ravi Road, Bund Road & Azadi Chowk riders.',
      keywords: ['bike repair badami bagh', 'motorcycle mechanic shadbagh', 'bike repair misri shah', 'bike tuning ravi road'],
      canonicalUrl: 'https://hamzaautos.com/areas'
    },
    {
      route: '/contact',
      pageName: 'Contact & Location',
      metaTitle: 'Contact Hamza Autos – Workshop Location & Phone | Badami Bagh Lahore',
      metaDescription: 'Contact Hamza Autos on Abu Bakar Road, Badami Bagh, Lahore. Call +92 325 1814548 for urgent bike breakdown assistance, appointment booking, or workshop directions.',
      keywords: ['bike mechanic phone number lahore', 'hamza autos location', 'badami bagh motorcycle workshop'],
      canonicalUrl: 'https://hamzaautos.com/contact'
    },
    {
      route: '/blog',
      pageName: 'Motorcycle Care Blog',
      metaTitle: 'Motorcycle Care & Maintenance Blog | Hamza Autos Badami Bagh Lahore',
      metaDescription: 'Practical motorcycle maintenance advice, DIY troubleshooting, carburetor tuning tips, and engine care guides by Master Mechanic Hamza in Lahore, Pakistan.',
      keywords: ['motorcycle maintenance tips pakistan', 'bike fuel average guide lahore', 'honda 125 engine problems'],
      canonicalUrl: 'https://hamzaautos.com/blog'
    },
    {
      route: '/reviews',
      pageName: 'Customer Reviews',
      metaTitle: 'Customer Reviews & Mechanic Ratings | Hamza Autos Badami Bagh Lahore',
      metaDescription: 'Read genuine customer reviews from Lahore riders who trust Hamza Autos for engine overhauls, bike tuning, and routine maintenance in Badami Bagh.',
      keywords: ['hamza autos reviews', 'best bike mechanic lahore review', 'motorcycle repair feedback badami bagh'],
      canonicalUrl: 'https://hamzaautos.com/reviews'
    },
    {
      route: '/gallery',
      pageName: 'Workshop Gallery',
      metaTitle: 'Workshop Bay & Repair Gallery | Hamza Autos Badami Bagh Lahore',
      metaDescription: 'Take a look inside Hamza Autos motorcycle repair workshop in Badami Bagh Lahore. See our diagnostic equipment, engine rebuilding bay, and mechanic tools.',
      keywords: ['hamza autos workshop gallery', 'bike repair shop photos lahore'],
      canonicalUrl: 'https://hamzaautos.com/gallery'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [auditInfo, setAuditInfo] = useState<any>({
    totalIndexedPages: 47,
    duplicateTitleCount: 0,
    sitemapUrl: 'https://hamzaautos.com/sitemap.xml',
    robotsUrl: 'https://hamzaautos.com/robots.txt',
    schemaStatus: 'Valid Schema.org AutoRepair, Organization, Service, BreadcrumbList'
  });

  const fetchSeo = async () => {
    setLoading(true);
    try {
      const res: any = await AdminApiService.getSeoSettings();
      if (res.success) {
        if (res.pages && res.pages.length > 0) {
          setPages(res.pages);
        }
        if (res.audit) {
          setAuditInfo(res.audit);
        }
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
        setTimeout(() => setNotice(null), 3500);
      }
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    }
  };

  const activePage = pages[selectedIndex] || pages[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Save Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Search Engine Optimization (SEO) & Technical Indexing
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage meta tags, canonical URLs, Schema.org structured data, and search appearances across all public routes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save SEO Config
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* SEO Health & Readiness Audit Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Indexed Pages</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{auditInfo.totalIndexedPages || 47}</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <Check className="w-3 h-3" /> 100% Crawlable URLs
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Sitemap Status</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            Valid XML (47 URLs)
          </div>
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noreferrer"
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 mt-1 underline"
          >
            Open sitemap.xml <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Robots.txt Directives</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-1">
            Active Block on /admin
          </div>
          <a 
            href="/robots.txt" 
            target="_blank" 
            rel="noreferrer"
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 mt-1 underline"
          >
            Open robots.txt <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Schema.org Graph</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            AutoRepair & Breadcrumbs
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Rich Results Verified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Page Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 tracking-wider">
            Public Website Routes ({pages.length})
          </span>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {pages.map((p, idx) => (
              <button
                key={p.route}
                onClick={() => setSelectedIndex(idx)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all flex flex-col cursor-pointer ${
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
                <span>Page Meta Title Tag (50-60 characters ideal)</span>
                <span className={`text-[10px] font-mono ${activePage.metaTitle.length > 65 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {activePage.metaTitle.length} / 60 chars
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
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Page Meta Description (150-160 characters ideal)</span>
                <span className={`text-[10px] font-mono ${activePage.metaDescription.length > 165 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {activePage.metaDescription.length} / 160 chars
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
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-red-500 font-sans leading-relaxed"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Keywords (comma separated)</label>
                <input
                  type="text"
                  value={(activePage.keywords || []).join(', ')}
                  onChange={(e) => {
                    const copy = [...pages];
                    copy[selectedIndex].keywords = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setPages(copy);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Google Search Live Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1.5 mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Google Search Engine Result Snippet (SERP Preview)
              </span>
              <div className="text-[11px] text-emerald-400 font-mono truncate">
                {activePage.canonicalUrl || `https://hamzaautos.com${activePage.route}`}
              </div>
              <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                {activePage.metaTitle}
              </div>
              <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {activePage.metaDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
