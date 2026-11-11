import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  JobCard, 
  AppointmentBooking, 
  CustomerProfile, 
  SparePart, 
  WorkshopInvoice, 
  AnalyticsSummary 
} from '../../types';

interface DashboardTabProps {
  jobCards: JobCard[];
  bookings: AppointmentBooking[];
  customers: CustomerProfile[];
  inventory: SparePart[];
  invoices: WorkshopInvoice[];
  analytics: AnalyticsSummary;
  onNavigateTab: (tab: any) => void;
  onOpenNewJobCard: () => void;
  onOpenNewBooking: () => void;
  onOpenNewInvoice: () => void;
  onPrintJobCard: (jobCard: JobCard) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  jobCards,
  bookings,
  customers,
  inventory,
  invoices,
  analytics,
  onNavigateTab,
  onOpenNewJobCard,
  onOpenNewBooking,
  onOpenNewInvoice,
  onPrintJobCard
}) => {
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('all');

  // Calculations
  const activeJobs = jobCards.filter(j => 
    !['Delivered', 'Completed'].includes(j.repairStatus)
  );

  const pendingBookings = bookings.filter(b => 
    ['New Request', 'Pending Confirmation'].includes(b.status)
  );

  const lowStockParts = inventory.filter(p => p.stockQuantity <= p.minStockAlert);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);

  // Status breakdown count for pipeline
  const statusPipeline = [
    { label: 'Received', key: 'Received', color: 'bg-slate-500' },
    { label: 'Diagnosis', key: 'Diagnosis', color: 'bg-blue-500' },
    { label: 'Parts Waiting', key: 'Parts Waiting', color: 'bg-amber-500' },
    { label: 'In Progress', key: 'Work In Progress', color: 'bg-purple-600' },
    { label: 'Testing / QC', key: 'Testing & Quality Check', color: 'bg-indigo-600' },
    { label: 'Ready for Delivery', key: 'Ready for Delivery', color: 'bg-emerald-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Date Range & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Real-time Operations Center
          </span>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Abu Bakar Road Workshop Overview
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range filter */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600">
            {(['today', '7days', '30days', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                  dateRange === range ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                {range === '7days' ? '7 Days' : range === '30days' ? '30 Days' : range}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

          {/* Quick Create Buttons */}
          <button
            onClick={onOpenNewJobCard}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Job Card
          </button>
          <button
            onClick={onOpenNewBooking}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Booking
          </button>
          <button
            onClick={onOpenNewInvoice}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Invoice
          </button>
        </div>
      </div>

      {/* 5 Master KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Active Jobs */}
        <div 
          onClick={() => onNavigateTab('jobcards')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Active Jobs</span>
            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {activeJobs.length}
          </div>
          <span className="text-[11px] text-red-600 font-medium">Bikes currently on bays</span>
        </div>

        {/* Pending Bookings */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Pending Bookings</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {pendingBookings.length}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Require approval</span>
        </div>

        {/* Total Customers */}
        <div 
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Customers</span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {customers.length}
          </div>
          <span className="text-[11px] text-purple-600 font-medium">Auto-linked in CRM</span>
        </div>

        {/* Workshop Revenue */}
        <div 
          onClick={() => onNavigateTab('invoices')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums truncate">
            PKR {totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Collected payments</span>
        </div>

        {/* Low Stock Alert */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className={`p-4 rounded-2xl border shadow-xs transition-all cursor-pointer group ${
            lowStockParts.length > 0 
              ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold">Low Stock Alert</span>
            <div className={`p-1.5 rounded-lg ${lowStockParts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black tabular-nums ${lowStockParts.length > 0 ? 'text-amber-900' : 'text-slate-900'}`}>
            {lowStockParts.length}
          </div>
          <span className={`text-[11px] font-medium ${lowStockParts.length > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
            {lowStockParts.length > 0 ? 'Parts below threshold' : 'All stock healthy'}
          </span>
        </div>
      </div>

      {/* Workshop Repair Pipeline Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Repair Workflow Pipeline</h3>
            <p className="text-xs text-slate-500">Live breakdown of active motorcycle repair bays</p>
          </div>
          <button
            onClick={() => onNavigateTab('jobcards')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            Manage All Job Cards <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {statusPipeline.map(pipe => {
            const count = jobCards.filter(j => j.repairStatus === pipe.key).length;
            return (
              <div 
                key={pipe.key}
                onClick={() => onNavigateTab('jobcards')}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${pipe.color} mx-auto mb-2`}></div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{count}</div>
                <div className="text-[11px] text-slate-600 font-medium truncate">{pipe.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Active Job Cards & Customer Inbound Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Job Cards Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Job Cards</h3>
              </div>
              <button
                onClick={() => onNavigateTab('jobcards')}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                View all ({jobCards.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {jobCards.slice(0, 4).map(job => (
                <div key={job.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-600">{job.jobCardNumber}</span>
                      <span className="font-semibold text-slate-900 truncate">{job.customerName}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5 truncate">
                      {job.bikeBrand} {job.bikeModel} {job.registrationNumber ? `(${job.registrationNumber})` : ''} · {job.repairStatus}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onPrintJobCard(job)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Print A4 Job Card"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      PKR {job.finalCost || job.estimatedCost ? (job.finalCost || job.estimatedCost).toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenNewJobCard}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            + Create New Motorcycle Job Card
          </button>
        </div>

        {/* Inbound Customer Inquiries & Leads Analytics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Lead Generation Clicks</h3>
              </div>
              <span className="text-[11px] text-slate-400">Recorded from real visitors</span>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-center">
                <MessageCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xl font-black text-slate-900 tabular-nums">
                  {analytics.whatsappClicks}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold uppercase mt-0.5">WhatsApp</div>
              </div>

              <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl text-center">
                <Phone className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <div className="text-xl font-black text-slate-900 tabular-nums">
                  {analytics.phoneCallClicks}
                </div>
                <div className="text-[10px] text-red-700 font-bold uppercase mt-0.5">Phone Calls</div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-center">
                <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xl font-black text-slate-900 tabular-nums">
                  {analytics.mapDirectionsClicks}
                </div>
                <div className="text-[10px] text-blue-700 font-bold uppercase mt-0.5">Map Routes</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Every click is connected directly to Hamza Autos Badami Bagh (+92 325 1814548) and the official Google Maps pin near Ali Hajvery Marriage Hall, Abu Bakar Road.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('leads')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            Review Inbound Contact Inquiries
          </button>
        </div>
      </div>
    </div>
  );
};
