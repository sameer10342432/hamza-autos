import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Printer,
  MessageCircle,
  Search,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Clock,
  DollarSign
} from 'lucide-react';
import { quotationService, whatsappService, invoiceService } from '../../services';
import { Quotation } from '../../types';

interface QuotationsTabProps {
  onRefreshStats?: () => void;
  onNavigateToInvoice?: () => void;
}

export const QuotationsTab: React.FC<QuotationsTabProps> = ({
  onRefreshStats,
  onNavigateToInvoice
}) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bikeBrand, setBikeBrand] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('CD 70');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [termsAndConditions, setTermsAndConditions] = useState(
    'Quotation valid for 7 days. Authentic OEM spare parts quoted. Labor guaranteed for 7 days.'
  );

  const [items, setItems] = useState<
    Array<{ type: 'Labour' | 'Part'; description: string; quantity: number; unitPrice: number }>
  >([
    { type: 'Labour', description: 'Complete Engine Tuning & Valve Setting', quantity: 1, unitPrice: 850 },
    { type: 'Part', description: 'Genuine 4T Engine Oil 20W-50 (0.7L)', quantity: 1, unitPrice: 750 }
  ]);

  const loadQuotations = async () => {
    try {
      const all = await quotationService.getAll();
      setQuotations(all);
    } catch (err) {
      console.error('Failed to load quotations', err);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      { type: 'Part', description: 'Genuine Brake Shoe Set', quantity: 1, unitPrice: 650 }
    ]);
  };

  const removeItemRow = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updateItemRow = (idx: number, field: string, val: any) => {
    setItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || items.length === 0) return;

    try {
      const created = await quotationService.create({
        customerName,
        customerPhone,
        bikeBrand,
        bikeModel,
        registrationNumber: registrationNumber || undefined,
        discountAmount: Number(discountAmount) || 0,
        taxPercent: Number(taxPercent) || 0,
        termsAndConditions,
        items: items.map(it => ({
          type: it.type,
          description: it.description,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)
        }))
      });

      await loadQuotations();
      setSelectedQuotation(created);
      setShowCreateModal(false);
      onRefreshStats?.();
    } catch (err) {
      console.error('Failed to create quotation', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: Quotation['status']) => {
    await quotationService.updateStatus(id, status);
    await loadQuotations();
    if (selectedQuotation?.id === id) {
      setSelectedQuotation(prev => prev ? { ...prev, status } : null);
    }
    onRefreshStats?.();
  };

  const handleConvertToInvoice = async (quotation: Quotation) => {
    try {
      await quotationService.convertToInvoice(quotation.id);
      alert(`Quotation #${quotation.quotationNumber} successfully converted to official Invoice!`);
      await loadQuotations();
      onRefreshStats?.();
      onNavigateToInvoice?.();
    } catch (err: any) {
      alert('Conversion failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this quotation?')) {
      await quotationService.delete(id);
      await loadQuotations();
      if (selectedQuotation?.id === id) setSelectedQuotation(null);
      onRefreshStats?.();
    }
  };

  const filtered = quotations.filter(q => {
    const term = searchTerm.toLowerCase();
    return (
      q.quotationNumber.toLowerCase().includes(term) ||
      q.customerName.toLowerCase().includes(term) ||
      q.customerPhone.includes(term) ||
      q.bikeModel.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            <span>Digital Quotations &amp; Estimates ({quotations.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Create transparent itemized quotations in PKR, share via WhatsApp, and convert to invoices
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by quotation #, customer name, phone or bike model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 pl-9 pr-4 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Grid: List & View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quotation List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No quotations found.
            </div>
          ) : (
            filtered.map((quote) => {
              const isSelected = selectedQuotation?.id === quote.id;
              return (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuotation(quote)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-red-600">
                      {quote.quotationNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      quote.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      quote.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      quote.status === 'Invoiced' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {quote.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-1">
                    {quote.customerName} · {quote.bikeBrand} {quote.bikeModel}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{quote.createdAt.slice(0, 10)}</span>
                    <span className="font-bold text-slate-900">PKR {(quote.netTotal || quote.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-7">
          {selectedQuotation ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-600">
                      {selectedQuotation.quotationNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      Valid Until: {selectedQuotation.validUntil}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {selectedQuotation.customerName} ({selectedQuotation.customerPhone})
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedQuotation.bikeBrand} {selectedQuotation.bikeModel}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer"
                    title="Print"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <a
                    href={whatsappService.buildQuotationLink(
                      selectedQuotation.quotationNumber,
                      selectedQuotation.customerName,
                      selectedQuotation.netTotal,
                      selectedQuotation.customerPhone
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => handleDelete(selectedQuotation.id)}
                    className="p-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Switcher & Convert to Invoice */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Status:</span>
                  {(['Draft', 'Sent', 'Approved', 'Rejected'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedQuotation.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        selectedQuotation.status === st
                          ? 'bg-red-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {selectedQuotation.status !== 'Invoiced' && (
                  <button
                    onClick={() => handleConvertToInvoice(selectedQuotation)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Convert to Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Unit Price</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedQuotation.items || [
                      ...((selectedQuotation as any).labourItems || []).map((l: any) => ({ type: 'Labour' as const, description: l.description, quantity: 1, unitPrice: l.amount, total: l.amount })),
                      ...((selectedQuotation as any).partsItems || []).map((p: any) => ({ type: 'Part' as const, description: p.partName, quantity: p.quantity, unitPrice: p.unitPrice, total: p.total }))
                    ]).map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            it.type === 'Labour' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {it.type}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{it.description}</td>
                        <td className="py-2 px-3 text-center text-slate-600">{it.quantity}</td>
                        <td className="py-2 px-3 text-right text-slate-600">PKR {(it.unitPrice || 0).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">PKR {(it.total || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>PKR {(selectedQuotation.subtotal || (selectedQuotation as any).labourTotal + (selectedQuotation as any).partsTotal || 0).toLocaleString()}</span>
                </div>
                {((selectedQuotation.discountAmount || (selectedQuotation as any).discount || 0) > 0) && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>- PKR {(selectedQuotation.discountAmount || (selectedQuotation as any).discount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-red-600">PKR {(selectedQuotation.netTotal || (selectedQuotation as any).totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Select a quotation on the left to inspect itemized spare parts and labour rates.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CREATE NEW QUOTATION */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Create New Quotation</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    placeholder="e.g. Asim Raza"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    placeholder="e.g. 0321 9876543"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make / Brand</label>
                  <select
                    value={bikeBrand}
                    onChange={(e) => setBikeBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="United">United</option>
                    <option value="Road Prince">Road Prince</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    placeholder="e.g. CD 70"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reg # (Optional)</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Items Table Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Quotation Line Items:</span>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <select
                        value={it.type}
                        onChange={(e) => updateItemRow(idx, 'type', e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs w-24"
                      >
                        <option value="Labour">Labour</option>
                        <option value="Part">Part</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Item description..."
                        value={it.description}
                        onChange={(e) => updateItemRow(idx, 'description', e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs flex-1"
                      />

                      <input
                        type="number"
                        placeholder="Qty"
                        value={it.quantity}
                        onChange={(e) => updateItemRow(idx, 'quantity', Number(e.target.value))}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs w-16 text-center"
                      />

                      <input
                        type="number"
                        placeholder="Unit Price"
                        value={it.unitPrice}
                        onChange={(e) => updateItemRow(idx, 'unitPrice', Number(e.target.value))}
                        className="p-1.5 rounded-lg border border-slate-300 text-xs w-24 text-right"
                      />

                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount (PKR)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Terms / Notes</label>
                  <input
                    type="text"
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                >
                  Save Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
