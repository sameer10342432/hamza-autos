/**
 * Hamza Autos - Public Shop Checkout View
 * Pakistan-wide delivery address capture, searchable cities, COD & Meezan Bank transfer, and order placement
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Lock, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ShopService } from '../../services/shopService';
import { 
  PAKISTAN_PROVINCES, 
  PAKISTAN_CITIES, 
  PakistanCityInfo 
} from '../../data/pakistanLocations';
import { PakistaniProvince, ShopShippingSettings, ShopSettings } from '../../types/shop';

interface ShopCheckoutViewProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const ShopCheckoutView: React.FC<ShopCheckoutViewProps> = ({ onNavigate }) => {
  const { items, subtotal, clearCart, itemCount } = useCart();

  const [shippingConfig, setShippingConfig] = useState<ShopShippingSettings | null>(null);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState<PakistaniProvince>('Punjab');
  const [city, setCity] = useState('Lahore');
  const [citySearch, setCitySearch] = useState('Lahore');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery (COD)' | 'Bank Transfer / Manual Payment'>('Cash on Delivery (COD)');
  const [paymentReference, setPaymentReference] = useState('');

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const [shipping, settings] = await Promise.all([
          ShopService.getShippingSettings(),
          ShopService.getShopSettings()
        ]);
        setShippingConfig(shipping);
        setShopSettings(settings);
      } catch (err) {
        console.error('Error loading checkout configurations:', err);
      }
    }
    loadConfig();
  }, []);

  // Filter cities by selected province
  const availableCities = PAKISTAN_CITIES.filter(c => c.province === province);

  // Auto-switch province when selecting city
  const handleCitySelect = (selectedCityName: string) => {
    setCity(selectedCityName);
    setCitySearch(selectedCityName);
    const found = PAKISTAN_CITIES.find(c => c.name.toLowerCase() === selectedCityName.toLowerCase());
    if (found) {
      setProvince(found.province);
    }
  };

  // Calculate Shipping Fee
  const freeThreshold = shippingConfig?.freeShippingThreshold || 3500;
  let calculatedShipping = 250;

  if (subtotal >= freeThreshold) {
    calculatedShipping = 0;
  } else if (city.toLowerCase() === 'lahore') {
    calculatedShipping = shippingConfig?.lahoreExpressDeliveryFee || 150;
  } else if (shippingConfig?.specialCityRates && shippingConfig.specialCityRates[city]) {
    calculatedShipping = shippingConfig.specialCityRates[city];
  } else {
    calculatedShipping = shippingConfig?.defaultShippingFee || 250;
  }

  const finalTotal = subtotal + calculatedShipping;

  // Validation
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 12) {
      setErrorMessage('Please enter a valid Pakistani mobile number (e.g. 0321-1234567).');
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      setErrorMessage('Please enter your complete street address (House/Shop #, Street, Area) for courier delivery.');
      return;
    }

    if (!city.trim()) {
      setErrorMessage('Please select your destination city.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        customer: {
          fullName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          whatsappNumber: sameAsMobile ? mobileNumber.trim() : (whatsappNumber.trim() || mobileNumber.trim()),
          email: email.trim() || undefined,
          deliveryAddress: deliveryAddress.trim(),
          city: city.trim(),
          province,
          postalCode: postalCode.trim() || undefined,
          orderNotes: orderNotes.trim() || undefined
        },
        items,
        paymentMethod,
        paymentReference: paymentMethod === 'Bank Transfer / Manual Payment' ? paymentReference.trim() : undefined,
        orderNotes: orderNotes.trim() || undefined
      };

      const result = await ShopService.placeOrder(payload);

      // Order placed! Clear cart and navigate to confirmation
      clearCart();
      onNavigate('shop-order-confirmation', result.orderNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full bg-slate-50 min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Cart is empty</h2>
          <p className="text-xs text-slate-500 mb-6">Please add items to cart before proceeding to checkout.</p>
          <button
            onClick={() => onNavigate('shop-products')}
            className="w-full bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const bank = shopSettings?.bankDetails || {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Hamza Autos Spare Parts Trading',
    accountNumber: '02130105829101',
    iban: 'PK78MEZN0002130105829101',
    branchName: 'Badami Bagh Branch, Lahore',
    easypaisaNumber: '0325-1814548',
    jazzcashNumber: '0325-1814548'
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-2">
            <button onClick={() => onNavigate('home')} className="hover:text-red-600 cursor-pointer">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('shop')} className="hover:text-red-600 cursor-pointer">Shop</button>
            <span>/</span>
            <button onClick={() => onNavigate('shop-cart')} className="hover:text-red-600 cursor-pointer">Cart</button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Checkout</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Checkout &amp; Shipping Details
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Direct Guest Checkout</span>
            </span>
          </div>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Grid: Checkout Form (8 cols) + Order Review (4 cols) */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CUSTOMER & DELIVERY FORM (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Customer Information */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-black text-xs flex items-center justify-center shrink-0">1</span>
                <h2 className="text-base font-extrabold text-slate-900">Customer &amp; Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Usman"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number (for Courier SMS) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 0321-1234567"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">WhatsApp Number</label>
                    <label className="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={(e) => setSameAsMobile(e.target.checked)}
                        className="rounded text-red-600"
                      />
                      <span>Same as mobile</span>
                    </label>
                  </div>
                  {!sameAsMobile && (
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 0300-7654321"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                    />
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional for invoice)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. usman@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Nationwide Delivery Address */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-black text-xs flex items-center justify-center shrink-0">2</span>
                <h2 className="text-base font-extrabold text-slate-900">Delivery Address in Pakistan</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Province */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Province / Region <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={province}
                    onChange={(e) => {
                      const newProv = e.target.value as PakistaniProvince;
                      setProvince(newProv);
                      const firstCity = PAKISTAN_CITIES.find(c => c.province === newProv);
                      if (firstCity) {
                        setCity(firstCity.name);
                        setCitySearch(firstCity.name);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {PAKISTAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / District <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {availableCities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} {c.majorHub ? '(Major Hub)' : ''}
                      </option>
                    ))}
                    {/* Fallback option if user city is not in curated list */}
                    <option value="Other City in Pakistan">Other City / Tehsil</option>
                  </select>
                </div>

                {/* Complete Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Complete Street Address (House/Shop #, Street, Mohalla / Sector) <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. House No. 14, Street 3, Block B, Model Town"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                {/* Order Special Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Courier Delivery Instructions / Motorcycle Year Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, my bike is 2021 Honda CG125 Euro 2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-black text-xs flex items-center justify-center shrink-0">3</span>
                <h2 className="text-base font-extrabold text-slate-900">Payment Option</h2>
              </div>

              <div className="space-y-3">
                {/* Option 1: Cash on Delivery */}
                <label className={`block border rounded-2xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery (COD)' 
                    ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery (COD)'}
                      onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                      className="text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Most Popular</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Hand over cash to the courier rider upon parcel delivery at your doorstep.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 2: Bank Transfer / Manual */}
                <label className={`block border rounded-2xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer / Manual Payment' 
                    ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bank Transfer / Manual Payment'}
                      onChange={() => setPaymentMethod('Bank Transfer / Manual Payment')}
                      className="text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">Direct Bank Transfer / Easypaisa / Jazzcash</span>
                        <span className="text-[11px] text-slate-500">Fast Verification</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Transfer via online banking or mobile wallet to Hamza Autos account.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Bank Account Details Box when selected */}
                {paymentMethod === 'Bank Transfer / Manual Payment' && (
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 text-xs space-y-3 animate-fade-in mt-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800 pb-2">
                      <Building2 className="w-4 h-4" />
                      <span>Hamza Autos Official Bank Account Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Bank Name</span>
                        <strong className="text-white">{bank.bankName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Account Title</span>
                        <strong className="text-white">{bank.accountTitle}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Account Number</span>
                        <strong className="text-white font-mono">{bank.accountNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">IBAN</span>
                        <strong className="text-white font-mono text-[11px]">{bank.iban}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <label className="block text-slate-300 font-semibold mb-1">
                        Transaction Reference / TID (Optional now, can also send via WhatsApp):
                      </label>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="e.g. Meezan Ref: 8947289 or Easypaisa TID"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ORDER REVIEW & PLACE ORDER CTA (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5 sticky top-24">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Order Review ({itemCount} {itemCount === 1 ? 'part' : 'parts'})
            </h2>

            {/* Mini Items List */}
            <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="pr-3 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.quantity} x PKR {item.unitPrice.toLocaleString()}
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    PKR {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">PKR {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery to {city}</span>
                <span className={`font-bold ${calculatedShipping === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {calculatedShipping === 0 ? 'FREE' : `PKR ${calculatedShipping.toLocaleString()}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">Total Payable:</span>
                <span className="text-2xl font-black text-slate-900">
                  PKR {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg shadow-red-600/25 text-white flex items-center justify-center gap-2 cursor-pointer transition-all ${
                submitting 
                  ? 'bg-slate-400 cursor-wait' 
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <span>Confirm &amp; Place Order</span>
              )}
            </button>

            {/* Guarantee info */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hamza Autos Buyer Protection</span>
              </div>
              <p className="text-slate-500">
                You will receive parcel tracking and SMS confirmation as soon as your order is packed at Badami Bagh.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
