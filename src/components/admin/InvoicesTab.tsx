import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Printer, 
  MessageCircle, 
  CheckCircle, 
  Trash2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  WorkshopInvoice, 
  SparePart, 
  InvoiceLabourItem, 
  InvoicePartItem, 
  PaymentStatus, 
  PaymentMethod 
} from '../../types';
import { generatePreparedWhatsApp } from '../../utils/workshopLogic';

interface InvoicesTabProps {
  invoices: WorkshopInvoice[];
  inventory: SparePart[];
  onCreateInvoice: (data: Omit<WorkshopInvoice, 'id' | 'invoiceNumber' | 'totalAmount' | 'remainingBalance'>, deductInventory: boolean) => void;
  onUpdatePayment: (id: string, amountPaid: number, status: PaymentStatus) => void;
  onPrintInvoice: (invoice: WorkshopInvoice) => void;
  initialJobCardPrefill?: {
    jobCardNumber: string;
    customerName: string;
    phoneNumber: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    estimatedCost?: number;
  } | null;
  onClearPrefill?: () => void;
}

export const InvoicesTab: React.FC<InvoicesTabProps> = ({
  invoices,
  inventory,
  onCreateInvoice,
  onUpdatePayment,
  onPrintInvoice,
  initialJobCardPrefill,
  onClearPrefill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bikeBrand, setBikeBrand] = useState('Honda');
  const [bikeModel, setBikeModel] = useState('CD 70');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [jobCardNumber, setJobCardNumber] = useState('');
  
  // Dynamic Items
  const [labourItems, setLabourItems] = useState<InvoiceLabourItem[]>([
    { id: '1', description: 'General Tuning & Fuel System Service', amount: 1200 }
  ]);
  const [partsItems, setPartsItems] = useState<InvoicePartItem[]>([]);
  
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);
  const [additionalDesc, setAdditionalDesc] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(1200);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('7 days workmanship guarantee on tuning & mechanical repair.');
  const [deductPartsStock, setDeductPartsStock] = useState(true);

  // Handle opening with prefilled job card
  React.useEffect(() => {
    if (initialJobCardPrefill) {
      setJobCardNumber(initialJobCardPrefill.jobCardNumber);
      setCustomerName(initialJobCardPrefill.customerName);
      setPhoneNumber(initialJobCardPrefill.phoneNumber);
      setBikeBrand(initialJobCardPrefill.bikeBrand);
      setBikeModel(initialJobCardPrefill.bikeModel);
      setRegistrationNumber(initialJobCardPrefill.registrationNumber || '');
      setLabourItems([
        { id: '1', description: 'Workshop Repair Service per Job Card ' + initialJobCardPrefill.jobCardNumber, amount: initialJobCardPrefill.estimatedCost || 1500 }
      ]);
      setAmountPaid(initialJobCardPrefill.estimatedCost || 1500);
      setShowModal(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [initialJobCardPrefill]);

  // Labour items helpers
  const addLabourItem = () => {
    setLabourItems([
      ...labourItems,
      { id: Date.now().toString(), description: '', amount: 500 }
    ]);
  };

  const removeLabourItem = (id: string) => {
    setLabourItems(labourItems.filter(item => item.id !== id));
  };

  const updateLabour = (id: string, field: 'description' | 'amount', value: any) => {
    setLabourItems(labourItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'amount' ? Number(value) : value };
      }
      return item;
    }));
  };

  // Parts items helpers
  const addPartItem = () => {
    const firstPart = inventory[0];
    if (!firstPart) return;
    setPartsItems([
      ...partsItems,
      {
        id: Date.now().toString(),
        partId: firstPart.id,
        partName: firstPart.partName,
        quantity: 1,
        unitPrice: firstPart.sellingPrice,
        total: firstPart.sellingPrice
      }
    ]);
  };

  const removePartItem = (id: string) => {
    setPartsItems(partsItems.filter(item => item.id !== id));
  };

  const updatePartItem = (id: string, partId: string, quantity: number) => {
    const selectedPart = inventory.find(p => p.id === partId);
    if (!selectedPart) return;

    setPartsItems(partsItems.map(item => {
      if (item.id === id) {
        const q = Math.max(1, quantity);
        return {
          ...item,
          partId,
          partName: selectedPart.partName,
          quantity: q,
          unitPrice: selectedPart.sellingPrice,
          total: selectedPart.sellingPrice * q
        };
      }
      return item;
    }));
  };

  // Total calculations
  const labourSubtotal = labourItems.reduce((acc, i) => acc + (i.amount || 0), 0);
  const partsSubtotal = partsItems.reduce((acc, i) => acc + (i.total || 0), 0);
  const calculatedTotal = Math.max(0, labourSubtotal + partsSubtotal + Number(additionalCharges) - Number(discount));
  const remainingBalance = Math.max(0, calculatedTotal - Number(amountPaid));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber) return;

    let pStatus: PaymentStatus = 'Unpaid';
    if (amountPaid >= calculatedTotal && calculatedTotal > 0) {
      pStatus = 'Paid';
    } else if (amountPaid > 0) {
      pStatus = 'Partially Paid';
    }

    onCreateInvoice({
      jobCardNumber: jobCardNumber || undefined,
      invoiceDate: new Date().toISOString().split('T')[0],
      customerName,
      phoneNumber,
      bikeBrand,
      bikeModel,
      registrationNumber,
      labourItems,
      partsItems,
      additionalCharges: Number(additionalCharges),
      additionalChargesDescription: additionalDesc,
      discount: Number(discount),
      amountPaid: Number(amountPaid),
      paymentStatus: pStatus,
      paymentMethod,
      notes
    }, deductPartsStock);

    setShowModal(false);
  };

  const filtered = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.phoneNumber.includes(searchQuery) ||
      (inv.jobCardNumber && inv.jobCardNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Invoice #, Name, Phone..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        <button
          onClick={() => {
            setJobCardNumber('');
            setCustomerName('');
            setPhoneNumber('');
            setLabourItems([{ id: '1', description: 'Motorcycle Service', amount: 1000 }]);
            setPartsItems([]);
            setAmountPaid(1000);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Repair Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Invoice #</th>
                <th className="py-3 px-4 font-bold">Customer</th>
                <th className="py-3 px-4 font-bold">Motorcycle</th>
                <th className="py-3 px-4 font-bold">Total Amount</th>
                <th className="py-3 px-4 font-bold">Paid / Balance</th>
                <th className="py-3 px-4 font-bold">Payment Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No workshop invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map(inv => {
                  const whatsAppReceipt = generatePreparedWhatsApp('invoice_receipt', {
                    customerName: inv.customerName,
                    phoneNumber: inv.phoneNumber,
                    invoiceNumber: inv.invoiceNumber,
                    bikeBrand: inv.bikeBrand,
                    bikeModel: inv.bikeModel,
                    totalCost: inv.totalAmount,
                    amountPaid: inv.amountPaid,
                    balance: inv.remainingBalance
                  });

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-red-600 block">{inv.invoiceNumber}</span>
                        <span className="text-[10px] text-slate-400 block">{inv.invoiceDate}</span>
                        {inv.jobCardNumber && (
                          <span className="text-[10px] font-mono text-slate-500">JC: {inv.jobCardNumber}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-medium">
                        <span className="font-bold text-slate-900 block">{inv.customerName}</span>
                        <a href={`tel:${inv.phoneNumber}`} className="text-red-600 font-mono text-[11px] hover:underline">
                          {inv.phoneNumber}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{inv.bikeBrand} {inv.bikeModel}</span>
                        <span className="text-[10px] font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">
                          {inv.registrationNumber || 'No Plate'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        PKR {inv.totalAmount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono">
                        <span className="text-emerald-700 font-semibold block">Paid: PKR {inv.amountPaid.toLocaleString()}</span>
                        {inv.remainingBalance > 0 ? (
                          <span className="text-red-600 font-bold block text-[11px]">Bal: PKR {inv.remainingBalance.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400 text-[11px] block">Clear</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                          inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.paymentStatus === 'Partially Paid' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {inv.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Print Invoice Modal */}
                          <button
                            onClick={() => onPrintInvoice(inv)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Print A4 Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Invoice Receipt */}
                          <a
                            href={whatsAppReceipt.waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="WhatsApp Bill to Customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Mark as Paid Quick Action */}
                          {inv.paymentStatus !== 'Paid' && (
                            <button
                              onClick={() => onUpdatePayment(inv.id, inv.totalAmount, 'Paid')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded shadow-xs cursor-pointer"
                              title="Mark full balance paid"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Invoice */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Generate Repair Invoice &amp; Receipt</h3>
                <p className="text-xs text-slate-500">Calculate labour charges, include inventory parts and print A4 receipt</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Customer and Bike info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Associated Job Card (Optional)</label>
                  <input
                    type="text"
                    value={jobCardNumber}
                    onChange={(e) => setJobCardNumber(e.target.value)}
                    placeholder="e.g. HA-JC-2026-001"
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Brand</label>
                  <input
                    type="text"
                    value={bikeBrand}
                    onChange={(e) => setBikeBrand(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bike Model</label>
                  <input
                    type="text"
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration #</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Labour Items Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Labour &amp; Workmanship Charges
                  </span>
                  <button
                    type="button"
                    onClick={addLabourItem}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    + Add Labour Item
                  </button>
                </div>

                {labourItems.map((labour) => (
                  <div key={labour.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={labour.description}
                      onChange={(e) => updateLabour(labour.id, 'description', e.target.value)}
                      placeholder="e.g. Engine Overhaul, Brake Shoe Replacement, Tuning"
                      className="flex-1 py-1.5 px-2.5 border border-slate-300 rounded-lg"
                    />
                    <input
                      type="number"
                      value={labour.amount}
                      onChange={(e) => updateLabour(labour.id, 'amount', e.target.value)}
                      placeholder="PKR"
                      className="w-28 py-1.5 px-2.5 border border-slate-300 rounded-lg font-mono text-right"
                    />
                    <button
                      type="button"
                      onClick={() => removeLabourItem(labour.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Spare Parts Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Spare Parts (From Workshop Inventory)
                    </span>
                    <span className="block text-[10px] text-slate-400">Selecting parts will auto-populate prices and update stock</span>
                  </div>
                  <button
                    type="button"
                    onClick={addPartItem}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    + Add Spare Part
                  </button>
                </div>

                {partsItems.map((part) => (
                  <div key={part.id} className="flex items-center gap-2">
                    <select
                      value={part.partId}
                      onChange={(e) => updatePartItem(part.id, e.target.value, part.quantity)}
                      className="flex-1 py-1.5 px-2.5 border border-slate-300 rounded-lg cursor-pointer"
                    >
                      {inventory.map(invPart => (
                        <option key={invPart.id} value={invPart.id}>
                          {invPart.partName} ({invPart.partNumber}) - Stock: {invPart.stockQuantity} - PKR {invPart.sellingPrice}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      value={part.quantity}
                      onChange={(e) => updatePartItem(part.id, part.partId || '', Number(e.target.value))}
                      className="w-16 py-1.5 px-2 border border-slate-300 rounded-lg text-center font-mono"
                      title="Quantity"
                    />

                    <div className="w-24 font-mono font-bold text-right text-slate-900">
                      PKR {part.total.toLocaleString()}
                    </div>

                    <button
                      type="button"
                      onClick={() => removePartItem(part.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {partsItems.length > 0 && (
                  <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deductPartsStock}
                      onChange={(e) => setDeductPartsStock(e.target.checked)}
                      className="rounded text-red-600"
                    />
                    <span>Automatically deduct these quantities from workshop inventory stock</span>
                  </label>
                )}
              </div>

              {/* Financial Calculation Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Additional Charges</label>
                    <input
                      type="number"
                      value={additionalCharges}
                      onChange={(e) => setAdditionalCharges(Number(e.target.value))}
                      className="w-full py-1.5 px-2 border border-slate-300 rounded-lg font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Discount (PKR)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full py-1.5 px-2 border border-slate-300 rounded-lg font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Amount Paid (PKR)</label>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      className="w-full py-1.5 px-2 border border-slate-300 rounded-lg font-mono text-right font-bold text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full py-1.5 px-2 border border-slate-300 rounded-lg cursor-pointer"
                    >
                      <option value="Cash">Cash In Hand</option>
                      <option value="Bank Transfer / EasyPaisa / JazzCash">EasyPaisa / JazzCash / Bank</option>
                      <option value="Credit">Store Credit / Khata</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                  <span>Grand Total Bill:</span>
                  <span className="font-mono text-lg text-red-600">PKR {calculatedTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Remaining Customer Balance:</span>
                  <span className="font-mono font-bold text-slate-900">PKR {remainingBalance.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Notes / Warranty Guarantee</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Generate Invoice &amp; Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
