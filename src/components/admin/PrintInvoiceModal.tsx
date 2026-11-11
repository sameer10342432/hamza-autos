import React from 'react';
import { X, Printer, Wrench, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { WorkshopInvoice } from '../../types';
import { BUSINESS_INFO } from '../../data/businessData';
import { generatePreparedWhatsApp } from '../../utils/workshopLogic';

interface PrintInvoiceModalProps {
  invoice: WorkshopInvoice;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const whatsAppMessage = generatePreparedWhatsApp('invoice_receipt', {
    customerName: invoice.customerName,
    phoneNumber: invoice.phoneNumber,
    invoiceNumber: invoice.invoiceNumber,
    bikeBrand: invoice.bikeBrand,
    bikeModel: invoice.bikeModel,
    totalCost: invoice.totalAmount,
    amountPaid: invoice.amountPaid,
    balance: invoice.remainingBalance
  });

  const labourSubtotal = invoice.labourItems.reduce((acc, item) => acc + item.amount, 0);
  const partsSubtotal = invoice.partsItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Actions Bar (hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-500" />
            <span className="font-bold text-sm tracking-tight">Tax Invoice &amp; Workshop Receipt</span>
            <span className="px-2 py-0.5 bg-red-600/30 text-red-400 text-xs font-mono font-bold rounded">
              {invoice.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={whatsAppMessage.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp to Customer
            </a>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Page */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 font-sans">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center font-black rounded-lg shrink-0">
                <Wrench className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                  HAMZA AUTOS
                </h1>
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">
                  Motorcycle Repair Workshop &amp; Spare Parts
                </p>
                <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
                  Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore, Punjab 54000
                </p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  Phone / WhatsApp: {BUSINESS_INFO.phone}
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
              <div className="inline-block bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                REPAIR INVOICE / RECEIPT
              </div>
              <div className="text-2xl font-mono font-black text-red-600 mt-2">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Date: {invoice.invoiceDate}
              </div>
              {invoice.jobCardNumber && (
                <div className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                  Job Card: {invoice.jobCardNumber}
                </div>
              )}
            </div>
          </div>

          {/* Bill To & Motorcycle details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs">
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-1">
                Customer (Bill To)
              </div>
              <div className="text-sm font-bold text-slate-900">{invoice.customerName}</div>
              <div className="text-slate-600 mt-0.5">Contact: {invoice.phoneNumber}</div>
            </div>
            <div className="sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-1">
                Motorcycle Serviced
              </div>
              <div className="text-sm font-bold text-slate-900">{invoice.bikeBrand} {invoice.bikeModel}</div>
              <div className="text-slate-600 mt-0.5">
                Registration No: <span className="font-mono font-bold text-slate-900">{invoice.registrationNumber || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-bold">#</th>
                  <th className="py-2.5 px-4 font-bold">Description / Service / Spare Part</th>
                  <th className="py-2.5 px-4 font-bold text-center">Type</th>
                  <th className="py-2.5 px-4 font-bold text-center">Qty</th>
                  <th className="py-2.5 px-4 font-bold text-right">Unit Rate (PKR)</th>
                  <th className="py-2.5 px-4 font-bold text-right">Total (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Labour Items */}
                {invoice.labourItems.map((labour, idx) => (
                  <tr key={labour.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{labour.description}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                        Labour
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">1</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                      {labour.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {labour.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {/* Parts Items */}
                {invoice.partsItems.map((part, idx) => (
                  <tr key={part.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-slate-400">
                      {invoice.labourItems.length + idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{part.partName}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">
                        Part
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-semibold">{part.quantity}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                      {part.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {part.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8 text-xs">
            <div className="max-w-xs space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Payment Method</span>
                <span className="font-semibold text-slate-900">{invoice.paymentMethod}</span>
              </div>
              {invoice.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Notes &amp; Warranty</span>
                  <span className="text-slate-700">{invoice.notes}</span>
                </div>
              )}
            </div>

            <div className="sm:w-72 space-y-1.5 border-t sm:border-t-0 pt-4 sm:pt-0">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Labour Charges Subtotal:</span>
                <span className="font-mono font-semibold">PKR {labourSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Spare Parts Subtotal:</span>
                <span className="font-mono font-semibold">PKR {partsSubtotal.toLocaleString()}</span>
              </div>
              {invoice.additionalCharges > 0 && (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Additional Charges:</span>
                  <span className="font-mono font-semibold">PKR {invoice.additionalCharges.toLocaleString()}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between py-1 text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">- PKR {invoice.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="font-mono text-red-600">PKR {invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-700">
                <span>Amount Paid:</span>
                <span className="font-mono font-semibold text-emerald-700">PKR {invoice.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-700 border-t border-slate-200">
                <span>Remaining Balance:</span>
                <span className="font-mono font-bold text-red-600">PKR {invoice.remainingBalance.toLocaleString()}</span>
              </div>
              <div className="pt-2 text-right">
                <span className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded ${
                  invoice.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                  invoice.paymentStatus === 'Partially Paid' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Status: {invoice.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Terms & Signatures */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500">
            <p className="leading-relaxed mb-6">
              Thank you for trusting Hamza Autos Badami Bagh for your motorcycle repair. Engine overhauls carry a 7-day workmanship warranty. Please retain this receipt for warranty and future service records.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="border-t border-slate-400 pt-2 text-center">
                <span className="font-semibold text-slate-800 block text-xs">Customer Received By</span>
              </div>
              <div className="border-t border-slate-400 pt-2 text-center">
                <span className="font-semibold text-slate-800 block text-xs">Authorized Hamza Autos Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
