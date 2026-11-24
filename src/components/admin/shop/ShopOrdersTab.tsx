/**
 * Hamza Autos - Admin Shop Orders Management Tab
 * Order workflow: New -> Confirmed -> Packed -> Dispatched -> Delivered, Courier tracking, and Printable Invoice
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  Eye, 
  RefreshCw, 
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Building2,
  Calendar,
  Filter
} from 'lucide-react';
import { ShopOrder, OrderStatus, CourierPartner, PaymentStatus } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';

export const ShopOrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Shipping & Status Modal State
  const [courierName, setCourierName] = useState<CourierPartner>('TCS Courier');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ShopService.getAdminOrders({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined
      });
      setOrders(data);
    } catch (err) {
      console.error('Error loading admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdating(true);
      const updated = await ShopService.updateAdminOrderStatus(orderId, newStatus, statusNote);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setSelectedOrder(updated);
      setToast(`Order status updated to ${newStatus}.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating order status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveShipping = async (orderId: string) => {
    try {
      setUpdating(true);
      const updated = await ShopService.updateAdminOrderShipping(orderId, {
        courier: courierName,
        trackingNumber: trackingNumber.trim()
      });
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setSelectedOrder(updated);
      setToast(`Courier tracking saved for ${updated.orderNumber}.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving shipping tracking.');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    try {
      setUpdating(true);
      const updated = await ShopService.updateAdminOrderPayment(orderId, {
        paymentStatus: 'Payment Received'
      });
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setSelectedOrder(updated);
      setToast(`Payment marked as Received for ${updated.orderNumber}.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error verifying payment.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = (order: ShopOrder) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber} - Hamza Autos</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1e293b; max-width: 800px; margin: auto; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .brand { font-size: 24px; font-weight: 800; color: #dc2626; }
          .meta { font-size: 13px; color: #64748b; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
          th { background: #f8fafc; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .totals { margin-top: 16px; text-align: right; font-size: 14px; }
          .totals .grand { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 6px; }
          .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">HAMZA AUTOS</div>
            <div class="meta">
              Motorcycle Repair &amp; Spare Parts E-Commerce<br>
              Abu Bakar Road, Badami Bagh, Lahore<br>
              Phone / WhatsApp: +92 325 1814548
            </div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 20px;">TAX INVOICE</h2>
            <div class="meta">
              <strong>Order #:</strong> ${order.orderNumber}<br>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
              <strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px;">
          <div>
            <strong>CUSTOMER &amp; DELIVERY:</strong><br>
            ${order.customer.fullName}<br>
            Phone: ${order.customer.mobileNumber}<br>
            Address: ${order.customer.deliveryAddress}<br>
            ${order.customer.city}, ${order.customer.province}
          </div>
          <div style="text-align: right;">
            <strong>SHIPPING LOGISTICS:</strong><br>
            Courier: ${order.shipping.courier}<br>
            Tracking #: ${order.shipping.trackingNumber || 'Pending Pickup'}<br>
            Estimated Delivery: ${order.shipping.estimatedDeliveryDays}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Part Name &amp; SKU</th>
              <th>Fitment</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th style="text-align: right;">Total (PKR)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(it => `
              <tr>
                <td><strong>${it.name}</strong><br><small style="color: #64748b;">${it.sku}</small></td>
                <td>${it.selectedCompatibility || 'Universal / As specified'}</td>
                <td>${it.quantity}</td>
                <td>PKR ${it.unitPrice.toLocaleString()}</td>
                <td style="text-align: right;">PKR ${(it.unitPrice * it.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>Subtotal: PKR ${order.pricing.subtotal.toLocaleString()}</div>
          <div>Nationwide Delivery: ${order.pricing.shippingFee === 0 ? 'FREE' : `PKR ${order.pricing.shippingFee.toLocaleString()}`}</div>
          <div class="grand">Total Amount: PKR ${order.pricing.total.toLocaleString()}</div>
        </div>

        <div class="footer">
          Thank you for ordering with Hamza Autos! All parts are backed by a 7-day inspection policy.<br>
          For queries or fitment advice, call or WhatsApp our master mechanics at +92 325 1814548.
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Shop Order Management</h2>
          <p className="text-xs text-slate-500 mt-1">Manage all Pakistan spare parts shipments, status transitions &amp; courier tracking</p>
        </div>
        <button
          onClick={loadOrders}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          title="Refresh Orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Name, Mobile..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="New Order">New Order</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="">All Payment Statuses</option>
            <option value="Payment Received">Payment Received</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order # &amp; Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">City / Province</th>
                <th className="py-3 px-4">Items &amp; Total</th>
                <th className="py-3 px-4">Courier &amp; Tracking</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Order # */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-red-600">{ord.orderNumber}</div>
                      <div className="text-[10px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ord.customer.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{ord.customer.mobileNumber}</div>
                    </td>

                    {/* City */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{ord.customer.city}</span>
                      <span className="block text-[10px] text-slate-400">{ord.customer.province}</span>
                    </td>

                    {/* Items & Total */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">PKR {ord.pricing.total.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">{ord.items.length} items</div>
                    </td>

                    {/* Courier */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{ord.shipping.courier}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {ord.shipping.trackingNumber || 'Pending Code'}
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'Payment Received' ? 'bg-emerald-100 text-emerald-800' :
                        ord.paymentStatus === 'Pending Verification' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{ord.paymentMethod}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.orderStatus === 'Cancelled' || ord.orderStatus === 'Returned' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setCourierName(ord.shipping.courier || 'TCS Courier');
                            setTrackingNumber(ord.shipping.trackingNumber || '');
                          }}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(ord)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Management Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-mono text-red-600 font-extrabold text-sm">{selectedOrder.orderNumber}</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Order Management Hub</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer and Delivery info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">{selectedOrder.customer.fullName}</div>
                <div className="text-slate-600">
                  Phone: <strong>{selectedOrder.customer.mobileNumber}</strong> {selectedOrder.customer.whatsappNumber ? `• WhatsApp: ${selectedOrder.customer.whatsappNumber}` : ''}
                </div>
                <div className="text-slate-600">
                  Delivery Address: {selectedOrder.customer.deliveryAddress}, <strong>{selectedOrder.customer.city}, {selectedOrder.customer.province}</strong>
                </div>
                {selectedOrder.customer.orderNotes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-500 italic">
                    Notes: "{selectedOrder.customer.orderNotes}"
                  </div>
                )}
              </div>

              {/* Status Changer */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-900 text-sm">Update Order Lifecycle Status</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Confirmed', 'Processing', 'Packed', 
                    'Dispatched', 'Shipped', 'Delivered', 
                    'Cancelled', 'Returned'
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updating || selectedOrder.orderStatus === st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                        selectedOrder.orderStatus === st
                          ? 'bg-slate-900 text-white'
                          : st === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : st === 'Cancelled' || st === 'Returned'
                          ? 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Note: Marking "Confirmed" automatically reserves and deducts stock from inventory. Marking "Cancelled" restores stock.
                </p>
              </div>

              {/* Courier Tracking Updater */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-900 text-sm">Courier Partner &amp; Tracking Code</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Courier Service</label>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      <option value="TCS Courier">TCS Courier</option>
                      <option value="Leopards Courier">Leopards Courier</option>
                      <option value="M&P Express">M&P Express</option>
                      <option value="Trax Logistics">Trax Logistics</option>
                      <option value="PostEx">PostEx</option>
                      <option value="Call Courier">Call Courier</option>
                      <option value="Hamza Autos Express (Lahore)">Hamza Autos Express (Lahore)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Tracking Consignment Number (CN)</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. 77291823901"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleSaveShipping(selectedOrder.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Save Courier Tracking Info
                </button>
              </div>

              {/* Payment Verification */}
              {selectedOrder.paymentStatus !== 'Payment Received' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-amber-900">Payment Status: {selectedOrder.paymentStatus}</div>
                    <div className="text-amber-700 text-[11px]">
                      Method: {selectedOrder.paymentMethod} {selectedOrder.paymentReference ? `(Ref: ${selectedOrder.paymentReference})` : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVerifyPayment(selectedOrder.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer shrink-0"
                  >
                    Mark Paid
                  </button>
                </div>
              )}

              {/* Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-slate-900">
                          {it.name}
                          <span className="block text-[10px] text-slate-400 font-mono">{it.sku}</span>
                        </td>
                        <td className="p-3">{it.quantity}</td>
                        <td className="p-3">PKR {it.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold">PKR {(it.unitPrice * it.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-3">
                <span className="text-slate-600">Grand Total Payable:</span>
                <span className="text-slate-900 text-base">PKR {selectedOrder.pricing.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handlePrintInvoice(selectedOrder)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
