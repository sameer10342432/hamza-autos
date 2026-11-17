import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Info, 
  Download,
  CreditCard,
  PieChart
} from 'lucide-react';
import { ProfitSummary, WorkshopInvoice, ExpenseRecord } from '../../types';
import { AdminApiService } from '../../services/adminApiService';
import { getStoredInvoices } from '../../utils/workshopLogic';

interface ProfitReportsSectionProps {
  onNotify?: (msg: string) => void;
}

export const ProfitReportsSection: React.FC<ProfitReportsSectionProps> = ({
  onNotify = () => {}
}) => {
  const [profitSummary, setProfitSummary] = useState<ProfitSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'thisMonth' | 'all'>('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await AdminApiService.getProfitSummary();
      if (res.success && res.profitSummary) {
        setProfitSummary(res.profitSummary);
      }
    } catch (err) {
      console.error('Failed to load profit summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Use real invoices and expenses to compute live numbers
  const invoices = getStoredInvoices();
  const collectedCash = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const receivables = Math.max(0, totalInvoiced - collectedCash);

  // Direct parts cost estimation from invoice parts items
  const directPartsCost = invoices.reduce((sum, inv) => {
    const partsTotal = (inv.partsItems || []).reduce((pSum, part) => pSum + (part.total || 0), 0);
    return sum + partsTotal;
  }, 0);

  const operatingExpenses = profitSummary?.operatingExpenses || 21800;
  const totalExpenses = directPartsCost + operatingExpenses;
  const grossProfit = collectedCash - directPartsCost;
  const netProfit = collectedCash - totalExpenses;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            FINANCIAL INTELLIGENCE &amp; AUDIT
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Workshop Profit &amp; Loss Estimates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real cash-based accounting: distinguishes collected customer payments from unpaid invoices.
          </p>
        </div>

        {/* Date Filter */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600 border border-slate-200">
          {(['today', '7days', '30days', 'thisMonth', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateFilter(range)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dateFilter === range ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : range === 'thisMonth' ? 'This Month' : range === 'today' ? 'Today' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Critical Accounting Principles Notice */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900 shadow-xs">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Strict Financial Definition &amp; Cash Realization Method:</span>
          <p className="leading-relaxed text-blue-800">
            <strong>Collected Revenue</strong> represents actual cash or online bank transfers verified in workshop records. Unpaid invoice balances (<strong>PKR {receivables.toLocaleString()}</strong>) are marked as pending receivables and are <em>never</em> counted as earned cash. Direct spare parts costs and operating expenses are deducted to derive genuine Gross and Net estimates.
          </p>
        </div>
      </div>

      {/* 3. Executive Financial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Collected Revenue</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 tabular-nums">
            PKR {collectedCash.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Cash received in workshop
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending Receivables</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 tabular-nums">
            PKR {receivables.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Unsettled customer invoices
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Profit (Est.)</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tabular-nums">
            PKR {grossProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Revenue minus parts direct costs
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${
          netProfit >= 0 ? 'bg-emerald-50/70 border-emerald-300' : 'bg-red-50/70 border-red-300'
        }`}>
          <div className={`text-xs font-bold uppercase tracking-wider ${
            netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
          }`}>
            Net Profit (Est.)
          </div>
          <div className={`text-2xl sm:text-3xl font-black mt-1 tabular-nums ${
            netProfit >= 0 ? 'text-emerald-950' : 'text-red-950'
          }`}>
            PKR {netProfit.toLocaleString()}
          </div>
          <div className={`text-[11px] font-medium mt-1 ${
            netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
          }`}>
            After parts + all operating costs
          </div>
        </div>
      </div>

      {/* 4. Financial Calculations Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Financial Calculation Audit Table</h3>
        
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex items-center justify-between font-medium">
            <span className="text-slate-700">(+) Total Invoiced Value Issued</span>
            <span className="font-mono font-bold text-slate-900">PKR {totalInvoiced.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex items-center justify-between font-medium text-amber-700">
            <span>(-) Unsettled Outstanding Receivables (Not Collected)</span>
            <span className="font-mono font-bold">- PKR {receivables.toLocaleString()}</span>
          </div>
          <div className="py-3 flex items-center justify-between font-bold text-emerald-800 bg-emerald-50/50 px-3 rounded-xl my-1">
            <span>(=) Net Realized Cash Revenue Collected</span>
            <span className="font-mono text-sm font-black">PKR {collectedCash.toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between font-medium text-slate-600 pt-3">
            <span>(-) Direct Spare Parts Cost (Installed on Bay)</span>
            <span className="font-mono font-bold">- PKR {directPartsCost.toLocaleString()}</span>
          </div>
          <div className="py-3 flex items-center justify-between font-bold text-slate-800 bg-slate-50 px-3 rounded-xl my-1">
            <span>(=) Estimated Gross Profit</span>
            <span className="font-mono text-sm font-black">PKR {grossProfit.toLocaleString()}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between font-medium text-red-600 pt-3">
            <span>(-) Workshop Operating Expenses (Rent, LESCO, Tools, Salaries)</span>
            <span className="font-mono font-bold">- PKR {operatingExpenses.toLocaleString()}</span>
          </div>
          <div className={`py-3.5 flex items-center justify-between font-black px-4 rounded-xl my-1 ${
            netProfit >= 0 ? 'bg-emerald-100/70 text-emerald-950' : 'bg-red-100 text-red-950'
          }`}>
            <span className="text-sm">(=) Estimated Net Profit</span>
            <span className="font-mono text-base">PKR {netProfit.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
