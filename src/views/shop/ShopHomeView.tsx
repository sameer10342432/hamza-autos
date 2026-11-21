/**
 * Hamza Autos - Public Shop Homepage View
 * Online Motorcycle Spare Parts & Accessories Store (All Pakistan Delivery)
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  Filter, 
  Bike, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles,
  PhoneCall,
  Wrench,
  Percent,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { ShopProduct, ShopCategory, MotorcycleModelSpec } from '../../types/shop';
import { ShopService } from '../../services/shopService';
import { useCart } from '../../context/CartContext';

interface ShopHomeViewProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const ShopHomeView: React.FC<ShopHomeViewProps> = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [bikeModels, setBikeModels] = useState<MotorcycleModelSpec[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ShopProduct[]>([]);
  const [latestProducts, setLatestProducts] = useState<ShopProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Bike Selector State
  const [selectedBrand, setSelectedBrand] = useState<string>('Honda');
  const [selectedModel, setSelectedModel] = useState<string>('CD 70');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadShopData() {
      try {
        setLoading(true);
        const [cats, models, sets] = await Promise.all([
          ShopService.getCategories(),
          ShopService.getBrandsAndModels(),
          ShopService.getFeaturedAndLatest()
        ]);
        setCategories(cats);
        setBikeModels(models);
        setFeaturedProducts(sets.featured);
        setLatestProducts(sets.latest);
        setBestSellers(sets.bestSellers);
      } catch (err) {
        console.error('Error loading shop homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop-products', `search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('shop-products');
    }
  };

  const handleBikeFilterSubmit = () => {
    if (selectedModel) {
      onNavigate('shop-products', `bikeBrand=${encodeURIComponent(selectedBrand)}&bikeModel=${encodeURIComponent(selectedModel)}`);
    } else {
      onNavigate('shop-products', `bikeBrand=${encodeURIComponent(selectedBrand)}`);
    }
  };

  const handleAddToCart = (product: ShopProduct) => {
    const res = addToCart(product, 1);
    setAddedNotice(res.message);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  // Filter models for selected brand
  const filteredModels = bikeModels.filter(m => m.brand === selectedBrand);

  const uniqueBrands = Array.from(new Set(bikeModels.map(m => m.brand)));

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Toast notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{addedNotice}</span>
          <button 
            onClick={() => onNavigate('shop-cart')} 
            className="ml-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white overflow-hidden py-12 lg:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide uppercase">
                <Truck className="w-3.5 h-3.5" />
                <span>Nationwide Pakistan Delivery • Cash on Delivery</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Genuine Motorcycle Spare Parts, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
                  Direct From Badami Bagh
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0">
                Pakistan’s premier online spare parts catalog for Honda, Yamaha, Suzuki, United &amp; Road Prince. Guaranteed authentic components with door-to-door courier tracking across all provinces.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden p-1.5 border-2 border-slate-700/50 focus-within:border-red-500 transition-colors">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by part name, SKU, or motorcycle model (e.g. CD70 Brake Shoe)..."
                    className="w-full px-3 py-2 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Popular:</span>
                {['Honda CD 70 Cylinder', 'CG 125 Clutch Plates', '428H Chain Kit', 'Keihin Carburetor', '12V Battery'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onNavigate('shop-products', `search=${encodeURIComponent(tag)}`)}
                    className="hover:text-red-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700 cursor-pointer transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Quick Bike Compatibility Selector Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-200 text-slate-900">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Shop by Motorcycle Model</h2>
                    <p className="text-xs text-slate-500">Show only 100% verified compatible parts</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Select Brand */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      1. Select Motorcycle Brand
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        const first = bikeModels.find(m => m.brand === e.target.value);
                        setSelectedModel(first ? first.modelName : '');
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                    >
                      {uniqueBrands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Model */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      2. Select Model / Displacement
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                    >
                      {filteredModels.map((m) => (
                        <option key={m.id} value={m.modelName}>
                          {m.modelName} ({m.engineCc})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Find Parts CTA */}
                  <button
                    onClick={handleBikeFilterSubmit}
                    className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Find Parts for {selectedBrand} {selectedModel}</span>
                  </button>
                </div>

                {/* Trust mini-badges */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No Fitment Guesswork</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                    <span>Genuine OEM / Tested</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STRIP */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">All Pakistan Delivery</h3>
                <p className="text-[11px] text-slate-500">TCS, Leopards, M&amp;P &amp; Express</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Cash on Delivery (COD)</h3>
                <p className="text-[11px] text-slate-500">Pay when your parcel arrives</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">7-Day Inspection Policy</h3>
                <p className="text-[11px] text-slate-500">Uninstalled parts return</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">WhatsApp Fitment Help</h3>
                <p className="text-[11px] text-slate-500">Talk directly to Master Mechanic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES GRID */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Browse by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Genuine and heavy-duty parts categorized for easy searching</p>
          </div>
          <button
            onClick={() => onNavigate('shop-products')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('shop-products', `category=${encodeURIComponent(cat.slug)}`)}
              className="group bg-white rounded-xl border border-slate-200/90 hover:border-red-500 p-3 text-center transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col items-center justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-red-50 text-slate-700 group-hover:text-red-600 flex items-center justify-center mb-2.5 transition-colors overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-red-600 line-clamp-2 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-1">
                {cat.productCount ? `${cat.productCount} parts` : 'View parts'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-10 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">Recommended</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Featured High-Demand Parts</h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">Popular workshop-verified parts ready for same-day dispatch</p>
            </div>
            <button
              onClick={() => onNavigate('shop-products', 'featuredOnly=true')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 cursor-pointer"
            >
              <span>See All Featured</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
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
                    <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      SAVE PKR {product.price - product.discountedPrice}
                    </span>
                  )}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    product.stockQuantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                      {product.categoryName} • {product.brand}
                    </div>

                    <h3 
                      onClick={() => onNavigate('shop-product', product.slug)}
                      className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer mb-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Compatible bikes tag */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.compatibleBikes.slice(0, 2).map((cb, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                          {cb.brand} {cb.model}
                        </span>
                      ))}
                      {product.compatibleBikes.length > 2 && (
                        <span className="text-[10px] text-slate-400">+{product.compatibleBikes.length - 2} more</span>
                      )}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-xs text-slate-400 line-through">
                        {product.discountedPrice ? `PKR ${product.price.toLocaleString()}` : ''}
                      </div>
                      <div className="text-base font-extrabold text-slate-900">
                        PKR {(product.discountedPrice || product.price).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity <= 0}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        product.stockQuantity > 0
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NATIONWIDE SHOPPING GUIDANCE & ASSISTANCE */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unsure About Fitment? Avoid Buying Wrong Parts</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  Send Your Old Part Photo on WhatsApp for Instant Verification
                </h2>
                <p className="text-slate-300 text-sm max-w-2xl">
                  Pakistani motorcycles often have slight carburetor, brake drum, and wiring differences across manufacturing years. Our Master Mechanics at Badami Bagh will inspect your part photo and recommend the exact match.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="https://wa.me/923251814548?text=Assalam-o-Alaikum%20Hamza%20Autos,%20I%20need%20help%20checking%20part%20compatibility%20for%20my%20bike."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Mechanic Help (+92 325 1814548)</span>
                  </a>
                  <button
                    onClick={() => onNavigate('shop-products')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl border border-slate-700 text-sm transition-colors cursor-pointer"
                  >
                    Browse All Products
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-xs space-y-3">
                <h4 className="font-bold text-white text-sm">Delivery Commitment Across Pakistan:</h4>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Lahore:</strong> Same-Day / Next-Day Delivery via Hamza Autos Rider (PKR 150)</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Punjab &amp; Federal:</strong> 1 to 2 business days via TCS / Leopards</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sindh, KPK &amp; Balochistan:</strong> 2 to 4 business days with tracking</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Free Delivery:</strong> On all orders above PKR 3,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST ARRIVALS */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Latest Stock &amp; Accessories</h2>
            <p className="text-sm text-slate-500 mt-1">Recently arrived authentic Pakistani commuter motorcycle parts</p>
          </div>
          <button
            onClick={() => onNavigate('shop-products', 'sort=newest')}
            className="text-sm font-bold text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {latestProducts.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div 
                onClick={() => onNavigate('shop-product', product.slug)}
                className="aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]?.url || '/assets/images/services/motorcycle-spare-parts.webp'}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">
                    {product.brand} • {product.condition}
                  </div>
                  <h3 
                    onClick={() => onNavigate('shop-product', product.slug)}
                    className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-2 cursor-pointer mb-2"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-base font-extrabold text-slate-900">
                    PKR {(product.discountedPrice || product.price).toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-slate-900 hover:bg-red-600 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
                    title="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
