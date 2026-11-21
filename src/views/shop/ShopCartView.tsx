/**
 * Hamza Autos - Public Shopping Cart View
 * Item quantity adjustments, stock limit validations, free shipping threshold progress, and subtotal calculation
 */

import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ShopService } from '../../services/shopService';
import { ShopShippingSettings } from '../../types/shop';

interface ShopCartViewProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const ShopCartView: React.FC<ShopCartViewProps> = ({ onNavigate }) => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, itemCount } = useCart();
  const [shippingConfig, setShippingConfig] = useState<ShopShippingSettings | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadShipping() {
      try {
        const config = await ShopService.getShippingSettings();
        setShippingConfig(config);
      } catch (err) {
        console.error('Error loading shipping settings:', err);
      }
    }
    loadShipping();
  }, []);

  const freeThreshold = shippingConfig?.freeShippingThreshold || 3500;
  const remainingForFreeShipping = Math.max(0, freeThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const estimatedDelivery = subtotal >= freeThreshold 
    ? 0 
    : (shippingConfig?.defaultShippingFee || 250);

  const finalTotal = subtotal + estimatedDelivery;

  const handleQuantityChange = (productId: string, newQty: number) => {
    const res = updateQuantity(productId, newQty);
    if (!res.success && res.message) {
      setErrorNotice(res.message);
      setTimeout(() => setErrorNotice(null), 3500);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full bg-slate-50 min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-500 mb-6">
            Looks like you haven't added any motorcycle spare parts or accessories yet. Browse our Badami Bagh catalog with verified fitments!
          </p>
          <button
            onClick={() => onNavigate('shop-products')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors shadow-md shadow-red-600/20 cursor-pointer"
          >
            Browse Spare Parts Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8">
      {/* Toast Alert */}
      {errorNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-rose-700 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
          <span className="text-sm font-medium">{errorNotice}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-2">
            <button onClick={() => onNavigate('home')} className="hover:text-red-600 cursor-pointer">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('shop')} className="hover:text-red-600 cursor-pointer">Shop</button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Shopping Cart</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <div className="flex items-center gap-2 text-slate-800">
              <Truck className="w-4 h-4 text-red-600" />
              {remainingForFreeShipping > 0 ? (
                <span>Add <strong className="text-red-600">PKR {remainingForFreeShipping.toLocaleString()}</strong> more for FREE Pakistan-wide delivery!</span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Congratulations! You unlocked FREE Delivery Across Pakistan.
                </span>
              )}
            </div>
            <span className="text-slate-500">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ITEMS LIST (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900">Cart Items</h2>
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold cursor-pointer transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.productId} className="py-4.5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div 
                    onClick={() => onNavigate('shop-product', item.slug)}
                    className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100 cursor-pointer"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Title & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono text-slate-400 font-semibold">{item.sku}</div>
                    <h3 
                      onClick={() => onNavigate('shop-product', item.slug)}
                      className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.name}
                    </h3>
                    {item.selectedCompatibility && (
                      <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        Fitment: {item.selectedCompatibility}
                      </span>
                    )}
                    <div className="text-xs font-semibold text-slate-500 mt-1">
                      PKR {item.unitPrice.toLocaleString()} each
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Total & Remove */}
                    <div className="text-right min-w-[5.5rem]">
                      <div className="text-sm font-extrabold text-slate-900">
                        PKR {(item.unitPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('shop-products')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>

          {/* ORDER SUMMARY (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5 sticky top-24">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({itemCount})</span>
                <span className="font-bold text-slate-900">PKR {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Nationwide Shipping</span>
                <span className={`font-bold ${estimatedDelivery === 0 ? 'text-emerald-700 font-extrabold' : 'text-slate-900'}`}>
                  {estimatedDelivery === 0 ? 'FREE' : `PKR ${estimatedDelivery.toLocaleString()}`}
                </span>
              </div>

              {estimatedDelivery === 0 && (
                <div className="p-2 bg-emerald-50 rounded-lg text-[11px] text-emerald-800 font-medium">
                  Free delivery applied for order above PKR {freeThreshold.toLocaleString()}!
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900">Total Amount:</span>
                <span className="text-xl font-black text-slate-900">
                  PKR {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => onNavigate('shop-checkout')}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Reassurance */}
            <div className="pt-2 space-y-2 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cash on Delivery (COD) available across Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Dispatched securely via TCS, Leopards or M&amp;P</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
