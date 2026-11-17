import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  DollarSign, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { FinancialTransaction, FinancialTransactionType } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface FinancialTransactionsSectionProps {
  onNotify?: (msg: string) => void;
}

export const FinancialTransactionsSection: React.FC<FinancialTransactionsSectionProps> = ({
  onNotify = () => {}
}) => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await AdminApiService.getFinancialTransactions();
      if (res.success && res.transactions) {
        setTransactions(res.transactions);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = transactions.filter(t => {
    if (selectedType !== 'all' && t.transactionType !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchPayee = t.customerOrPayee?.toLowerCase().includes(q);
      const matchRef = t.referenceId.toLowerCase().includes(q);
      return matchDesc || matchPayee || matchRef;
    }
    return true;
  });

  const totalInflow = transactions
    .filter(t => t.transactionType === 'Customer Payment')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalOutflow = transactions
    .filter(t => ['Workshop Expense', 'Supplier Payment'].includes(t.transactionType))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            GENERAL WORKSHOP LEDGER
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Income &amp; Payment Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete audit trail of all customer revenue collections, supplier payouts, and workshop operating vouchers.
          </p>
        </div>
      </div>

      {/* 2. Inflow / Outflow KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Total Cash Inflow</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">
            + PKR {totalInflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Customer payments verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Total Cash Outflow</div>
          <div className="text-2xl font-black text-red-900 mt-1 tabular-nums">
            - PKR {totalOutflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-red-600 mt-0.5 font-medium">Expenses &amp; supplier settlements</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Cash Movement</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            PKR {(totalInflow - totalOutflow).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">All recorded transactions</div>
        </div>
      </div>

      {/* 3. Search and Type Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions by reference, customer name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
        >
          <option value="all">All Transaction Types</option>
          <option value="Customer Payment">Customer Payment (Inflow)</option>
          <option value="Workshop Expense">Workshop Expense (Outflow)</option>
          <option value="Supplier Payment">Supplier Payment (Outflow)</option>
        </select>
      </div>

      {/* 4. Transactions Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Party / Payee</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                filtered.map(t => {
                  const isInflow = t.transactionType === 'Customer Payment';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                        {t.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isInflow ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          t.transactionType === 'Supplier Payment' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {t.transactionType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {t.customerOrPayee || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {t.description}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {t.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {t.referenceId}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-mono font-black text-xs ${
                        isInflow ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {isInflow ? '+' : '-'} PKR {t.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
