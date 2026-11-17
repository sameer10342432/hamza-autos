import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  FileText, 
  Download, 
  X, 
  DollarSign, 
  Tag, 
  TrendingDown,
  Calendar
} from 'lucide-react';
import { ExpenseRecord, ExpenseCategory } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface ExpensesManagementSectionProps {
  onNotify?: (msg: string) => void;
}

export const ExpensesManagementSection: React.FC<ExpensesManagementSectionProps> = ({
  onNotify = () => {}
}) => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<ExpenseRecord>>({
    expenseTitle: '',
    expenseCategory: 'Shop Rent',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    paidTo: '',
    description: '',
    referenceNumber: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [expRes, catRes] = await Promise.all([
        AdminApiService.getExpenses(),
        AdminApiService.getExpenseCategories()
      ]);

      if (expRes.success && expRes.expenses) {
        setExpenses(expRes.expenses);
      }
      if (catRes.success && catRes.categories) {
        setCategories(catRes.categories);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExpenses = expenses.filter(e => {
    if (selectedCategory !== 'all' && e.expenseCategory !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.expenseTitle.toLowerCase().includes(q);
      const matchPaidTo = e.paidTo.toLowerCase().includes(q);
      const matchDesc = e.description?.toLowerCase().includes(q);
      return matchTitle || matchPaidTo || matchDesc;
    }
    return true;
  });

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const partsExpenses = expenses.filter(e => e.expenseCategory === 'Spare Parts Purchases').reduce((sum, e) => sum + (e.amount || 0), 0);
  const utilityExpenses = expenses.filter(e => ['Electricity (LESCO)', 'Shop Rent'].includes(e.expenseCategory)).reduce((sum, e) => sum + (e.amount || 0), 0);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AdminApiService.createExpense(formData);
      if (res.success) {
        setExpenses(prev => [res.expense, ...prev]);
        onNotify(`Expense "${res.expense.expenseTitle}" of PKR ${res.expense.amount} recorded`);
        setShowAddModal(false);
        setFormData({
          expenseTitle: '',
          expenseCategory: 'Shop Rent',
          amount: 0,
          expenseDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Cash',
          paidTo: '',
          description: '',
          referenceNumber: ''
        });
      }
    } catch (err: any) {
      alert(`Error saving expense: ${err.message}`);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('Delete this expense record?')) return;
    try {
      await AdminApiService.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      onNotify('Expense record deleted');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await AdminApiService.createExpenseCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim()
      });
      if (res.success) {
        setCategories(prev => [...prev, res.category]);
        onNotify(`Category "${newCatName}" added`);
        setNewCatName('');
        setNewCatDesc('');
        setShowCategoryModal(false);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            FINANCIAL LEDGER &amp; EXPENSES
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Workshop Expenses &amp; Outflow
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track operational workshop disbursements, utility bills, tool maintenance, and supplier payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record New Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Expense Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Recorded Expenses</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            PKR {totalAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{filteredExpenses.length} expense vouchers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Utilities &amp; Shop Rent</div>
          <div className="text-2xl font-black text-amber-900 mt-1 tabular-nums">
            PKR {utilityExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5 font-medium">Electricity and workshop premises</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Spare Parts Purchases</div>
          <div className="text-2xl font-black text-blue-900 mt-1 tabular-nums">
            PKR {partsExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5 font-medium">Inventory replenishment costs</div>
        </div>
      </div>

      {/* 3. Search and Category Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses by title, recipient, or reference voucher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
        >
          <option value="all">All Expense Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 4. Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No expense records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                      {e.expenseDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{e.expenseTitle}</div>
                      {e.referenceNumber && (
                        <div className="text-[11px] text-slate-400 font-mono">Ref: {e.referenceNumber}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {e.expenseCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {e.paidTo || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {e.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                      PKR {e.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteExpense(e.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Record New Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Workshop Expense</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={formData.expenseTitle || ''}
                  onChange={(e) => setFormData({ ...formData, expenseTitle: e.target.value })}
                  placeholder="e.g. LESCO Electricity Bill"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.expenseCategory || 'Shop Rent'}
                    onChange={(e) => setFormData({ ...formData, expenseCategory: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    placeholder="1500"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expenseDate || ''}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod || 'Cash'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Easypaisa">Easypaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paid To (Vendor / Person)</label>
                <input
                  type="text"
                  value={formData.paidTo || ''}
                  onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                  placeholder="e.g. LESCO Sub-Division Badami Bagh"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference Voucher / Bill #</label>
                <input
                  type="text"
                  value={formData.referenceNumber || ''}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  placeholder="e.g. VOUCHER-9921"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Manage Categories Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Manage Expense Categories</h3>
              <button onClick={() => setShowCategoryModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Compressor Oil & Filter Maintenance"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
              >
                + Add Category
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 max-h-56 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Existing Categories:</span>
              {categories.map(cat => (
                <div key={cat.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>{cat.name}</span>
                  {cat.isSystem && (
                    <span className="text-[10px] text-slate-400 font-normal">System</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
