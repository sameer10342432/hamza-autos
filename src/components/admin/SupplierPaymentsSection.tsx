import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';
import { SupplierPayment, PurchaseOrder, SupplierRecord } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface SupplierPaymentsSectionProps {
  onNotify?: (msg: string) => void;
}

export const SupplierPaymentsSection: React.FC<SupplierPaymentsSectionProps> = ({
  onNotify = () => {}
}) => {
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);

  // Form State
  const [selectedPoId, setSelectedPoId] = useState('');
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Cheque'>('Bank Transfer');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [payRes, poRes, supRes] = await Promise.all([
        AdminApiService.getSupplierPayments(),
        AdminApiService.getPurchaseOrders(),
        AdminApiService.getSuppliers()
      ]);

      if (payRes.success && payRes.payments) {
        setPayments(payRes.payments);
      }
      if (poRes.success && poRes.purchaseOrders) {
        setPurchaseOrders(poRes.purchaseOrders);
      }
      if (supRes.success && supRes.suppliers) {
        setSuppliers(supRes.suppliers);
      }
    } catch (err) {
      console.error('Failed to load supplier payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePoChange = (poId: string) => {
    setSelectedPoId(poId);
    const po = purchaseOrders.find(p => p.id === poId);
    if (po) {
      const balance = Math.max(0, po.totalOrderValue - (po.paidAmount || 0));
      setPayAmount(balance);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoId || payAmount <= 0) return;

    try {
      const res = await AdminApiService.payPurchaseOrder(selectedPoId, {
        amount: payAmount,
        paymentMethod: payMethod,
        referenceNumber: payRef,
        notes: payNotes
      });

      if (res.success) {
        onNotify(`Recorded payment of PKR ${payAmount.toLocaleString()}`);
        setShowPayModal(false);
        setSelectedPoId('');
        setPayAmount(0);
        setPayRef('');
        setPayNotes('');
        await loadData();
      }
    } catch (err: any) {
      alert(`Error recording payment: ${err.message}`);
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            PURCHASING &amp; ACCOUNTS PAYABLE
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Supplier Payments Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record supplier settlements, wholesale invoices clearance, and credit payments for spare parts inventory.
          </p>
        </div>

        <button
          onClick={() => setShowPayModal(true)}
          className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Supplier Payment</span>
        </button>
      </div>

      {/* 2. Total Paid Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Total Disbursements</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">
            PKR {totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">{payments.length} verified supplier payments</div>
        </div>
      </div>

      {/* 3. Payments Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Reference Voucher</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No supplier payments recorded.
                  </td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{p.paymentDate}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.supplierName}</td>
                    <td className="py-3.5 px-4 font-mono text-red-600 font-bold">{p.poNumber || 'General Credit'}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{p.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{p.referenceNumber || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.recordedBy}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                      PKR {p.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Record Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Disburse Supplier Payment</h3>
              <button onClick={() => setShowPayModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Purchase Order *</label>
                <select
                  required
                  value={selectedPoId}
                  onChange={(e) => handlePoChange(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="">-- Choose Purchase Order --</option>
                  {purchaseOrders
                    .filter(po => po.paymentStatus !== 'Paid')
                    .map(po => (
                      <option key={po.id} value={po.id}>
                        {po.poNumber} — {po.supplierName} (Balance: PKR {(po.totalOrderValue - (po.paidAmount || 0)).toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Amount (PKR) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={payAmount || ''}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="Bank Transfer">Bank Transfer (Online / HBL / MCB)</option>
                  <option value="Cash">Cash Voucher</option>
                  <option value="Easypaisa">Easypaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Cheque">Crossed Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Cheque #</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. HBL-FT-991204"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Settlement for piston rings shipment"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payAmount <= 0}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
