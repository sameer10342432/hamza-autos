/**
 * Hamza Autos - Public Product Details View
 * Authentic Specifications, Multi-image Gallery, Verified Bike Compatibility & Pakistan Delivery
 */

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Bike, 
  MessageCircle, 
  ArrowLeft, 
  Clock, 
  Share2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  PackageCheck,
  Star,
  RefreshCw
} from 'lucide-react';
import { ShopProduct } from '../../types/shop';
import { ShopService } from '../../services/shopService';
import { useCart } from '../../context/CartContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  onNavigate: (view: string, slug?: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ProductErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ProductDetail rendering error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to Display Product Details</h2>
          <p className="text-xs text-slate-500 mb-6">
            We encountered a temporary display issue with this item. Please try refreshing or browse other parts.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => this.props.onNavigate('shop-products')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ShopProductDetailViewProps {
  slug: string;
  onNavigate: (view: string, slug?: string) => void;
}

const ProductDetailContent: React.FC<ShopProductDetailViewProps> = ({ 
  slug, 
  onNavigate 
}) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [related, setRelated] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedCompatibility, setSelectedCompatibility] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await ShopService.getProduct(slug);
        setProduct(res.data);
        setRelated(res.related || []);
        if (res.data.compatibleBikes.length > 0) {
          const first = res.data.compatibleBikes[0];
          setSelectedCompatibility(`${first.brand} ${first.model}`);
        }
      } catch (err: any) {
        setError(err.message || 'Product could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadProduct();
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const res = addToCart(product, quantity, selectedCompatibility);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const res = addToCart(product, quantity, selectedCompatibility);
    if (res.success) {
      onNavigate('shop-checkout');
    } else {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const getWhatsAppEnquiryLink = () => {
    if (!product) return 'https://wa.me/923251814548';
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Hamza Autos,\n\nI am inquiring about this spare part on your website:\n*Product:* ${product.name}\n*SKU:* ${product.sku}\n*Price:* PKR ${(product.discountedPrice || product.price).toLocaleString()}\n*My Motorcycle:* ${selectedCompatibility || 'Not specified'}\n\nCould you please verify availability and dispatch schedule? Thank you!`
    );
    return `https://wa.me/923251814548?text=${text}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 bg-slate-50">
        <div className="w-10 h-10 rounded-full border-3 border-red-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading spare part details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[50vh] max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'The requested spare part could not be located in our catalog.'}</p>
        <button
          onClick={() => onNavigate('shop-products')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Return to Spare Parts Store
        </button>
      </div>
    );
  }

  const primaryImage = product.images[selectedImageIndex] || product.images[0] || {
    url: '/assets/images/services/motorcycle-spare-parts.webp',
    alt: product.name
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button 
            onClick={() => onNavigate('shop-cart')} 
            className="ml-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Go to Cart
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-red-600 cursor-pointer">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('shop')} className="hover:text-red-600 cursor-pointer">Shop</button>
          <span>/</span>
          <button 
            onClick={() => onNavigate('shop-products', `category=${encodeURIComponent(product.categoryId)}`)} 
            className="hover:text-red-600 cursor-pointer"
          >
            {product.categoryName}
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Presentation Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-2xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT: IMAGE GALLERY (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Featured Image */}
              <div className="relative aspect-4/3 sm:aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs flex items-center justify-center">
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/services/motorcycle-spare-parts.webp';
                  }}
                />
                {product.discountedPrice && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                    SAVE PKR {(product.price - product.discountedPrice).toLocaleString()}
                  </span>
                )}
                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-md shadow-xs ${
                  isOutOfStock ? 'bg-rose-100 text-rose-800' : isLowStock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low Stock (${product.stockQuantity} left)` : 'In Stock'}
                </span>
              </div>

              {/* Thumbnails list if multiple images exist */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                        selectedImageIndex === idx ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Authentic Component</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <RotateCcw className="w-4 h-4 text-red-600 shrink-0" />
                  <span>7-Day Inspection Return</span>
                </div>
              </div>
            </div>

            {/* RIGHT: PRODUCT INFO & ORDER ACTIONS (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                    {product.categoryName}
                  </span>
                  <span>•</span>
                  <span>Brand: <strong className="text-slate-900">{product.brand}</strong></span>
                  <span>•</span>
                  <span className="font-mono text-slate-700">SKU: {product.sku}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{product.condition}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800">{product.rating}</span>
                  <span>({product.reviewCount} customer reviews across Pakistan)</span>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 flex items-baseline gap-3">
                  <div className="text-3xl font-black text-slate-900">
                    PKR {(product.discountedPrice || product.price).toLocaleString()}
                  </div>
                  {product.discountedPrice && (
                    <div className="text-sm text-slate-400 line-through">
                      PKR {product.price.toLocaleString()}
                    </div>
                  )}
                  <span className="text-xs text-slate-500 font-medium ml-auto">
                    Inclusive of all Badami Bagh wholesale sourcing taxes
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {product.shortDescription || product.description}
                </p>

                {/* Motorcycle Compatibility Selection */}
                <div className="mb-6 p-4 bg-red-50/60 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-950 uppercase tracking-wider mb-2">
                    <Bike className="w-4 h-4 text-red-600" />
                    <span>Verified Motorcycle Fitment:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.compatibleBikes.map((cb, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCompatibility(`${cb.brand} ${cb.model}`)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                          selectedCompatibility === `${cb.brand} ${cb.model}`
                            ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-red-400'
                        }`}
                      >
                        {cb.brand} {cb.model} {cb.engineCc ? `(${cb.engineCc})` : ''}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Select your motorcycle above to attach fitment verification notes to your order.
                  </p>
                </div>

                {/* Quantity and CTA Buttons */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm font-bold text-slate-900 min-w-[2.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        disabled={quantity >= product.stockQuantity || isOutOfStock}
                        className="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25'
                      }`}
                    >
                      <span>Buy Now</span>
                    </button>
                  </div>

                  {/* WhatsApp Quick Assistance */}
                  <a
                    href={getWhatsAppEnquiryLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Enquire or Order via WhatsApp (+92 325 1814548)</span>
                  </a>
                </div>
              </div>

              {/* Delivery info strip */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Nationwide Delivery:</span>
                    <p className="text-[11px] text-slate-500">2-4 days across Punjab, Sindh, KPK, Balochistan &amp; AJK via TCS/Leopards.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Same-Day Lahore Dispatch:</span>
                    <p className="text-[11px] text-slate-500">Orders placed before 3 PM dispatched same day from Badami Bagh workshop.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Description Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Detailed Description */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Detailed Product Description
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>{product.description}</p>
              {product.warrantyText && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 font-medium">
                  <strong>Warranty Information:</strong> {product.warrantyText}
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Technical Specifications
            </h2>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Manufacturer / Brand</span>
                <span className="text-slate-900 font-bold">{product.brand}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Part Number (SKU)</span>
                <span className="text-slate-900 font-mono font-bold">{product.sku}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Condition</span>
                <span className="text-slate-900 font-bold">{product.condition}</span>
              </div>
              {product.weightKg && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500 font-medium">Parcel Weight</span>
                  <span className="text-slate-900 font-bold">{product.weightKg} kg</span>
                </div>
              )}
              {Object.entries(product.specifications || {}).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between">
                  <span className="text-slate-500 font-medium">{key}</span>
                  <span className="text-slate-900 font-bold text-right ml-4">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Customers Also Purchased for this Motorcycle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => onNavigate('shop-product', rp.slug)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="aspect-4/3 bg-slate-100 rounded-xl overflow-hidden mb-3">
                    <img
                      src={rp.images[0]?.url || '/assets/images/services/motorcycle-spare-parts.webp'}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{rp.brand}</span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 line-clamp-2 transition-colors mb-2">
                      {rp.name}
                    </h4>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">
                      PKR {(rp.discountedPrice || rp.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-red-600 font-bold">View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ShopProductDetailView: React.FC<ShopProductDetailViewProps> = (props) => {
  return (
    <ProductErrorBoundary onNavigate={props.onNavigate}>
      <ProductDetailContent {...props} />
    </ProductErrorBoundary>
  );
};
