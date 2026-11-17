import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Edit, 
  Trash2, 
  X, 
  CreditCard, 
  FileText 
} from 'lucide-react';
import { SupplierRecord, SupplierStatus } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface SuppliersSectionProps {
  onNotify?: (msg: string) => void;
  onNavigateToPurchaseOrders?: () => void;
}

export const SuppliersSection: React.FC<SuppliersSectionProps> = ({
  onNotify = () => {},
  onNavigateToPurchaseOrders
}) => {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SupplierRecord>>({
    supplierName: '',
    contactPerson: '',
    phoneNumber: '',
    whatsAppNumber: '',
    email: '',
    businessAddress: 'Badami Bagh, Lahore',
    supplierCategory: 'OEM & Aftermarket Spare Parts',
    productsSupplied: [],
    paymentTerms: '15 Days Net Credit',
    notes: '',
    status: 'Active'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await AdminApiService.getSuppliers();
      if (res.success && res.suppliers) {
        setSuppliers(res.suppliers);
      }
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSuppliers = suppliers.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.supplierName.toLowerCase().includes(q);
      const matchContact = s.contactPerson?.toLowerCase().includes(q);
      const matchPhone = s.phoneNumber.includes(q);
      const matchProd = s.productsSupplied?.some(p => p.toLowerCase().includes(q));
      return matchName || matchContact || matchPhone || matchProd;
    }
    return true;
  });

  const totalPurchases = suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
  const totalPaid = suppliers.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
  const totalBalance = suppliers.reduce((sum, s) => sum + (s.outstandingBalance || 0), 0);

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        const res = await AdminApiService.updateSupplier(editingSupplier.id, formData);
        if (res.success) {
          setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? res.supplier : s));
          onNotify(`Supplier ${res.supplier.supplierName} updated`);
        }
      } else {
        const res = await AdminApiService.createSupplier(formData);
        if (res.success) {
          setSuppliers(prev => [res.supplier, ...prev]);
          onNotify(`Supplier ${res.supplier.supplierName} registered`);
        }
      }
      setShowAddModal(false);
      setEditingSupplier(null);
    } catch (err: any) {
      alert(`Error saving supplier: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this supplier record?')) return;
    try {
      await AdminApiService.deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      onNotify('Supplier removed');
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
            PURCHASING &amp; VENDORS
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Spare Parts Suppliers Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of certified OEM distributors, wholesale agencies, and inventory parts vendors in Badami Bagh Lahore.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSupplier(null);
            setFormData({
              supplierName: '',
              contactPerson: '',
              phoneNumber: '',
              whatsAppNumber: '',
              email: '',
              businessAddress: 'Badami Bagh, Lahore',
              supplierCategory: 'OEM & Aftermarket Spare Parts',
              productsSupplied: [],
              paymentTerms: '15 Days Net Credit',
              notes: '',
              status: 'Active'
            });
            setShowAddModal(true);
          }}
          className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* 2. Supplier Procurement KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Suppliers</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{suppliers.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active wholesale partners</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Purchases</div>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            PKR {totalPurchases.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">All procurement orders</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Total Paid</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">
            PKR {totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">Disbursed supplier payments</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Payable Balance</div>
          <div className="text-2xl font-black text-amber-900 mt-1 tabular-nums">
            PKR {totalBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5 font-medium">Outstanding vendor credit</div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers by business name, contact person, phone, or parts supplied..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* 4. Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(s => (
          <div 
            key={s.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm leading-tight">{s.supplierName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Contact: <strong>{s.contactPerson}</strong></div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {s.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.phoneNumber}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.businessAddress}</span>
                </div>
              </div>

              {/* Products Supplied Tags */}
              <div className="flex flex-wrap gap-1">
                {s.productsSupplied?.map(prod => (
                  <span key={prod} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium">
                    {prod}
                  </span>
                ))}
              </div>

              {/* Financial Balance Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</div>
                  <div className="font-bold text-slate-800">PKR {(s.totalPurchases || 0).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-amber-700 uppercase">Balance Due</div>
                  <div className="font-bold text-amber-900">PKR {(s.outstandingBalance || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={`https://wa.me/92${s.phoneNumber.replace(/^0|\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingSupplier(s);
                    setFormData(s);
                    setShowAddModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 text-red-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Add / Edit Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Agency Name *</label>
                <input
                  type="text"
                  required
                  value={formData.supplierName || ''}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  placeholder="e.g. Atlas Honda Genuine Parts Wholesale"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Haji Farooq"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="0300 8421900"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Market Address</label>
                <input
                  type="text"
                  value={formData.businessAddress || ''}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  placeholder="e.g. Main Auto Market, Badami Bagh, Lahore"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Products Supplied (comma separated)</label>
                <input
                  type="text"
                  value={formData.productsSupplied?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    productsSupplied: e.target.value.split(',').map(p => p.trim()).filter(Boolean) 
                  })}
                  placeholder="Pistons, Clutch Plates, Brake Shoes, Havoline Oil"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={formData.paymentTerms || 'Cash on Delivery'}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    placeholder="e.g. 15 Days Net Credit"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SupplierStatus })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
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
                  {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
