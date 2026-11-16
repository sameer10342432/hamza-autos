import React, { useState, useEffect } from 'react';
import { Settings, Lock, Shield, Phone, MapPin, Clock, Save, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export const AdminSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    businessName: 'Hamza Autos',
    tagline: 'Bike Mechanic & Motorcycle Repair Shop',
    phone: '+92 325 1814548',
    whatsappNumber: '+92 325 1814548',
    address: 'Abu Bakar Road, Near Ali Hajvery Marriage Hall, Badami Bagh, Lahore, Punjab 54000',
    operatingHours: '9:00 AM – 9:00 PM (Monday to Sunday)',
    adminUsername: 'admin',
    adminDisplayName: 'Master Mechanic Hamza',
    sessionTimeoutHours: 24,
    autoBackupDays: 7
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    AdminApiService.getSettings().then(res => {
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSaveGeneral = async () => {
    try {
      const res = await AdminApiService.saveSettings(settings);
      if (res.success) {
        showSuccess('Business profile and admin preferences saved successfully.');
      }
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('New password and confirmation do not match.');
      return;
    }

    try {
      const res = await AdminApiService.updateProfile({
        username: settings.adminUsername,
        displayName: settings.adminDisplayName,
        currentPassword,
        newPassword
      });
      if (res.success) {
        showSuccess('Admin password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showError(res.message || 'Password update failed.');
      }
    } catch (err: any) {
      showError(err.message);
    }
  };

  const showSuccess = (msg: string) => {
    setNotice(msg);
    setErrorNotice(null);
    setTimeout(() => setNotice(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorNotice(msg);
    setNotice(null);
    setTimeout(() => setErrorNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-500" />
          Admin System & Security Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage core workshop contact information, admin credentials, PBKDF2 authentication, and security preferences.
        </p>
      </div>

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {notice}
        </div>
      )}

      {errorNotice && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorNotice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-red-500" />
            Verified Workshop Profile
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
              <input
                type="text"
                value={settings.businessName || ''}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Address</label>
              <textarea
                rows={2}
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Hours</label>
              <input
                type="text"
                value={settings.operatingHours || ''}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              onClick={handleSaveGeneral}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition-colors mt-2"
            >
              <Save className="w-4 h-4" />
              Save Workshop Details
            </button>
          </div>
        </div>

        {/* Admin Credentials & Security */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <KeyRound className="w-4 h-4 text-amber-500" />
            Admin Credentials & Password
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Username</label>
              <input
                type="text"
                value={settings.adminUsername || 'admin'}
                onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={settings.adminDisplayName || 'Master Mechanic Hamza'}
                onChange={(e) => setSettings({ ...settings, adminDisplayName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required to change password"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Security Specifications:
              </span>
              <p>• PBKDF2 with SHA-512 and salt encryption</p>
              <p>• Rate limited to 5 failed attempts per 15 minutes</p>
              <p>• Cryptographic token authentication stored in <code>storage/admin-settings.json</code></p>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              <Lock className="w-4 h-4" />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
