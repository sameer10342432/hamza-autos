import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Search, 
  ArrowRight, 
  CheckSquare, 
  Clock 
} from 'lucide-react';
import { PurchaseOrder } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface GoodsReceivingSectionProps {
  onNotify?: (msg: string) => void;
  onNavigateToInventory?: () => void;
}

export const GoodsReceivingSection: React.FC<GoodsReceivingSectionProps> = ({
  onNotify = () => {},
  onNavigateToInventory
}) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [receivedInputs, setReceivedInputs] = useState<Record<string, number>>({});
  const [receivingNotes, setReceivingNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await AdminApiService.getPurchaseOrders();
      if (res.success && res.purchaseOrders) {
        setPurchaseOrders(res.purchaseOrders);
      }
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingPOs = purchaseOrders.filter(po => 
    ['Sent', 'Confirmed', 'Partially Received'].includes(po.deliveryStatus)
  );

  const handleSelectPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    const initialInputs: Record<string, number> = {};
    po.items.forEach(it => {
      // Default remaining quantity to receive
      const remaining = Math.max(0, it.quantityOrdered - (it.quantityReceived || 0));
      initialInputs[it.id] = remaining;
    });
    setReceivedInputs(initialInputs);
    setReceivingNotes(`Verified stock delivered on ${new Date().toISOString().split('T')[0]}`);
  };

  const handleConfirmReceiving = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    try {
      const receivedItems = Object.entries(receivedInputs).map(([id, qty]) => ({
        id,
        quantityReceivedNow: Number(qty) || 0
      }));

      const res = await AdminApiService.receivePurchaseOrder(selectedPO.id, {
        receivedItems,
        receivingNotes
      });

      if (res.success) {
        onNotify(res.message || 'Goods received and inventory quantities updated successfully!');
        setSelectedPO(null);
        await loadData();
      }
    } catch (err: any) {
      alert(`Error receiving stock: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            GOODS RECEIVING NOTE (GRN) &amp; INVENTORY AUDIT
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inbound Stock Receiving
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify wholesale spare parts arrivals from Badami Bagh distributors and increment inventory stock automatically.
          </p>
        </div>
      </div>

      {/* 2. Main 2-Column Split: Pending PO List & Active Goods Receiving Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Purchase Orders Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Awaiting Inbound Delivery ({pendingPOs.length})</h3>
            </div>
          </div>

          {pendingPOs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p>No pending wholesale deliveries awaiting goods receiving.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingPOs.map(po => (
                <div 
                  key={po.id}
                  onClick={() => handleSelectPO(po)}
                  className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedPO?.id === po.id ? 'bg-red-50/70 border border-red-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-600 text-xs">{po.poNumber}</span>
                      <span className="font-bold text-slate-900 text-xs">{po.supplierName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {po.items.length} line items · Value: PKR {po.totalOrderValue.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {po.deliveryStatus}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Goods Receiving Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              {selectedPO ? `Receive Goods: ${selectedPO.poNumber}` : 'Select Purchase Order to Verify'}
            </h3>
          </div>

          {!selectedPO ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p>Click on any pending purchase order on the left to verify delivered parts.</p>
            </div>
          ) : (
            <form onSubmit={handleConfirmReceiving} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div><strong>Supplier:</strong> {selectedPO.supplierName}</div>
                <div><strong>Order Date:</strong> {selectedPO.orderDate}</div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Verify Quantities Delivered Now:</span>
                
                <div className="divide-y divide-slate-100">
                  {selectedPO.items.map(it => {
                    const alreadyReceived = it.quantityReceived || 0;
                    return (
                      <div key={it.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900">{it.partName}</div>
                          <div className="text-[11px] text-slate-500">
                            Ordered: {it.quantityOrdered} | Already Received: {alreadyReceived}
                          </div>
                        </div>

                        <div className="w-24 shrink-0">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Recv Now</label>
                          <input
                            type="number"
                            min={0}
                            max={Math.max(0, it.quantityOrdered - alreadyReceived)}
                            value={receivedInputs[it.id] ?? 0}
                            onChange={(e) => setReceivedInputs({ ...receivedInputs, [it.id]: Number(e.target.value) })}
                            className="w-full py-1.5 px-2 rounded-lg border border-slate-300 font-bold text-center bg-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receiving Notes / Inspection Inspection</label>
                <textarea
                  rows={2}
                  value={receivingNotes}
                  onChange={(e) => setReceivingNotes(e.target.value)}
                  placeholder="Checked packaging seals, no damaged items..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 text-[11px]">
                Confirming receipt will automatically increment the spare parts stock in your <strong>Spare Parts Inventory</strong> with zero duplicate entries.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Confirm Goods Receipt &amp; Update Inventory
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
