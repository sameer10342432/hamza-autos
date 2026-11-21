/**
 * Hamza Autos - Admin Shop Dashboard Tab
 * Real shop data: Products, Inventory warnings, Order pipeline, and Collected Revenue
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Truck, 
  RefreshCw, 
  ArrowRight,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { ShopDashboardStats, ShopOrder, ShopProduct } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';

interface ShopDashboardTabProps {
  onSelectTab: (tab: any) => void;
  onViewOrder?: (orderId: string) => void;
}

export const ShopDashboardTab: React.FC<ShopDashboardTabProps> = ({ 
  onSelectTab, 
  onViewOrder 
}) => {
  const [stats, setStats] = useState<ShopDashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<ShopOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, orders, prods] = await Promise.all([
        ShopService.getAdminDashboardStats(),
        ShopService.getAdminOrders(),
        ShopService.getAdminProducts()
      ]);
      setStats(s);
      setRecentOrders(orders.slice(0, 5));
      setLowStockProducts(prods.filter(p => p.stockQuantity <= p.lowStockThreshold));
    } catch (err) {
      console.error('Error loading shop dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Shop Performance &amp; Orders Overview</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time statistics across all Pakistan spare parts shipments and inventory</p>
        </div>
        <button
          onClick={loadData}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Products</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.totalProducts || 0}</div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-600 font-bold">{stats?.activeProducts || 0} Active</span> • {stats?.outOfStockProducts || 0} Out of Stock
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.pendingOrders || 0}</div>
          <div className="text-xs text-slate-500 mt-1">
            Total Orders: <strong className="text-slate-800">{stats?.totalOrders || 0}</strong>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivered Parcels</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.deliveredOrders || 0}</div>
          <div className="text-xs text-slate-500 mt-1">
            Cancelled / Returned: <span className="text-rose-600 font-bold">{stats?.cancelledOrders || 0}</span>
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            PKR {(stats?.totalCollectedRevenue || 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            In Transit / Pending: PKR {(stats?.totalPendingRevenue || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Warnings & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Low Stock Alerts */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Low Stock Warnings ({lowStockProducts.length})</h3>
            </div>
            <button
              onClick={() => onSelectTab('shop-inventory')}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              Inventory Hub
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              All spare parts have healthy inventory levels above their reorder thresholds.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {lowStockProducts.map(p => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-3">
                    <div className="font-bold text-slate-900 truncate">{p.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{p.sku} • {p.categoryName}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                    p.stockQuantity === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.stockQuantity === 0 ? 'Out of Stock' : `${p.stockQuantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Customer Orders */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
            </div>
            <button
              onClick={() => onSelectTab('shop-orders')}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              View All Orders
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No online orders have been placed yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map(ord => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-red-600">{ord.orderNumber}</div>
                    <div className="font-medium text-slate-900">{ord.customer.fullName} ({ord.customer.city})</div>
                    <div className="text-[11px] text-slate-400">{ord.items.length} items • PKR {ord.pricing.total.toLocaleString()}</div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{ord.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
