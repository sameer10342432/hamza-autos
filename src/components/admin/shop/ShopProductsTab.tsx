/**
 * Hamza Autos - Admin Products Management Tab
 * Full product catalog table with live search, stock alerts, edit/delete actions, and add product modal
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Filter,
  CheckCircle2,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { ShopProduct, ShopCategory, MotorcycleModelSpec } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';
import { ShopProductModal } from './ShopProductModal';

interface ShopProductsTabProps {
  onNavigatePublic?: (view: string, slug?: string) => void;
}

export const ShopProductsTab: React.FC<ShopProductsTabProps> = ({ onNavigatePublic }) => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [bikeModels, setBikeModels] = useState<MotorcycleModelSpec[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats, models] = await Promise.all([
        ShopService.getAdminProducts(),
        ShopService.getCategories(),
        ShopService.getBrandsAndModels()
      ]);
      setProducts(prods);
      setCategories(cats);
      setBikeModels(models);
    } catch (err) {
      console.error('Error loading products table:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProduct = async (data: Partial<ShopProduct>) => {
    if (editingProduct) {
      await ShopService.updateAdminProduct(editingProduct.id, data);
      setToast(`Updated "${data.name || editingProduct.name}".`);
    } else {
      await ShopService.createAdminProduct(data);
      setToast(`Created product "${data.name}".`);
    }
    setTimeout(() => setToast(null), 3000);
    await loadData();
  };

  const handleDeleteProduct = async (product: ShopProduct) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${product.name}" (${product.sku})?`)) {
      return;
    }
    try {
      await ShopService.deleteAdminProduct(product.id);
      setToast(`Deleted "${product.name}".`);
      setTimeout(() => setToast(null), 3000);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting product.');
    }
  };

  const handleTogglePublish = async (product: ShopProduct) => {
    try {
      const next = !product.isPublished;
      await ShopService.updateAdminProduct(product.id, { isPublished: next });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isPublished: next } : p));
      setToast(`${next ? 'Published' : 'Unpublished'} "${product.name}".`);
      setTimeout(() => setToast(null), 2500);
    } catch (err: any) {
      alert(err.message || 'Error toggling publish state.');
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const match = p.name.toLowerCase().includes(q) || 
                    p.sku.toLowerCase().includes(q) || 
                    p.categoryName.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCat && p.categoryId !== selectedCat) return false;
    if (stockFilter === 'out-of-stock' && p.stockQuantity > 0) return false;
    if (stockFilter === 'low-stock' && (p.stockQuantity <= 0 || p.stockQuantity > p.lowStockThreshold)) return false;
    if (stockFilter === 'in-stock' && p.stockQuantity <= p.lowStockThreshold) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Spare Parts Products Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">Manage SKUs, stock levels, motorcycle fitment, and prices in PKR</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, title, or brand..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Category & Stock Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in-stock">In Stock (Healthy)</option>
            <option value="low-stock">Low Stock Alerts</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product &amp; SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (PKR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Fitments</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading catalog products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.stockQuantity <= 0;
                  const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                            <img 
                              src={p.images[0]?.url || '/assets/images/services/motorcycle-spare-parts.webp'} 
                              alt={p.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-slate-900 truncate" title={p.name}>{p.name}</div>
                            <div className="font-mono text-[11px] text-slate-400 font-bold">{p.sku} • {p.brand}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {p.categoryName}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        PKR {(p.discountedPrice || p.price).toLocaleString()}
                        {p.discountedPrice && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            PKR {p.price.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          isOut ? 'bg-rose-100 text-rose-800' :
                          isLow ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stockQuantity} {isOut ? '(Out)' : isLow ? '(Low)' : 'units'}
                        </span>
                      </td>

                      {/* Compatible Bikes */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.compatibleBikes.slice(0, 2).map((cb, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">
                              {cb.brand} {cb.model}
                            </span>
                          ))}
                          {p.compatibleBikes.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{p.compatibleBikes.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Published */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            p.isPublished 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
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

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <ShopProductModal
          product={editingProduct}
          categories={categories}
          bikeModels={bikeModels}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
