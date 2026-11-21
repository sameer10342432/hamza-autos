/**
 * Hamza Autos - Order Confirmation View
 * Visual confirmation with unique Order Number, WhatsApp dispatch alert, and invoice print
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Printer, 
  MessageCircle, 
  Truck, 
  ShoppingBag, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { ShopService } from '../../services/shopService';

interface ShopOrderConfirmationViewProps {
  orderNumber: string;
  onNavigate: (view: string, slug?: string) => void;
}

export const ShopOrderConfirmationView: React.FC<ShopOrderConfirmationViewProps> = ({ 
  orderNumber, 
  onNavigate 
}) => {
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const results = await ShopService.trackOrder(orderNumber);
        if (results && results.length > 0) {
          setOrder(results[0]);
        }
      } catch (err) {
        console.error('Error fetching order confirmation:', err);
      } finally {
        setLoading(false);
      }
    }
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppConfirmationUrl = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Hamza Autos,\n\nI have placed order *${orderNumber}* on your website for motorcycle spare parts.\n\nPlease confirm dispatch and courier tracking. Thank you!`
    );
    return `https://wa.me/923251814548?text=${text}`;
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-md text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed &amp; Queued for Dispatch
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
              Thank You For Your Order!
            </h1>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Your order has been recorded in our Badami Bagh workshop system. We will package your parts with protective bubble wrapping and hand them over to our courier partner.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 max-w-md mx-auto flex items-center justify-between shadow-lg">
            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                Your Unique Order Number
              </span>
              <strong className="text-xl font-mono text-red-400 tracking-wider">
                {orderNumber}
              </strong>
            </div>
            <button
              onClick={handleCopyOrderNumber}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* WhatsApp Direct Confirmation Button */}
          <div className="pt-2">
            <a
              href={getWhatsAppConfirmationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 text-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Hamza Autos on WhatsApp with Order #{orderNumber}</span>
            </a>
            <p className="text-[11px] text-slate-400 mt-2">
              Our team (+92 325 1814548) is available 9 AM – 9 PM daily to assist with tracking and fitment advice.
            </p>
          </div>

          {/* Delivery & Next Steps Guidance */}
          <div className="text-left border-t border-slate-100 pt-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">What Happens Next?</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-600" />
                  <span>1. Inspection &amp; Pack</span>
                </span>
                <p className="text-slate-500 text-[11px]">
                  Master mechanics inspect physical parts and verify specs before boxing.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Courier Handover</span>
                </span>
                <p className="text-slate-500 text-[11px]">
                  TCS / Leopards / M&amp;P tracking code generated and shared via SMS.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Doorstep Arrival</span>
                </span>
                <p className="text-slate-500 text-[11px]">
                  Receive parcel at your door and pay Cash on Delivery (COD) to the rider.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('shop-track-order', orderNumber)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-red-400" />
              <span>Track Order Live</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Order Receipt</span>
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Return to Shop
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
