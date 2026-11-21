/**
 * Hamza Autos - Admin Motorcycle Brands & Models Tab
 * Manage supported Pakistani bike models (Honda CD70, CG125, YBR, GD110, United, Road Prince)
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Bike, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { MotorcycleModelSpec, MotorcycleBrandName } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';

export const ShopBrandsModelsTab: React.FC = () => {
  const [models, setModels] = useState<MotorcycleModelSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [brand, setBrand] = useState<MotorcycleBrandName>('Honda');
  const [modelName, setModelName] = useState('');
  const [engineCc, setEngineCc] = useState('70cc');
  const [popularYears, setPopularYears] = useState('2000 - 2026');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await ShopService.getBrandsAndModels();
      setModels(data);
    } catch (err) {
      console.error('Error loading bike models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) return;

    try {
      setSaving(true);
      await ShopService.createAdminBrandModel({
        brand,
        modelName: modelName.trim(),
        engineCc: engineCc.trim(),
        popularYears: popularYears.trim(),
        isPopularInPakistan: true
      });
      setToast(`Added ${brand} ${modelName}.`);
      setTimeout(() => setToast(null), 3000);
      setModalOpen(false);
      setModelName('');
      await loadModels();
    } catch (err: any) {
      alert(err.message || 'Error creating model.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: MotorcycleModelSpec) => {
    if (!window.confirm(`Remove ${m.brand} ${m.modelName} from supported compatibility list?`)) return;

    try {
      await ShopService.deleteAdminBrandModel(m.id);
      setToast(`Removed ${m.brand} ${m.modelName}.`);
      setTimeout(() => setToast(null), 3000);
      await loadModels();
    } catch (err: any) {
      alert(err.message || 'Error deleting model.');
    }
  };

  const groupedByBrand: Record<string, MotorcycleModelSpec[]> = {};
  for (const m of models) {
    if (!groupedByBrand[m.brand]) groupedByBrand[m.brand] = [];
    groupedByBrand[m.brand].push(m);
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Motorcycle Brands &amp; Models Compatibility</h2>
          <p className="text-xs text-slate-500 mt-1">Configure supported Pakistani motorcycle models for accurate parts fitment filters</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Motorcycle Model</span>
        </button>
      </div>

      {/* Grouped Accordions / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(groupedByBrand).map(([brandName, brandModels]) => (
          <div key={brandName} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">{brandName}</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{brandModels.length} models</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {brandModels.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{m.modelName}</span>
                    <span className="text-slate-400 ml-2">({m.engineCc})</span>
                    {m.popularYears && (
                      <span className="block text-[10px] text-slate-400">Years: {m.popularYears}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(m)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                    title="Remove Model"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900">Add Motorcycle Model</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="Honda">Honda</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="United">United</option>
                  <option value="Road Prince">Road Prince</option>
                  <option value="Super Power">Super Power</option>
                  <option value="Hi-Speed">Hi-Speed</option>
                  <option value="Crown">Crown</option>
                  <option value="Other Chinese Motorcycle Brands">Other Chinese Motorcycle Brands</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. CD 70, CG 125, YBR 125, GD 110"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Engine CC</label>
                  <input
                    type="text"
                    value={engineCc}
                    onChange={(e) => setEngineCc(e.target.value)}
                    placeholder="70cc"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Production Years</label>
                  <input
                    type="text"
                    value={popularYears}
                    onChange={(e) => setPopularYears(e.target.value)}
                    placeholder="2010 - 2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Adding...' : 'Add Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
