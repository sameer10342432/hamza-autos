import React from 'react';
import { X, Printer, Wrench, Calendar, Phone, User, CheckCircle2 } from 'lucide-react';
import { JobCard } from '../../types';
import { BUSINESS_INFO } from '../../data/businessData';

interface PrintJobCardModalProps {
  jobCard: JobCard;
  onClose: () => void;
}

export const PrintJobCardModal: React.FC<PrintJobCardModalProps> = ({ jobCard, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Actions Bar (hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-500" />
            <span className="font-bold text-sm tracking-tight">Printable Workshop Job Card (A4)</span>
            <span className="px-2 py-0.5 bg-red-600/30 text-red-400 text-xs font-mono font-bold rounded">
              {jobCard.jobCardNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
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

        {/* Printable Sheet (Standard A4 layout) */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 font-sans">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center font-black rounded-lg shrink-0">
                  <Wrench className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                    HAMZA AUTOS
                  </h1>
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">
                    Motorcycle Repair &amp; Maintenance Workshop
                  </p>
                  <p className="text-xs text-slate-600 mt-1 max-w-md leading-relaxed">
                    Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore, Punjab 54000
                  </p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    Phone / WhatsApp: {BUSINESS_INFO.phone} | Workshop Hours: {BUSINESS_INFO.operatingHours}
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
                <div className="inline-block bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                  WORKSHOP JOB CARD
                </div>
                <div className="text-xl font-mono font-black text-red-600 mt-2">
                  {jobCard.jobCardNumber}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Created: {jobCard.createdDate}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">
                  Promised: {jobCard.expectedCompletionDate}
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Motorcycle Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs">
            <div className="space-y-2">
              <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Customer Information
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900 text-sm">{jobCard.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-semibold text-slate-800">{jobCard.phoneNumber}</span>
              </div>
              <div className="text-slate-600">
                Assigned Mechanic: <strong className="text-slate-900">{jobCard.assignedMechanicName || 'Unassigned'}</strong>
              </div>
            </div>

            <div className="space-y-2 sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Motorcycle Information
              </div>
              <div className="text-sm font-bold text-slate-900">
                {jobCard.bikeBrand} {jobCard.bikeModel}
              </div>
              <div className="text-slate-700">
                Reg No: <span className="font-mono font-bold bg-white px-2 py-0.5 border border-slate-300 rounded">{jobCard.registrationNumber || 'Not Provided'}</span>
              </div>
              <div className="text-slate-600">
                Current Status: <span className="font-bold text-red-600 uppercase">{jobCard.repairStatus}</span>
              </div>
            </div>
          </div>

          {/* Fault Description & Inspection */}
          <div className="space-y-4 mb-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Customer Reported Complaint / Symptoms
              </h2>
              <div className="p-3 bg-red-50/50 border border-red-200 rounded-lg text-xs text-slate-800 leading-relaxed font-medium">
                {jobCard.customerComplaint || 'Standard periodic service and general checkup.'}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                Mechanic Inspection &amp; Diagnosis Notes
              </h2>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed min-h-16">
                {jobCard.initialInspectionNotes || 'Initial inspection pending or completed according to workshop checklist.'}
              </div>
            </div>
          </div>

          {/* Required Services List */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Work &amp; Services Authorized
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {jobCard.requiredServices && jobCard.requiredServices.length > 0 ? (
                jobCard.requiredServices.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{service}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-2">Comprehensive mechanical inspection &amp; general tuning.</div>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-8">
            <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 flex items-center justify-between">
              <span>ESTIMATED &amp; FINAL REPAIR CHARGES</span>
              <span>All amounts in PKR</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Initial Estimate Given to Customer:</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  PKR {jobCard.estimatedCost ? jobCard.estimatedCost.toLocaleString() : '0'}
                </span>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-red-700 block text-[11px] font-semibold">Final Total Bill Amount:</span>
                <span className="text-lg font-black text-red-600 font-mono">
                  PKR {jobCard.finalCost ? jobCard.finalCost.toLocaleString() : (jobCard.estimatedCost ? jobCard.estimatedCost.toLocaleString() : 'Pending completion')}
                </span>
              </div>
            </div>
          </div>

          {/* Authorization & Signatures */}
          <div className="pt-6 border-t border-slate-200 text-xs text-slate-500">
            <p className="leading-relaxed mb-6 text-[11px]">
              <strong>Terms of Service:</strong> I authorize Hamza Autos to carry out the diagnosed repairs and replace damaged components. Motorcycles not collected within 7 days of completion notice are subject to workshop parking fees. Payment is due in full upon collection.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="border-t border-slate-400 pt-2 text-center">
                <span className="font-semibold text-slate-800 block text-xs">Customer Signature</span>
                <span className="text-[10px] text-slate-400">Authorized for repair</span>
              </div>
              <div className="border-t border-slate-400 pt-2 text-center">
                <span className="font-semibold text-slate-800 block text-xs">Workshop Manager / Mechanic Signature</span>
                <span className="text-[10px] text-slate-400">Hamza Autos Abu Bakar Road</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
