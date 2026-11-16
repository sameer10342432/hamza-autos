import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Wrench, 
  MapPin, 
  HelpCircle, 
  Star, 
  ShieldCheck, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  X,
  Compass
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

interface WebsiteContentCmsSectionProps {
  sectionType: 'hero' | 'services' | 'brands' | 'areas' | 'faqs' | 'testimonials';
}

export const WebsiteContentCmsSection: React.FC<WebsiteContentCmsSectionProps> = ({ sectionType }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchSectionData = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getContent(sectionType);
      if (res.success) {
        setData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, [sectionType]);

  const handleSave = async (updatedData: any) => {
    try {
      const res = await AdminApiService.saveContent(sectionType, updatedData);
      if (res.success) {
        setData(res.data);
        setNotice('Changes saved to central JSON storage!');
        setTimeout(() => setNotice(null), 3000);
      }
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading {sectionType} content...</div>;
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Render Sub-View based on sectionType */}
      {sectionType === 'hero' && (
        <HeroEditor data={data} onSave={handleSave} />
      )}
      {sectionType === 'services' && (
        <ServicesEditor data={data} onSave={handleSave} />
      )}
      {sectionType === 'brands' && (
        <BrandsEditor data={data} onSave={handleSave} />
      )}
      {sectionType === 'areas' && (
        <AreasEditor data={data} onSave={handleSave} />
      )}
      {sectionType === 'faqs' && (
        <FaqsEditor data={data} onSave={handleSave} />
      )}
      {sectionType === 'testimonials' && (
        <TestimonialsEditor data={data} onSave={handleSave} />
      )}
    </div>
  );
};

// =========================================================================
// 1. HERO CONTENT EDITOR
// =========================================================================
const HeroEditor: React.FC<{ data: any; onSave: (d: any) => void }> = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {
    badge: 'Certified Master Bike Mechanic in Badami Bagh',
    headline: 'Reliable Motorcycle Repair & Performance Tuning in Lahore',
    subheadline: 'Expert engine overhaul, genuine Japanese parts, precise carburetor tuning, and guaranteed maintenance for Honda, Yamaha, Suzuki, and United motorbikes.',
    emergencyCallText: 'Urgent Breakdown Support: +92 325 1814548',
    stats: [
      { label: 'Happy Bikers', value: '15,000+' },
      { label: 'Years Experience', value: '18+' },
      { label: 'Warranty Guaranteed', value: '100%' }
    ]
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-red-500" />
            Homepage Hero Content
          </h3>
          <p className="text-xs text-slate-400 mt-1">Manage main headline, subtext, badges, and workshop statistics.</p>
        </div>
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow"
        >
          <Save className="w-4 h-4" />
          Save Hero
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Text</label>
          <input
            type="text"
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Headline</label>
          <input
            type="text"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Subheadline Description</label>
          <textarea
            rows={3}
            value={form.subheadline}
            onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Call Text</label>
          <input
            type="text"
            value={form.emergencyCallText}
            onChange={(e) => setForm({ ...form, emergencyCallText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. SERVICES EDITOR
// =========================================================================
const ServicesEditor: React.FC<{ data: any; onSave: (d: any) => void }> = ({ data, onSave }) => {
  const [services, setServices] = useState<any[]>(Array.isArray(data) ? data : []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setServices([
      ...services,
      {
        id: `srv-${Date.now()}`,
        title: 'New Service',
        description: 'Professional service description...',
        priceStartingFrom: 'Rs. 500',
        duration: '1-2 Hours',
        popular: false
      }
    ]);
  };

  const handleRemove = (idx: number) => {
    if (!window.confirm('Delete this service?')) return;
    const updated = services.filter((_, i) => i !== idx);
    setServices(updated);
    onSave(updated);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-500" />
            Services Management ({services.length})
          </h3>
          <p className="text-xs text-slate-400 mt-1">Manage workshop service catalog, estimated pricing, and descriptions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
          <button
            onClick={() => onSave(services)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save Services
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv, idx) => (
          <div key={srv.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={srv.title}
                onChange={(e) => {
                  const copy = [...services];
                  copy[idx].title = e.target.value;
                  setServices(copy);
                }}
                className="bg-transparent text-sm font-bold text-white border-b border-slate-700 focus:border-red-500 pb-1"
              />
              <button
                onClick={() => handleRemove(idx)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <textarea
              rows={2}
              value={srv.description}
              onChange={(e) => {
                const copy = [...services];
                copy[idx].description = e.target.value;
                setServices(copy);
              }}
              placeholder="Description..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
            />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 block">Starting Price</label>
                <input
                  type="text"
                  value={srv.priceStartingFrom || ''}
                  onChange={(e) => {
                    const copy = [...services];
                    copy[idx].priceStartingFrom = e.target.value;
                    setServices(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">Duration</label>
                <input
                  type="text"
                  value={srv.duration || ''}
                  onChange={(e) => {
                    const copy = [...services];
                    copy[idx].duration = e.target.value;
                    setServices(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// 3. MOTORCYCLE BRANDS EDITOR
// =========================================================================
const BrandsEditor: React.FC<{ data: any; onSave: (d: any) => void }> = ({ data, onSave }) => {
  const [brands, setBrands] = useState<any[]>(Array.isArray(data) ? data : [
    { name: 'Honda', models: 'CD 70, CG 125, CB 150F, Pridor', specialty: 'OEM Tuning & Engine Overhauls' },
    { name: 'Yamaha', models: 'YBR 125, YB 125Z, YBR 125G', specialty: 'Fuel Injection, Electrical & Disc Brakes' },
    { name: 'Suzuki', models: 'GD 110S, GS 150, GR 150', specialty: 'Performance Tuning & Carburetor Sync' },
    { name: 'United', models: 'US 70, US 100, US 125', specialty: 'Budget Overhaul & Routine Maintenance' },
    { name: 'Road Prince', models: 'RP 70, RP 110, Robinson 150', specialty: 'Suspension, Brakes & Wiring Repairs' }
  ]);

  const handleAdd = () => {
    setBrands([...brands, { name: 'Brand Name', models: 'Models...', specialty: 'Repair Specialty' }]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            Motorcycle Brands Supported
          </h3>
          <p className="text-xs text-slate-400 mt-1">Configure motorcycle brands, models, and workshop specialties displayed on the website.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAdd} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
          <button onClick={() => onSave(brands)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            Save Brands
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {brands.map((b, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={b.name}
                  onChange={(e) => {
                    const copy = [...brands];
                    copy[idx].name = e.target.value;
                    setBrands(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Supported Models</label>
                <input
                  type="text"
                  value={b.models}
                  onChange={(e) => {
                    const copy = [...brands];
                    copy[idx].models = e.target.value;
                    setBrands(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Specialty</label>
                <input
                  type="text"
                  value={b.specialty}
                  onChange={(e) => {
                    const copy = [...brands];
                    copy[idx].specialty = e.target.value;
                    setBrands(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300"
                />
              </div>
            </div>
            <button
              onClick={() => setBrands(brands.filter((_, i) => i !== idx))}
              className="text-red-400 hover:text-red-300 p-1.5 self-end sm:self-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// 4. AREAS WE SERVE EDITOR
// =========================================================================
const AreasEditor: React.FC<{ data: any; onSave: (d: any) => void }> = ({ data, onSave }) => {
  const [areas, setAreas] = useState<any[]>(Array.isArray(data) ? data : [
    { name: 'Badami Bagh', distance: '0 km (Workshop Hub)', time: 'Immediate Walk-in', desc: 'Central workshop located on Abu Bakar Road.' },
    { name: 'Shadbagh', distance: '1.5 km', time: '5-10 Minutes', desc: 'Fast turnaround for Shadbagh riders.' },
    { name: 'Misri Shah', distance: '2.0 km', time: '8-12 Minutes', desc: 'Complete motorcycle repair and servicing.' },
    { name: 'Ravi Road', distance: '2.5 km', time: '10-15 Minutes', desc: 'Emergency repair and roadside assistance.' },
    { name: 'Azadi Chowk & Minar-e-Pakistan', distance: '3.0 km', time: '12-15 Minutes', desc: 'Convenient access via main road.' },
    { name: 'Timber Market', distance: '1.8 km', time: '7-10 Minutes', desc: 'Rapid express tuning and oil changes.' },
    { name: 'Bund Road', distance: '3.5 km', time: '15 Minutes', desc: 'Major engine overhaul and parts replacement.' }
  ]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-red-500" />
            Areas We Serve (Lahore Localities)
          </h3>
          <p className="text-xs text-slate-400 mt-1">Manage target service localities, travel times, and local SEO descriptions.</p>
        </div>
        <button onClick={() => onSave(areas)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          Save Areas
        </button>
      </div>

      <div className="space-y-3">
        {areas.map((a, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Locality Name</label>
                <input
                  type="text"
                  value={a.name}
                  onChange={(e) => {
                    const copy = [...areas];
                    copy[idx].name = e.target.value;
                    setAreas(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Distance & Travel</label>
                <input
                  type="text"
                  value={a.distance || a.time}
                  onChange={(e) => {
                    const copy = [...areas];
                    copy[idx].distance = e.target.value;
                    setAreas(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">SEO Description</label>
                <input
                  type="text"
                  value={a.desc || ''}
                  onChange={(e) => {
                    const copy = [...areas];
                    copy[idx].desc = e.target.value;
                    setAreas(copy);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// 5. FAQ MANAGEMENT EDITOR
// =========================================================================
const FaqsEditor: React.FC<{ data: any; onSave: (d: any) => void }> = ({ data, onSave }) => {
  const [faqs, setFaqs] = useState<any[]>(Array.isArray(data) ? data : []);

  const handleAdd = () => {
    setFaqs([...faqs, { question: 'Frequently Asked Question?', answer: 'Clear informative answer...', category: 'General' }]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-red-500" />
            FAQ Management ({faqs.length})
          </h3>
          <p className="text-xs text-slate-400 mt-1">Frequently asked questions that power website accordion sections and rich Google snippets.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAdd} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add Question
          </button>
          <button onClick={() => onSave(faqs)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            Save FAQs
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => {
                  const copy = [...faqs];
                  copy[idx].question = e.target.value;
                  setFaqs(copy);
                }}
                className="w-full bg-transparent font-bold text-sm text-white border-b border-slate-800 focus:border-red-500 pb-1 mr-4"
              />
              <button
                onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={2}
              value={faq.answer}
              onChange={(e) => {
                const copy = [...faqs];
                copy[idx].answer = e.target.value;
                setFaqs(copy);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// 6. TESTIMONIALS EDITOR
// =========================================================================
const TestimonialsEditor: React.FC<{ data: any; onSave: (d: any) => void }> = ({ data, onSave }) => {
  const [testimonials, setTestimonials] = useState<any[]>(Array.isArray(data) ? data : []);

  const handleAdd = () => {
    setTestimonials([...testimonials, {
      authorName: 'Customer Name',
      bikeModel: 'Honda CD 70',
      rating: 5,
      comment: 'Top quality repair in Badami Bagh...'
    }]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Homepage Testimonials ({testimonials.length})
          </h3>
          <p className="text-xs text-slate-400 mt-1">Featured reviews displayed across homepage carousels and trust badges.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAdd} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
          <button onClick={() => onSave(testimonials)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            Save Testimonials
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={t.authorName}
                onChange={(e) => {
                  const copy = [...testimonials];
                  copy[idx].authorName = e.target.value;
                  setTestimonials(copy);
                }}
                className="bg-transparent font-bold text-sm text-white border-b border-slate-800 pb-1"
              />
              <button
                onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={t.bikeModel || ''}
                onChange={(e) => {
                  const copy = [...testimonials];
                  copy[idx].bikeModel = e.target.value;
                  setTestimonials(copy);
                }}
                placeholder="Bike Model..."
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300"
              />
              <input
                type="number"
                min="1"
                max="5"
                value={t.rating || 5}
                onChange={(e) => {
                  const copy = [...testimonials];
                  copy[idx].rating = Number(e.target.value);
                  setTestimonials(copy);
                }}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300"
              />
            </div>

            <textarea
              rows={2}
              value={t.comment}
              onChange={(e) => {
                const copy = [...testimonials];
                copy[idx].comment = e.target.value;
                setTestimonials(copy);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
