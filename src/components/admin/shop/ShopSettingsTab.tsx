/**
 * Hamza Autos - Admin Shop Settings Tab
 * Configure store branding, WhatsApp number, bank account details, and consumer policies
 */

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, RefreshCw, Building2, Store } from 'lucide-react';
import { ShopSettings } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';

export const ShopSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await ShopService.getShopSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error loading shop settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      await ShopService.updateAdminSettings(settings);
      setToast('Shop settings updated successfully.');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-slate-400">Loading shop settings...</div>
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
          <h2 className="text-xl font-extrabold text-slate-900">Online Store Settings &amp; Policies</h2>
          <p className="text-xs text-slate-500 mt-1">Configure store title, WhatsApp contacts, bank details, and customer return policies</p>
        </div>
        <button
          onClick={loadSettings}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Store Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Store Identity &amp; Support Contacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.shopName}
                onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Support WhatsApp (without + e.g. 923251814548)</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Bank & Payment Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Customer Bank Transfer &amp; Wallet Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bankDetails.bankName}
                onChange={(e) => setSettings({
                  ...settings,
                  bankDetails: { ...settings.bankDetails, bankName: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Title</label>
              <input
                type="text"
                value={settings.bankDetails.accountTitle}
                onChange={(e) => setSettings({
                  ...settings,
                  bankDetails: { ...settings.bankDetails, accountTitle: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={settings.bankDetails.accountNumber}
                onChange={(e) => setSettings({
                  ...settings,
                  bankDetails: { ...settings.bankDetails, accountNumber: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">IBAN Number</label>
              <input
                type="text"
                value={settings.bankDetails.iban}
                onChange={(e) => setSettings({
                  ...settings,
                  bankDetails: { ...settings.bankDetails, iban: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Easypaisa Number &amp; Title</label>
              <input
                type="text"
                value={settings.bankDetails.easypaisaNumber || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  bankDetails: { ...settings.bankDetails, easypaisaNumber: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Jazzcash Number &amp; Title</label>
              <input
                type="text"
                value={settings.bankDetails.jazzcashNumber || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  bankDetails: { ...settings.bankDetails, jazzcashNumber: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Customer Policies */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Return, Inspection &amp; Shipping Policies
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Inspection &amp; Return Policy Text</label>
              <textarea
                rows={2}
                value={settings.returnPolicy}
                onChange={(e) => setSettings({ ...settings, returnPolicy: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Shipping &amp; Dispatch Commitment Text</label>
              <textarea
                rows={2}
                value={settings.shippingPolicy}
                onChange={(e) => setSettings({ ...settings, shippingPolicy: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Shop Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
