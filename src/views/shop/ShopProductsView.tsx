/**
 * Hamza Autos - Public Shop Products Catalog & Search View
 * Comprehensive multi-faceted filtering by Motorcycle Brand/Model Compatibility, Category, Price, Stock
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ShoppingBag, 
  SlidersHorizontal, 
  CheckCircle2, 
  Bike, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { ShopProduct, ShopCategory, MotorcycleModelSpec } from '../../types/shop';
import { ShopService } from '../../services/shopService';
import { useCart } from '../../context/CartContext';

interface ShopProductsViewProps {
  onNavigate: (view: string, slug?: string) => void;
  initialQueryString?: string;
}

export const ShopProductsView: React.FC<ShopProductsViewProps> = ({ 
  onNavigate, 
  initialQueryString 
}) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [bikeModels, setBikeModels] = useState<MotorcycleModelSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBikeBrand, setSelectedBikeBrand] = useState('');
  const [selectedBikeModel, setSelectedBikeModel] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Parse initial query params from props if present
  useEffect(() => {
    if (initialQueryString) {
      const params = new URLSearchParams(initialQueryString);
      if (params.get('search')) setSearch(params.get('search')!);
      if (params.get('category')) setSelectedCategory(params.get('category')!);
      if (params.get('bikeBrand')) setSelectedBikeBrand(params.get('bikeBrand')!);
      if (params.get('bikeModel')) setSelectedBikeModel(params.get('bikeModel')!);
      if (params.get('featuredOnly') === 'true') setSortBy('popular');
      if (params.get('sort')) setSortBy(params.get('sort')!);
    }
  }, [initialQueryString]);

  // Load initial categories & models once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, models] = await Promise.all([
          ShopService.getCategories(),
          ShopService.getBrandsAndModels()
        ]);
        setCategories(cats);
        setBikeModels(models);
      } catch (err) {
        console.error('Error loading shop metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch products whenever filters or sort change
  useEffect(() => {
    let isMounted = true;
    async function fetchFiltered() {
      try {
        setLoading(true);
        const res = await ShopService.getProducts({
          search: search.trim() || undefined,
          category: selectedCategory || undefined,
          bikeBrand: selectedBikeBrand || undefined,
          bikeModel: selectedBikeModel || undefined,
          condition: selectedCondition || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          inStockOnly: inStockOnly || undefined,
          sort: sortBy
        });
        if (isMounted) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFiltered();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    search, 
    selectedCategory, 
    selectedBikeBrand, 
    selectedBikeModel, 
    selectedCondition, 
    minPrice, 
    maxPrice, 
    inStockOnly, 
    sortBy
  ]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBikeBrand('');
    setSelectedBikeModel('');
    setSelectedCondition('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  const handleAddToCart = (product: ShopProduct) => {
    const res = addToCart(product, 1);
    setAddedNotice(res.message);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const uniqueBikeBrands = Array.from(new Set(bikeModels.map(m => m.brand)));
  const availableModelsForSelectedBrand = selectedBikeBrand
    ? bikeModels.filter(m => m.brand === selectedBikeBrand)
    : [];

  const hasActiveFilters = !!(
    search || 
    selectedCategory || 
    selectedBikeBrand || 
    selectedBikeModel || 
    selectedCondition || 
    minPrice || 
    maxPrice || 
    inStockOnly
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{addedNotice}</span>
          <button 
            onClick={() => onNavigate('shop-cart')} 
            className="ml-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Cart
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-2">
            <button onClick={() => onNavigate('home')} className="hover:text-red-600 cursor-pointer">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('shop')} className="hover:text-red-600 cursor-pointer">Shop</button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Spare Parts Catalog</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Motorcycle Spare Parts &amp; Accessories
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Showing {products.length} verified products available for all Pakistan delivery
              </p>
            </div>

            {/* Mobile Filter Trigger */}
            <div className="flex items-center gap-3 sm:hidden">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-2xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-red-600" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Best Selling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar & Desktop Sort Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part name, SKU, or keyword..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Popularity &amp; Best Sellers</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-red-50/70 rounded-xl border border-red-200/60">
            <span className="text-xs font-bold text-red-900">Active Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs text-slate-700">
                Search: "{search}"
                <button onClick={() => setSearch('')}><X className="w-3 h-3 text-slate-400 hover:text-red-600" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs text-slate-700">
                Category: {categories.find(c => c.slug === selectedCategory || c.id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 text-slate-400 hover:text-red-600" /></button>
              </span>
            )}
            {selectedBikeBrand && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs text-slate-700">
                Brand: {selectedBikeBrand}
                <button onClick={() => { setSelectedBikeBrand(''); setSelectedBikeModel(''); }}><X className="w-3 h-3 text-slate-400 hover:text-red-600" /></button>
              </span>
            )}
            {selectedBikeModel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs text-slate-700">
                Model: {selectedBikeModel}
                <button onClick={() => setSelectedBikeModel('')}><X className="w-3 h-3 text-slate-400 hover:text-red-600" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs text-slate-700">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 text-slate-400 hover:text-red-600" /></button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-600 hover:underline ml-auto flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Main Content: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 items-start">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Filter Products</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* 1. MOTORCYCLE COMPATIBILITY FILTER */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Bike className="w-3.5 h-3.5 text-red-600" />
                <span>Bike Compatibility</span>
              </label>

              {/* Bike Brand */}
              <div>
                <select
                  value={selectedBikeBrand}
                  onChange={(e) => {
                    setSelectedBikeBrand(e.target.value);
                    setSelectedBikeModel('');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- All Bike Brands --</option>
                  {uniqueBikeBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Bike Model */}
              {selectedBikeBrand && (
                <div>
                  <select
                    value={selectedBikeModel}
                    onChange={(e) => setSelectedBikeModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">-- All {selectedBikeBrand} Models --</option>
                    {availableModelsForSelectedBrand.map((m) => (
                      <option key={m.id} value={m.modelName}>
                        {m.modelName} ({m.engineCc})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 2. CATEGORIES FILTER */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Categories
              </label>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    selectedCategory === ''
                      ? 'bg-red-50 text-red-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(selectedCategory === c.slug ? '' : c.slug)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === c.slug || selectedCategory === c.id
                        ? 'bg-red-50 text-red-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">({c.productCount || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. PRICE RANGE FILTER */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Price (PKR)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* 4. IN STOCK ONLY TOGGLE */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                />
                <span>In-Stock Only</span>
              </label>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="min-h-[40vh] flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 rounded-full border-3 border-red-600 border-t-transparent animate-spin mb-3" />
                <p className="text-xs text-slate-500 font-medium">Loading genuine spare parts...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
                <div className="w-14 h-14 bg-red-50 rounded-2xl text-red-600 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                  We could not find any spare parts matching your current filters. Try resetting the motorcycle model or category filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    {/* Top Image & Badge */}
                    <div 
                      onClick={() => onNavigate('shop-product', product.slug)}
                      className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={product.images[0]?.url || '/assets/images/services/motorcycle-spare-parts.webp'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.discountedPrice && (
                        <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                          SAVE PKR {product.price - product.discountedPrice}
                        </span>
                      )}
                      <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs ${
                        product.stockQuantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                          <span className="uppercase tracking-wider truncate max-w-[65%]">{product.categoryName}</span>
                          <span className="font-mono text-slate-500">{product.sku}</span>
                        </div>

                        <h3 
                          onClick={() => onNavigate('shop-product', product.slug)}
                          className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer mb-2"
                        >
                          {product.name}
                        </h3>

                        {/* Compatible bikes */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.compatibleBikes.slice(0, 2).map((cb, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
                              {cb.brand} {cb.model}
                            </span>
                          ))}
                          {product.compatibleBikes.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{product.compatibleBikes.length - 2}</span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                          {product.discountedPrice ? (
                            <div className="text-[11px] text-slate-400 line-through">
                              PKR {product.price.toLocaleString()}
                            </div>
                          ) : null}
                          <div className="text-base font-extrabold text-slate-900">
                            PKR {(product.discountedPrice || product.price).toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stockQuantity <= 0}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            product.stockQuantity > 0
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-2xs'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{product.stockQuantity > 0 ? 'Add' : 'Out'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900">Filter Spare Parts</h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Bike filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase">Bike Compatibility</label>
              <select
                value={selectedBikeBrand}
                onChange={(e) => {
                  setSelectedBikeBrand(e.target.value);
                  setSelectedBikeModel('');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="">-- All Bike Brands --</option>
                {uniqueBikeBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              {selectedBikeBrand && (
                <select
                  value={selectedBikeModel}
                  onChange={(e) => setSelectedBikeModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="">-- All Models --</option>
                  {availableModelsForSelectedBrand.map(m => (
                    <option key={m.id} value={m.modelName}>{m.modelName}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Mobile Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              >
                <option value="">-- All Categories --</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={handleClearFilters}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
