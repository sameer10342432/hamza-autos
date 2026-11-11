import React, { useState } from 'react';
import { BUSINESS_INFO, SERVICES_LIST, AREAS_LIST, BRANDS_LIST, BLOG_POSTS } from '../data/businessData';
import { Shield, FileText, Code2, Copy, Check } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms' | 'sitemap';
}

export const LegalView: React.FC<LegalViewProps> = ({ type }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'sitemap'>(type);
  const [copied, setCopied] = useState(false);

  const xmlSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hamzaautos.pk/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://hamzaautos.pk/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://hamzaautos.pk/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${SERVICES_LIST.map(s => `  <url>
    <loc>https://hamzaautos.pk/services/${s.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n')}
${AREAS_LIST.map(a => `  <url>
    <loc>https://hamzaautos.pk/areas/${a.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${BRANDS_LIST.map(b => `  <url>
    <loc>https://hamzaautos.pk/brands/${b.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`).join('\n')}
${BLOG_POSTS.map(p => `  <url>
    <loc>https://hamzaautos.pk/blog/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
  <url>
    <loc>https://hamzaautos.pk/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  const robotsTxtContent = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://hamzaautos.pk/sitemap.xml`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'privacy' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'terms' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Terms &amp; Conditions
        </button>
        <button
          onClick={() => setActiveTab('sitemap')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'sitemap' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Technical SEO &amp; Sitemap
        </button>
      </div>

      {activeTab === 'privacy' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <h1 className="text-2xl font-bold text-slate-900">Privacy Policy for Hamza Autos</h1>
          <p className="text-slate-500">Last updated: November 2026</p>

          <p>
            At <strong>Hamza Autos</strong> (located on Abu Bakar Road, Badami Bagh, Lahore, Pakistan), we respect your privacy. This policy outlines how we handle customer contact inquiries, phone calls, and WhatsApp messages.
          </p>

          <h2 className="text-sm font-bold text-slate-900 pt-2">1. Information We Collect</h2>
          <p>
            When you contact us via our website form, phone, or WhatsApp, we collect only the information necessary to provide motorcycle repair and maintenance estimates: your name, contact phone number, general locality in Lahore, and your motorcycle brand, model, and mechanical symptoms.
          </p>

          <h2 className="text-sm font-bold text-slate-900 pt-2">2. How We Use Your Information</h2>
          <p>
            Your information is used solely to respond to your repair inquiries, confirm workshop slots, provide accurate price quotes, and coordinate parts availability. We never sell, rent, or share customer contact details with third-party advertisers.
          </p>

          <h2 className="text-sm font-bold text-slate-900 pt-2">3. Contact Us</h2>
          <p>
            For any questions regarding our privacy practices, please contact Hamza Autos at <strong>{BUSINESS_INFO.phone}</strong> or visit our workshop near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore.
          </p>
        </div>
      )}

      {activeTab === 'terms' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <h1 className="text-2xl font-bold text-slate-900">Terms and Conditions</h1>
          <p className="text-slate-500">Last updated: November 2026</p>

          <p>
            Welcome to the official business website of <strong>Hamza Autos</strong>. By accessing this website or booking motorcycle repair services at our Badami Bagh workshop, you agree to the following terms:
          </p>

          <h2 className="text-sm font-bold text-slate-900 pt-2">1. Repair Estimates &amp; Diagnosis</h2>
          <p>
            Estimated repair durations and costs provided via the website, WhatsApp, or phone are diagnostic approximations based on customer descriptions. Final pricing is confirmed after in-person physical inspection of your motorcycle at our workshop before repair commences.
          </p>

          <h2 className="text-sm font-bold text-slate-900 pt-2">2. Independent Workshop Operations</h2>
          <p>
            Hamza Autos is an independent local motorcycle repair shop located exclusively on Abu Bakar Road, Badami Bagh, Lahore. References to motorcycle brands (such as Honda, Yamaha, Suzuki, United) are used strictly to describe repair compatibility and do not claim authorized dealership status.
          </p>

          <h2 className="text-sm font-bold text-slate-900 pt-2">3. Parts &amp; Lubricant Quality</h2>
          <p>
            All replacement parts installed are verified OEM or quality aftermarket components selected with the customer's prior agreement.
          </p>
        </div>
      )}

      {activeTab === 'sitemap' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Technical SEO, XML Sitemap &amp; Robots.txt</h1>
            <p className="text-slate-500 mt-1">
              Production-ready search engine crawling setup for Google organic search and Google Maps indexing.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">XML Sitemap (/sitemap.xml)</span>
              <button
                onClick={() => copyToClipboard(xmlSitemapContent)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy XML'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-64">
              {xmlSitemapContent}
            </pre>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <span className="font-bold text-slate-900">Robots.txt (/robots.txt)</span>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed">
              {robotsTxtContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
