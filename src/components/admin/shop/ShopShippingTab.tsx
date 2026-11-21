/**
 * Hamza Autos - Admin Shop Shipping & Delivery Configuration Tab
 * Configure shipping rates by city/province, free shipping threshold, and courier partners
 */

import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Save, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { ShopShippingSettings, CourierPartner, PakistaniProvince } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';
import { PAKISTAN_PROVINCES } from '../../../data/pakistanLocations';

export const ShopShippingTab: React.FC = () => {
  const [shipping, setShipping] = useState<ShopShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadShipping = async () => {
    try {
      setLoading(true);
      const data = await ShopService.getShippingSettings();
      setShipping(data);
    } catch (err) {
      console.error('Error loading shipping settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipping();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping) return;

    try {
      setSaving(true);
      await ShopService.updateAdminShipping(shipping);
      setToast('Shipping settings saved successfully.');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating shipping settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !shipping) {
    return (
      <div className="p-8 text-center text-slate-400">Loading shipping configuration...</div>
    );
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
          <h2 className="text-xl font-extrabold text-slate-900">Pakistan-Wide Delivery &amp; Shipping Policy</h2>
          <p className="text-xs text-slate-500 mt-1">Configure courier partners, free shipping limits, and city tariffs</p>
        </div>
        <button
          onClick={loadShipping}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Rates Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Standard Delivery Fees &amp; Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Pakistan Shipping Fee (PKR)</label>
              <input
                type="number"
                value={shipping.defaultShippingFee}
                onChange={(e) => setShipping({ ...shipping, defaultShippingFee: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Applied to standard intercity parcel dispatches</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Free Delivery Order Threshold (PKR)</label>
              <input
                type="number"
                value={shipping.freeShippingThreshold}
                onChange={(e) => setShipping({ ...shipping, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-emerald-700"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Orders above this value get FREE shipping</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lahore Same-Day Express Rate (PKR)</label>
              <input
                type="number"
                value={shipping.lahoreExpressDeliveryFee}
                onChange={(e) => setShipping({ ...shipping, lahoreExpressDeliveryFee: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Local Badami Bagh / Lahore rider dispatch</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Transit Time Label Displayed to Customers</label>
            <input
              type="text"
              value={shipping.estimatedDeliveryText}
              onChange={(e) => setShipping({ ...shipping, estimatedDeliveryText: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>
        </div>

        {/* Courier Partners */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Active Courier Partners
          </h3>
          <p className="text-slate-500 text-xs">
            These services appear in the courier dropdown when dispatching parcels to customers across Pakistan:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
            {[
              'TCS Courier',
              'Leopards Courier',
              'M&P Express',
              'Trax Logistics',
              'PostEx',
              'Call Courier',
              'Hamza Autos Express (Lahore)'
            ].map((partner) => {
              const isEnabled = shipping.courierPartners.includes(partner as CourierPartner);
              return (
                <label key={partner} className="flex items-center gap-2 p-2 bg-slate-50 border rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setShipping({ ...shipping, courierPartners: [...shipping.courierPartners, partner as CourierPartner] });
                      } else {
                        setShipping({ ...shipping, courierPartners: shipping.courierPartners.filter(p => p !== partner) });
                      }
                    }}
                    className="rounded text-red-600"
                  />
                  <span className="font-medium text-slate-800">{partner}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Shipping Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
