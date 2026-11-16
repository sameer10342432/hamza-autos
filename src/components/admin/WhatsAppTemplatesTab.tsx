import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Phone,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { whatsappService } from '../../services';
import { WhatsAppTemplate } from '../../types';
import { BUSINESS_INFO } from '../../data/businessData';

interface WhatsAppTemplatesTabProps {
  onNotify?: (msg: string) => void;
}

export const WhatsAppTemplatesTab: React.FC<WhatsAppTemplatesTabProps> = ({ onNotify }) => {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [editedBody, setEditedBody] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      const all = await whatsappService.getAllTemplates();
      setTemplates(all);
      if (all.length > 0 && !selectedTemplate) {
        setSelectedTemplate(all[0]);
        setEditedBody(all[0].body);
      }
    } catch (err) {
      console.error('Failed to load WhatsApp templates', err);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSelect = (tmpl: WhatsAppTemplate) => {
    setSelectedTemplate(tmpl);
    setEditedBody(tmpl.body);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    try {
      await whatsappService.saveTemplate({
        ...selectedTemplate,
        body: editedBody
      });
      await loadTemplates();
      onNotify?.(`WhatsApp template "${selectedTemplate.name}" updated successfully.`);
    } catch (err) {
      console.error('Failed to save template', err);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all 7 WhatsApp message templates to workshop defaults?')) {
      await whatsappService.resetToDefaults();
      await loadTemplates();
      onNotify?.('All WhatsApp templates reset to official Hamza Autos defaults.');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Feature 4: WhatsApp Automation
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
              Official: +92 325 1814548
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-1">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Contextual WhatsApp Enquiry &amp; Notification Templates</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure pre-filled WhatsApp click-to-chat message blueprints for bookings, repair updates, quotes, and delivery notices.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Compliance Disclaimer Banner */}
      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Compliant Click-to-Chat Architecture:</span>
          <p className="text-emerald-800 leading-relaxed">
            In compliance with Pakistani telecommunication guidelines and privacy principles, Hamza Autos uses client-side click-to-chat links (<code className="font-mono bg-emerald-100 px-1 rounded">https://wa.me/923251814548?text=...</code>). No unsolicited bulk WhatsApp messages are dispatched autonomously; every link is explicitly triggered and reviewed by the mechanic or rider.
          </p>
        </div>
      </div>

      {/* Main Grid: Template List & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Template List */}
        <div className="lg:col-span-5 space-y-2.5">
          {templates.map((tmpl) => {
            const isSelected = selectedTemplate?.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelect(tmpl)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                    {tmpl.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {tmpl.body || (tmpl as any).template}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Template Editor */}
        <div className="lg:col-span-7">
          {selectedTemplate ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit: {selectedTemplate.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    ID: {selectedTemplate.id}
                  </span>
                </div>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Template</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Text with Variables:
                </label>
                <textarea
                  rows={8}
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Supported Placeholders List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block">
                  Available Interpolation Placeholders:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedTemplate.placeholders || ['customerName', 'bookingNumber', 'jobCardNumber', 'inspectionNumber', 'quotationNumber', 'invoiceNumber', 'status', 'service', 'amount', 'dueDate']).map((ph) => (
                    <button
                      key={ph}
                      type="button"
                      onClick={() => handleCopy(`{{${ph}}}`, ph)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                      title="Click to copy placeholder"
                    >
                      <span>{`{{${ph}}}`}</span>
                      {copiedId === ph ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Preview */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <span className="font-bold text-slate-700 block text-[11px]">Preview in WhatsApp App:</span>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 whitespace-pre-wrap text-xs shadow-2xs font-sans">
                  {(editedBody || (selectedTemplate as any).template || '')
                    .replace(/\{\{customerName\}\}/g, 'Muhammad Arshad')
                    .replace(/\{\{bookingNumber\}\}/g, 'HA-BK-2026-001')
                    .replace(/\{\{jobCardNumber\}\}/g, 'HA-JC-2026-001')
                    .replace(/\{\{inspectionNumber\}\}/g, 'HA-INSP-2026-001')
                    .replace(/\{\{quotationNumber\}\}/g, 'HA-QT-2026-001')
                    .replace(/\{\{invoiceNumber\}\}/g, 'HA-INV-2026-001')
                    .replace(/\{\{status\}\}/g, 'Testing & Quality Check')
                    .replace(/\{\{service\}\}/g, 'Engine Overhaul & Tuning')
                    .replace(/\{\{amount\}\}/g, '4,500')
                    .replace(/\{\{dueDate\}\}/g, '2026-11-20')}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Select a template to customize its wording and placeholders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
