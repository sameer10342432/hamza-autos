import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  FileText, 
  Printer, 
  DollarSign, 
  X, 
  Trash2, 
  ChevronRight,
  Truck
} from 'lucide-react';
import { PurchaseOrder, SupplierRecord, PODeliveryStatus } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface PurchaseOrdersSectionProps {
  onNotify?: (msg: string) => void;
  onOpenGoodsReceiving?: (poId: string) => void;
  onOpenSupplierPayment?: (poId: string) => void;
}

export const PurchaseOrdersSection: React.FC<PurchaseOrdersSectionProps> = ({
  onNotify = () => {},
  onOpenGoodsReceiving,
  onOpenSupplierPayment
}) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Create PO Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [poNotes, setPoNotes] = useState('');
  const [poItems, setPoItems] = useState<Array<{ partName: string; quantityOrdered: number; unitPurchasePrice: number }>>([
    { partName: '', quantityOrdered: 5, unitPurchasePrice: 500 }
  ]);
  const [discount, setDiscount] = useState(0);

  // Printing View Modal
  const [printingPO, setPrintingPO] = useState<PurchaseOrder | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [poRes, supRes] = await Promise.all([
        AdminApiService.getPurchaseOrders(),
        AdminApiService.getSuppliers()
      ]);

      if (poRes.success && poRes.purchaseOrders) {
        setPurchaseOrders(poRes.purchaseOrders);
      }
      if (supRes.success && supRes.suppliers) {
        setSuppliers(supRes.suppliers);
      }
    } catch (err) {
      console.error('Failed to load POs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = purchaseOrders.filter(po => {
    if (statusFilter !== 'all' && po.deliveryStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNumber = po.poNumber.toLowerCase().includes(q);
      const matchSupplier = po.supplierName.toLowerCase().includes(q);
      return matchNumber || matchSupplier;
    }
    return true;
  });

  const addItemRow = () => {
    setPoItems(prev => [...prev, { partName: '', quantityOrdered: 5, unitPurchasePrice: 500 }]);
  };

  const removeItemRow = (index: number) => {
    setPoItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItemRow = (index: number, field: string, value: any) => {
    setPoItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === selectedSupplierId);
    if (!sup) {
      alert('Please select a supplier from directory.');
      return;
    }

    try {
      const payload = {
        supplierId: sup.id,
        supplierName: sup.supplierName,
        expectedDeliveryDate: expectedDate,
        notes: poNotes,
        discount,
        items: poItems
      };
      const res = await AdminApiService.createPurchaseOrder(payload);
      if (res.success) {
        setPurchaseOrders(prev => [res.purchaseOrder, ...prev]);
        onNotify(`Purchase Order ${res.purchaseOrder.poNumber} created for ${sup.supplierName}`);
        setShowCreateModal(false);
        // Reset
        setSelectedSupplierId('');
        setPoItems([{ partName: '', quantityOrdered: 5, unitPurchasePrice: 500 }]);
        setDiscount(0);
        setPoNotes('');
      }
    } catch (err: any) {
      alert(`Error creating PO: ${err.message}`);
    }
  };

  const totalValue = purchaseOrders.reduce((sum, po) => sum + (po.totalOrderValue || 0), 0);
  const pendingDeliveries = purchaseOrders.filter(po => ['Sent', 'Confirmed', 'Partially Received'].includes(po.deliveryStatus)).length;
  const unpaidBalance = purchaseOrders.reduce((sum, po) => sum + Math.max(0, (po.totalOrderValue || 0) - (po.paidAmount || 0)), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            PROCUREMENT &amp; INVENTORY RESTOCKING
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Purchase Orders &amp; Inbound Goods
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue formal wholesale purchase orders, track supplier deliveries, and audit received parts against inventory.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* 2. Procurement KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Purchase Orders</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            PKR {totalValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{purchaseOrders.length} issued orders</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Pending Deliveries</div>
          <div className="text-2xl font-black text-blue-900 mt-1 tabular-nums">{pendingDeliveries}</div>
          <div className="text-[11px] text-blue-600 mt-0.5 font-medium">Orders arriving at workshop</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Unsettled PO Balance</div>
          <div className="text-2xl font-black text-amber-900 mt-1 tabular-nums">
            PKR {unpaidBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5 font-medium">Payable to suppliers</div>
        </div>
      </div>

      {/* 3. Search and Status Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search purchase orders by PO number or supplier name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
        >
          <option value="all">All Delivery Statuses</option>
          <option value="Sent">Sent / Placed</option>
          <option value="Partially Received">Partially Received</option>
          <option value="Received">Fully Received</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* 4. PO Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Total (PKR)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filtered.map(po => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {po.supplierName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {po.orderDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.deliveryStatus === 'Received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        po.deliveryStatus === 'Partially Received' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {po.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                        po.paymentStatus === 'Partially Paid' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {po.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                      PKR {po.totalOrderValue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPrintingPO(po)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                          title="Print PO Voucher"
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

      {/* 5. Create Purchase Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Generate Wholesale Purchase Order</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Supplier *</label>
                  <select
                    required
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.supplierName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Items Table Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Order Spare Parts Items</span>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs text-red-600 font-bold hover:text-red-700"
                  >
                    + Add Another Item
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {poItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          placeholder="Part Name (e.g. CD 70 Piston Kit 0.25mm)"
                          value={item.partName}
                          onChange={(e) => updateItemRow(idx, 'partName', e.target.value)}
                          className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          required
                          min={1}
                          placeholder="Qty"
                          value={item.quantityOrdered}
                          onChange={(e) => updateItemRow(idx, 'quantityOrdered', Number(e.target.value))}
                          className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-bold"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          required
                          min={0}
                          placeholder="Unit PKR"
                          value={item.unitPurchasePrice}
                          onChange={(e) => updateItemRow(idx, 'unitPurchasePrice', Number(e.target.value))}
                          className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-mono"
                        />
                      </div>
                      {poItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Order Notes / Delivery Bay</label>
                <textarea
                  rows={2}
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  placeholder="Notes for distributor, packaging instructions..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Generate Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Printable Purchase Order Modal */}
      {printingPO && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
              <h3 className="text-base font-bold text-slate-900">Purchase Order: {printingPO.poNumber}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1.5 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setPrintingPO(null)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Printable Voucher Paper */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <div className="font-bold text-sm text-slate-900">HAMZA AUTOS LAHORE</div>
                  <div className="text-[11px] text-slate-500">Abu Bakar Road, Badami Bagh</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{printingPO.poNumber}</div>
                  <div className="text-[11px] text-slate-500">Date: {printingPO.orderDate}</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900">To Supplier: {printingPO.supplierName}</div>
                <div className="text-[11px] text-slate-500">Status: {printingPO.deliveryStatus} | Payment: {printingPO.paymentStatus}</div>
              </div>

              <table className="w-full text-left border-t border-b py-1">
                <thead>
                  <tr className="border-b">
                    <th className="py-1">Part Description</th>
                    <th className="py-1 text-center">Ordered</th>
                    <th className="py-1 text-center">Delivered</th>
                    <th className="py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {printingPO.items.map(it => (
                    <tr key={it.id}>
                      <td className="py-1 font-sans">{it.partName}</td>
                      <td className="py-1 text-center">{it.quantityOrdered}</td>
                      <td className="py-1 text-center">{it.quantityReceived}</td>
                      <td className="py-1 text-right font-mono">PKR {it.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between font-bold pt-1">
                <span>Total Order Value:</span>
                <span className="text-sm">PKR {printingPO.totalOrderValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
