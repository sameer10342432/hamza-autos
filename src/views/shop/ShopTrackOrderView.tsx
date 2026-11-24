/**
 * Hamza Autos - Public Order Tracking View
 * Customer self-service live delivery status & courier tracking across Pakistan
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  PackageCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageCircle, 
  MapPin,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ShopService } from '../../services/shopService';

interface ShopTrackOrderViewProps {
  initialQuery?: string;
  onNavigate: (view: string, slug?: string) => void;
}

export const ShopTrackOrderView: React.FC<ShopTrackOrderViewProps> = ({ 
  initialQuery = '', 
  onNavigate 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (searchVal: string) => {
    if (!searchVal.trim() || searchVal.trim().length < 4) {
      setError('Please enter your full Order Number (e.g. HA-SHOP-2026-1001) or 11-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ShopService.trackOrder(searchVal.trim());
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'No matching orders found. Please verify your reference.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(query);
  };

  const getStepProgress = (status: string): number => {
    switch (status) {
      case 'New Order': return 1;
      case 'Confirmed': return 2;
      case 'Processing':
      case 'Packed': return 3;
      case 'Dispatched':
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      case 'Cancelled':
      case 'Returned': return -1;
      default: return 1;
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-4 flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-red-600 cursor-pointer">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('shop')} className="hover:text-red-600 cursor-pointer">Shop</button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Track Delivery</span>
        </nav>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Track Your Spare Parts Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
            Check the live packing, dispatch status, and courier tracking number for your delivery across Pakistan.
          </p>
        </div>

        {/* Tracking Search Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order Number (e.g. HA-SHOP-2026-1001) or Mobile Phone..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition-colors shadow-md shadow-red-600/20 cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <span>Track Status</span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Timeline Card */}
        {results && results.map((order, idx) => {
          const step = getStepProgress(order.orderStatus);
          const isCancelled = order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned';

          return (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md mb-6 space-y-6 animate-fade-in">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Order Reference</div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono text-red-600">
                    {order.orderNumber}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Destination: <strong className="text-slate-800">{order.city}, {order.province}</strong>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    isCancelled ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <div className="text-xs text-slate-400 mt-1">
                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Courier Information Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Courier Partner</span>
                  <strong className="text-slate-900 text-sm">{order.courier}</strong>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Tracking Number</span>
                  <strong className="text-slate-900 text-sm font-mono">{order.trackingNumber}</strong>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold uppercase">Transit Estimation</span>
                  <span className="text-slate-700 font-semibold">{order.estimatedDeliveryDays}</span>
                </div>
              </div>

              {/* Visual Multi-step Timeline */}
              {!isCancelled ? (
                <div className="py-4">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-red-600 z-0 transition-all duration-500" 
                      style={{ width: `${Math.max(0, ((step - 1) / 4) * 100)}%` }}
                    />

                    {/* Steps */}
                    {[
                      { num: 1, label: 'Placed' },
                      { num: 2, label: 'Confirmed' },
                      { num: 3, label: 'Packed' },
                      { num: 4, label: 'Dispatched' },
                      { num: 5, label: 'Delivered' }
                    ].map((st) => {
                      const isComplete = step >= st.num;
                      const isCurrent = step === st.num;

                      return (
                        <div key={st.num} className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                            isComplete ? 'bg-red-600 text-white ring-4 ring-red-100' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                          </div>
                          <span className={`text-[11px] mt-1.5 font-bold ${
                            isCurrent ? 'text-red-600' : isComplete ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs font-semibold">
                  This order has been marked as {order.orderStatus}. Please contact Hamza Autos for details.
                </div>
              )}

              {/* Items Summary in Order */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Items in this Shipment ({order.itemCount})
                </h4>
                <div className="space-y-1.5">
                  {order.items.map((it: any, i: number) => (
                    <div key={i} className="text-xs flex items-center justify-between text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                      <span className="font-medium text-slate-900">{it.quantity}x {it.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right text-xs text-slate-500 font-bold mt-2">
                  Total Order Value: <span className="text-slate-900 text-sm">PKR {order.total.toLocaleString()}</span> ({order.paymentMethod})
                </div>
              </div>

              {/* WhatsApp Support CTA */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">Need courier updates or change delivery address?</span>
                <a
                  href={`https://wa.me/923251814548?text=Assalam-o-Alaikum%20Hamza%20Autos,%20I%20am%20inquiring%20about%20my%20order%20${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Support (+92 325 1814548)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
