/**
 * Hamza Autos - Admin Shop Inventory Management Tab
 * Live stock levels, low-stock warnings, stock movements history, and quick manual adjustments
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  History, 
  Plus, 
  Minus, 
  RefreshCw, 
  Search,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { ShopProduct, ShopInventoryMovement } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';

export const ShopInventoryTab: React.FC = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [movements, setMovements] = useState<ShopInventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'levels' | 'movements'>('levels');
  const [search, setSearch] = useState('');

  // Quick adjustment modal
  const [adjustingProduct, setAdjustingProduct] = useState<ShopProduct | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('Physical Stock Count Adjustment');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, movs] = await Promise.all([
        ShopService.getAdminProducts(),
        ShopService.getAdminInventoryMovements()
      ]);
      setProducts(prods);
      setMovements(movs);
    } catch (err) {
      console.error('Error loading inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    try {
      setSaving(true);
      const newStock = adjustingProduct.stockQuantity + adjustmentQuantity;
      if (newStock < 0) {
        alert('Stock cannot be adjusted below zero.');
        return;
      }

      await ShopService.updateAdminProduct(adjustingProduct.id, {
        stockQuantity: newStock,
        stockAdjustmentReason: adjustmentReason.trim() || 'Manual stock update'
      });

      setToast(`Adjusted stock for "${adjustingProduct.name}" by ${adjustmentQuantity > 0 ? `+${adjustmentQuantity}` : adjustmentQuantity}.`);
      setTimeout(() => setToast(null), 3000);
      setAdjustingProduct(null);
      setAdjustmentQuantity(0);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error updating stock quantity.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Inventory &amp; Stock Hub</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time shelf quantities, low-stock warnings, and historical stock movements</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtabs switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('levels')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                activeSubTab === 'levels' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stock Quantities
            </button>
            <button
              onClick={() => setActiveSubTab('movements')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                activeSubTab === 'movements' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Movement History
            </button>
          </div>

          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeSubTab === 'levels' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory by SKU or product name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              Total SKUs: <strong className="text-slate-900">{filteredProducts.length}</strong>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="py-3 px-4">Part SKU &amp; Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Alert Threshold</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Stock Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.map((p) => {
                    const isOut = p.stockQuantity <= 0;
                    const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="font-mono text-[11px] text-slate-400 font-bold">{p.sku} • {p.brand}</div>
                        </td>

                        <td className="py-3 px-4 text-slate-600">{p.categoryName}</td>

                        <td className="py-3 px-4">
                          <span className="font-black text-sm text-slate-900">{p.stockQuantity}</span> units
                        </td>

                        <td className="py-3 px-4 text-slate-500">{p.lowStockThreshold} units</td>

                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            isOut ? 'bg-rose-100 text-rose-800' :
                            isLow ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.availabilityStatus}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setAdjustingProduct(p);
                              setAdjustmentQuantity(0);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Movements History Subtab */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Stock Adjustment Audit Log</h3>
            <span className="text-xs text-slate-500">{movements.length} logged events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Product &amp; SKU</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Previous</th>
                  <th className="py-3 px-4">Change</th>
                  <th className="py-3 px-4">New Balance</th>
                  <th className="py-3 px-4">Reason / Reference</th>
                  <th className="py-3 px-4">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(m.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.productName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{m.sku}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {m.changeType}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500">{m.previousQuantity}</td>

                      <td className="py-3 px-4 font-bold">
                        <span className={m.changeAmount > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {m.changeAmount > 0 ? `+${m.changeAmount}` : m.changeAmount}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-black text-slate-900">{m.newQuantity}</td>

                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={m.reason}>
                        {m.reason}
                        {m.orderNumber && <span className="block font-mono text-[10px] text-red-600">{m.orderNumber}</span>}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">{m.performedBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900">Adjust Shelf Stock</h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 text-sm">{adjustingProduct.name}</div>
              <div className="font-mono text-slate-400 mt-0.5">{adjustingProduct.sku}</div>
              <div className="mt-2 text-slate-700 font-semibold">
                Current Recorded Stock: <strong className="text-slate-900 text-base">{adjustingProduct.stockQuantity}</strong> units
              </div>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quantity to Add or Deduct (Use positive or negative)
                </label>
                <input
                  type="number"
                  required
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                  placeholder="e.g. +5 or -2"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Resulting Stock: <strong>{adjustingProduct.stockQuantity + adjustmentQuantity}</strong> units
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Stock Adjustment</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="Physical Stock Count Adjustment">Physical Stock Count Adjustment</option>
                  <option value="Inbound Restock from Badami Bagh Distributor">Inbound Restock from Badami Bagh Distributor</option>
                  <option value="Workshop Service Usage (Direct Fitting)">Workshop Service Usage (Direct Fitting)</option>
                  <option value="Damaged in Storage / Returned Defective">Damaged in Storage / Returned Defective</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || adjustmentQuantity === 0}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  {saving ? 'Saving...' : 'Apply Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
