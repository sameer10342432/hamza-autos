import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AdminContentProps {
  children: React.ReactNode;
  successNotice?: string | null;
  errorNotice?: string | null;
}

export const AdminContent: React.FC<AdminContentProps> = ({
  children,
  successNotice,
  errorNotice
}) => {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-100/90 min-h-screen text-slate-900 p-3 sm:p-6 lg:p-8 space-y-6">
      {/* Dynamic Success Notice Banner */}
      {successNotice && (
        <div 
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-3 shadow-xs animate-in fade-in duration-200"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span>{successNotice}</span>
        </div>
      )}

      {/* Dynamic Error Notice Banner */}
      {errorNotice && (
        <div 
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl flex items-center gap-3 shadow-xs animate-in fade-in duration-200"
        >
          <div className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto space-y-6">
        {children}
      </div>
    </main>
  );
};
