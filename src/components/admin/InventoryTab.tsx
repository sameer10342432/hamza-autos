import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Trash2, 
  Edit,
  History,
  CheckCircle2
} from 'lucide-react';
import { SparePart, StockMovement } from '../../types';

interface InventoryTabProps {
  inventory: SparePart[];
  movements: StockMovement[];
  onSavePart: (part: SparePart) => void;
  onAdjustStock: (partId: string, delta: number, reason: string, recordedBy: string) => void;
  onDeletePart: (id: string) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory,
  movements,
  onSavePart,
  onAdjustStock,
  onDeletePart
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Modals
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingPart, setAdjustingPart] = useState<SparePart | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<string>('Restock / Wholesale Purchase');
  
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Form states for part
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState('Lubricants & Oils');
  const [purchasePrice, setPurchasePrice] = useState<number>(600);
  const [sellingPrice, setSellingPrice] = useState<number>(850);
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [minStockAlert, setMinStockAlert] = useState<number>(3);

  const categories = [
    'Lubricants & Oils',
    'Engine & Transmission',
    'Brake Components',
    'Electrical & Lighting',
    'Filters & Gaskets',
    'Drive Chain & Sprockets',
    'Tires & Tubes',
    'Body & Cables'
  ];

  const lowStockItems = inventory.filter(p => p.stockQuantity <= p.minStockAlert);

  const filtered = inventory.filter(p => {
    const matchesSearch = 
      p.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openCreatePart = () => {
    setEditingPart(null);
    setPartNumber(`HA-PRT-${Math.floor(100 + Math.random() * 900)}`);
    setPartName('');
    setCategory('Lubricants & Oils');
    setPurchasePrice(600);
    setSellingPrice(850);
    setStockQuantity(10);
    setMinStockAlert(3);
    setShowPartModal(true);
  };

  const openEditPart = (p: SparePart) => {
    setEditingPart(p);
    setPartNumber(p.partNumber);
    setPartName(p.partName);
    setCategory(p.category);
    setPurchasePrice(p.purchasePrice);
    setSellingPrice(p.sellingPrice);
    setStockQuantity(p.stockQuantity);
    setMinStockAlert(p.minStockAlert);
    setShowPartModal(true);
  };

  const handleSavePartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName || !partNumber) return;

    onSavePart({
      id: editingPart?.id || `prt-${Date.now()}`,
      partNumber,
      partName,
      category,
      compatibleBrands: ['Honda', 'Yamaha', 'Suzuki', 'United'],
      compatibleModels: ['All Standard 70cc / 125cc'],
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity),
      minStockAlert: Number(minStockAlert),
      lastRestocked: new Date().toISOString().split('T')[0]
    });

    setShowPartModal(false);
  };

  const openAdjust = (p: SparePart) => {
    setAdjustingPart(p);
    setAdjustDelta(5);
    setAdjustReason('Restock / Wholesale Purchase from Badami Bagh Auto Market');
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingPart) return;
    onAdjustStock(adjustingPart.id, Number(adjustDelta), adjustReason, 'Admin / Hamza');
    setShowAdjustModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Low Stock Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold block text-sm">Low Stock Alert ({lowStockItems.length} items)</strong>
              <span>Parts have reached or fallen below your minimum inventory threshold. Consider re-ordering from Badami Bagh auto market.</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {lowStockItems.slice(0, 3).map(p => (
              <span key={p.id} className="px-2 py-0.5 bg-amber-200/70 font-semibold rounded text-[11px]">
                {p.partName}: {p.stockQuantity} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parts by Name or SKU / Part #..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            Audit Log
          </button>
          <button
            onClick={openCreatePart}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Spare Part
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Part SKU / Number</th>
                <th className="py-3 px-4 font-bold">Part Name &amp; Category</th>
                <th className="py-3 px-4 font-bold">Stock Qty</th>
                <th className="py-3 px-4 font-bold">Cost Price</th>
                <th className="py-3 px-4 font-bold">Selling Price</th>
                <th className="py-3 px-4 font-bold">Margin</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No spare parts found in workshop inventory.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const isLow = p.stockQuantity <= p.minStockAlert;
                  const margin = p.sellingPrice - p.purchasePrice;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                        {p.partNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{p.partName}</span>
                        <span className="text-[10px] text-slate-500">{p.category}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                          isLow ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-900'
                        }`}>
                          {p.stockQuantity} units
                          {isLow && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">Min Alert: {p.minStockAlert}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        PKR {p.purchasePrice.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        PKR {p.sellingPrice.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                        +PKR {margin.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick Adjust Button */}
                          <button
                            onClick={() => openAdjust(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                            title="Restock or deduct units"
                          >
                            Adjust Stock
                          </button>

                          {/* Edit Part */}
                          <button
                            onClick={() => openEditPart(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Edit part details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeletePart(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete part from inventory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Part */}
      {showPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPart ? `Edit Spare Part (${editingPart.partNumber})` : 'Add New Spare Part to Inventory'}
              </h3>
              <button onClick={() => setShowPartModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSavePartSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Part SKU / Number *</label>
                  <input
                    type="text"
                    required
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Part Name &amp; Specification *</label>
                <input
                  type="text"
                  required
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="e.g. Havoline 20W-50 4T Motorcycle Engine Oil (0.7L)"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purchase / Cost Price (PKR)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl font-mono text-right"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Selling Price (PKR)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl font-mono text-right font-bold text-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Threshold Alert Qty</label>
                  <input
                    type="number"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPartModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adjust Stock */}
      {showAdjustModal && adjustingPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Adjust Inventory Stock</h3>
                <span className="font-semibold text-xs text-red-600">{adjustingPart.partName}</span>
              </div>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span>Current Stock on Shelf:</span>
                <strong className="font-mono text-base text-slate-900">{adjustingPart.stockQuantity} units</strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity Change (+ to Add, - to Deduct)
                </label>
                <input
                  type="number"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  placeholder="+10 or -2"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl font-mono text-center text-sm font-bold"
                />
                <span className="block text-[11px] text-slate-500 mt-1">
                  New stock will be: <strong>{Math.max(0, adjustingPart.stockQuantity + Number(adjustDelta))} units</strong>
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Note for Audit Log</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Received shipment from wholesale distributor, or workshop internal consumption"
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Record Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Audit Log */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-red-600" />
                Stock Movement Audit Trail
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="divide-y divide-slate-100 text-xs max-h-96 overflow-y-auto">
              {movements.length === 0 ? (
                <div className="py-6 text-center text-slate-400">No stock movements recorded yet.</div>
              ) : (
                movements.map(m => (
                  <div key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900 block">{m.partName}</span>
                      <span className="text-[11px] text-slate-500">{m.reason} · Recorded by {m.recordedBy}</span>
                      <span className="text-[10px] text-slate-400 block">{m.date}</span>
                    </div>

                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      m.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
