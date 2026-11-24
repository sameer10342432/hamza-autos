/**
 * Hamza Autos - Admin Shop Payments Tab
 * Track COD and Bank Transfer payments, verify receipts, and maintain financial reconciliation
 */

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Search,
  ExternalLink
} from 'lucide-react';
import { ShopOrder } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';

export const ShopPaymentsTab: React.FC = () => {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ShopService.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error loading payment records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleVerify = async (orderId: string, orderNumber: string) => {
    try {
      await ShopService.updateAdminOrderPayment(orderId, {
        paymentStatus: 'Payment Received'
      });
      setToast(`Verified payment for ${orderNumber}.`);
      setTimeout(() => setToast(null), 3000);
      await loadOrders();
    } catch (err: any) {
      alert(err.message || 'Error verifying payment.');
    }
  };

  const filtered = orders.filter(o => {
    if (methodFilter && o.paymentMethod !== methodFilter) return false;
    if (statusFilter && o.paymentStatus !== statusFilter) return false;
    return true;
  });

  const totalCollected = orders
    .filter(o => o.paymentStatus === 'Payment Received' || o.orderStatus === 'Delivered')
    .reduce((sum, o) => sum + o.pricing.total, 0);

  const pendingVerification = orders
    .filter(o => o.paymentStatus === 'Pending Verification')
    .reduce((sum, o) => sum + o.pricing.total, 0);

  const codInTransit = orders
    .filter(o => o.paymentMethod === 'Cash on Delivery (COD)' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned')
    .reduce((sum, o) => sum + o.pricing.total, 0);

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
          <h2 className="text-xl font-extrabold text-slate-900">Payments &amp; Reconciliation</h2>
          <p className="text-xs text-slate-500 mt-1">Audit COD courier collections and verify customer bank transfers &amp; wallet payments</p>
        </div>
        <button
          onClick={loadOrders}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Collected</span>
          <div className="text-2xl font-black text-slate-900 mt-1">PKR {totalCollected.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Delivered parcels &amp; verified bank receipts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase">Pending Verification</span>
          <div className="text-2xl font-black text-amber-700 mt-1">PKR {pendingVerification.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Bank transfers awaiting statement check</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-blue-600 uppercase">COD In Transit</span>
          <div className="text-2xl font-black text-slate-900 mt-1">PKR {codInTransit.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Dispatched packages awaiting rider collection</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center text-xs">
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
        >
          <option value="">All Payment Methods</option>
          <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
          <option value="Bank Transfer / Manual Payment">Bank Transfer / Manual Payment</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
        >
          <option value="">All Payment Statuses</option>
          <option value="Payment Received">Payment Received</option>
          <option value="Pending Verification">Pending Verification</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount (PKR)</th>
                <th className="py-3 px-4">TID / Reference</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-red-600">{ord.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{ord.customer.fullName}</span>
                    <span className="block text-[10px] text-slate-400">{ord.customer.city}</span>
                  </td>
                  <td className="py-3.5 px-4">{ord.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">PKR {ord.pricing.total.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{ord.paymentReference || 'N/A'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.paymentStatus === 'Payment Received' ? 'bg-emerald-100 text-emerald-800' :
                      ord.paymentStatus === 'Pending Verification' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {ord.paymentStatus !== 'Payment Received' && (
                      <button
                        onClick={() => handleVerify(ord.id, ord.orderNumber)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        Verify &amp; Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
