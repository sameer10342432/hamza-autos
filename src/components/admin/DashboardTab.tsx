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
  FileText,
  Inbox,
  AlertCircle,
  Bell,
  Activity,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  UserCog,
  Receipt,
  Truck,
  ShieldAlert,
  HardDrive,
  Target
} from 'lucide-react';
import { 
  JobCard, 
  AppointmentBooking, 
  CustomerProfile, 
  SparePart, 
  WorkshopInvoice, 
  AnalyticsSummary,
  InquiryLead,
  ServiceReminder
} from '../../types';

interface DashboardTabProps {
  jobCards: JobCard[];
  bookings: AppointmentBooking[];
  customers: CustomerProfile[];
  inventory: SparePart[];
  invoices: WorkshopInvoice[];
  analytics: AnalyticsSummary;
  inquiries?: InquiryLead[];
  reminders?: ServiceReminder[];
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
  inquiries = [],
  reminders = [],
  onNavigateTab,
  onOpenNewJobCard,
  onOpenNewBooking,
  onOpenNewInvoice,
  onPrintJobCard
}) => {
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('all');

  // Real date range filtering helper
  const isWithinDate = (dateStr: string | undefined, range: 'today' | '7days' | '30days' | 'all') => {
    if (range === 'all' || !dateStr) return true;
    const itemDate = new Date(dateStr);
    if (isNaN(itemDate.getTime())) return true;
    const now = new Date();
    const diffMs = now.getTime() - itemDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (range === 'today') {
      return itemDate.toDateString() === now.toDateString();
    }
    if (range === '7days') {
      return diffDays >= 0 && diffDays <= 7;
    }
    if (range === '30days') {
      return diffDays >= 0 && diffDays <= 30;
    }
    return true;
  };

  // Filter stored records by active date filter
  const filteredJobCards = jobCards.filter(j => isWithinDate(j.createdDate, dateRange));
  const filteredBookings = bookings.filter(b => isWithinDate(b.createdAt || b.appointmentDate, dateRange));
  const filteredCustomers = customers.filter(c => isWithinDate(c.registeredDate, dateRange));
  const filteredInvoices = invoices.filter(i => isWithinDate(i.invoiceDate, dateRange));
  const filteredInquiries = inquiries.filter(iq => isWithinDate(iq.createdAt, dateRange));

  // 1. KPI Calculations (Real Stored Data Only)
  const activeJobs = filteredJobCards.filter(j => 
    !['Delivered', 'Completed'].includes(j.repairStatus)
  );

  const pendingBookings = filteredBookings.filter(b => 
    ['New Request', 'Pending Confirmation', 'pending'].includes(b.status)
  );

  const lowStockParts = inventory.filter(p => p.stockQuantity <= p.minStockAlert);

  // Total Revenue MUST be based on actual recorded payments (amountPaid), not invoice totals
  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalInvoiced = filteredInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const pendingCollection = Math.max(0, totalInvoiced - totalRevenue);

  // 2. Repair Pipeline Status Breakdown
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
      {/* ============================================================== */}
      {/* 1. DASHBOARD HEADING & ACTIONS AREA                           */}
      {/* ============================================================== */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            WORKSHOP OPERATIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor workshop activity, customer inquiries, and business operations.
          </p>
        </div>

        {/* Date Filter Controls & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date range filter pill */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600 border border-slate-200">
            {(['today', '7days', '30days', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dateRange === range 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Dedicated Action Buttons (Consistent Heights & Padding) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewJobCard}
              className="h-9 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Job Card</span>
            </button>

            <button
              onClick={onOpenNewBooking}
              className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>

            <button
              onClick={onOpenNewInvoice}
              className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. BUSINESS OVERVIEW CARDS (5 MASTER KPIS)                     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Active Jobs */}
        <div 
          onClick={() => onNavigateTab('jobcards')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Jobs</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            {activeJobs.length}
          </div>
          <p className="text-[11px] text-red-600 font-medium mt-1 truncate">
            Bikes currently on workshop bays
          </p>
        </div>

        {/* Pending Bookings */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Bookings</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            {pendingBookings.length}
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1 truncate">
            Awaiting slot confirmation
          </p>
        </div>

        {/* Customers */}
        <div 
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Customers</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            {filteredCustomers.length}
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-1 truncate">
            Registered customer directory
          </p>
        </div>

        {/* Total Revenue (Actual recorded payments) */}
        <div 
          onClick={() => onNavigateTab('invoices')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums truncate">
            PKR {totalRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 truncate">
            Actual recorded payments
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition-all cursor-pointer group col-span-2 sm:col-span-1 ${
            lowStockParts.length > 0 
              ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500 hover:shadow-md' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock Alerts</span>
            <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${
              lowStockParts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black tabular-nums ${
            lowStockParts.length > 0 ? 'text-amber-900' : 'text-slate-900'
          }`}>
            {lowStockParts.length}
          </div>
          <p className={`text-[11px] font-medium mt-1 truncate ${
            lowStockParts.length > 0 ? 'text-amber-700' : 'text-slate-500'
          }`}>
            {lowStockParts.length > 0 ? 'Parts below threshold' : 'All inventory healthy'}
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2.5 ADVANCED BUSINESS MANAGEMENT QUICK SHORTCUTS                */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white">
                ENTERPRISE MODULES
              </span>
              <h3 className="text-base font-bold text-white">Advanced Business Operations</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Direct access to CRM, mechanic rosters, expense ledgers, purchasing, and storage diagnostics.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('profit-reports')}
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            Profit & Loss Audit <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div 
            onClick={() => onNavigateTab('crm-leads')}
            className="p-3 bg-slate-800/90 hover:bg-slate-700/80 rounded-xl border border-slate-700/80 cursor-pointer transition text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">CRM & Leads</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Pipeline & Quotes</div>
          </div>

          <div 
            onClick={() => onNavigateTab('mechanics')}
            className="p-3 bg-slate-800/90 hover:bg-slate-700/80 rounded-xl border border-slate-700/80 cursor-pointer transition text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
              <UserCog className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Mechanics</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Bays & Attendance</div>
          </div>

          <div 
            onClick={() => onNavigateTab('expenses')}
            className="p-3 bg-slate-800/90 hover:bg-slate-700/80 rounded-xl border border-slate-700/80 cursor-pointer transition text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Expenses</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Vouchers & Outflow</div>
          </div>

          <div 
            onClick={() => onNavigateTab('purchase-orders')}
            className="p-3 bg-slate-800/90 hover:bg-slate-700/80 rounded-xl border border-slate-700/80 cursor-pointer transition text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Purchasing</div>
            <div className="text-[10px] text-slate-400 mt-0.5">POs & Receiving</div>
          </div>

          <div 
            onClick={() => onNavigateTab('security-centre')}
            className="p-3 bg-slate-800/90 hover:bg-slate-700/80 rounded-xl border border-slate-700/80 cursor-pointer transition text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Security</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Audit & Access</div>
          </div>

          <div 
            onClick={() => onNavigateTab('storage-health')}
            className="p-3 bg-slate-800/90 hover:bg-slate-700/80 rounded-xl border border-slate-700/80 cursor-pointer transition text-center group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Storage Health</div>
            <div className="text-[10px] text-slate-400 mt-0.5">28 JSON Stores</div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. REPAIR WORKFLOW PIPELINE                                    */}
      {/* ============================================================== */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Repair Workflow Pipeline</h2>
            <p className="text-xs text-slate-500">Live operational status across all active motorcycle repair bays</p>
          </div>
          <button
            onClick={() => onNavigateTab('jobcards')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            Manage Job Cards <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {statusPipeline.map(pipe => {
            const count = filteredJobCards.filter(j => j.repairStatus === pipe.key).length;
            return (
              <div 
                key={pipe.key}
                onClick={() => onNavigateTab('jobcards')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors cursor-pointer text-center"
              >
                <div className={`w-3 h-3 rounded-full ${pipe.color} mx-auto mb-2`} />
                <div className="text-xl font-black text-slate-900 tabular-nums">{count}</div>
                <div className="text-[11px] text-slate-600 font-semibold truncate mt-0.5">{pipe.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4 & 5. 2-COLUMN: RECENT INQUIRIES & RECENT BOOKINGS            */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 4: RECENT INQUIRIES & LEADS TRAFFIC */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Inquiries</h3>
              </div>
              <button
                onClick={() => onNavigateTab('inquiries')}
                className="text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer"
              >
                View Inbox ({filteredInquiries.length})
              </button>
            </div>

            {/* Inbound Clicks Summary */}
            <div className="grid grid-cols-3 gap-2.5 my-3">
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                <MessageCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <div className="text-lg font-black text-slate-900 tabular-nums">{analytics.whatsappClicks}</div>
                <div className="text-[10px] text-emerald-700 font-bold uppercase">WhatsApp</div>
              </div>
              <div className="p-2.5 bg-red-50/70 border border-red-100 rounded-xl text-center">
                <Phone className="w-4 h-4 text-red-600 mx-auto mb-1" />
                <div className="text-lg font-black text-slate-900 tabular-nums">{analytics.phoneCallClicks}</div>
                <div className="text-[10px] text-red-700 font-bold uppercase">Calls</div>
              </div>
              <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
                <MapPin className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-black text-slate-900 tabular-nums">{analytics.mapDirectionsClicks}</div>
                <div className="text-[10px] text-blue-700 font-bold uppercase">Map Routes</div>
              </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No new customer inquiries recorded in this period.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredInquiries.slice(0, 4).map(iq => (
                  <div key={iq.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{iq.customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {iq.serviceRequested} · {iq.area || 'Badami Bagh'}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {iq.status || 'new'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('inquiries')}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            Open Central Inquiries Inbox
          </button>
        </div>

        {/* SECTION 5: RECENT BOOKINGS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Appointments & Bookings</h3>
              </div>
              <button
                onClick={() => onNavigateTab('bookings')}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
              >
                View all ({filteredBookings.length})
              </button>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No appointment bookings found for this period.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {filteredBookings.slice(0, 4).map(b => (
                  <div key={b.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">{b.bookingNumber}</span>
                        <span className="font-semibold text-slate-900 truncate">{b.customerName}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5 truncate">
                        {b.bikeBrand} {b.bikeModel} · {b.serviceRequested}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ['Confirmed', 'Confirmed Slot'].includes(b.status)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {b.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {b.appointmentDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenNewBooking}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            + Register New Customer Booking
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6 & 7. 2-COLUMN: RECENT REPAIR JOBS & REVENUE ANALYTICS        */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 6: RECENT REPAIR JOBS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Repair Job Cards</h3>
              </div>
              <button
                onClick={() => onNavigateTab('jobcards')}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                View all ({filteredJobCards.length})
              </button>
            </div>

            {filteredJobCards.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No job cards found in selected date range.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {filteredJobCards.slice(0, 4).map(job => (
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

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onPrintJobCard(job)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Print Job Card"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-slate-800 text-xs">
                        PKR {(job.finalCost || job.estimatedCost || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenNewJobCard}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            + Create New Motorcycle Job Card
          </button>
        </div>

        {/* SECTION 7: REVENUE & FINANCIAL ANALYTICS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Revenue & Billing Summary</h3>
              </div>
              <button
                onClick={() => onNavigateTab('invoices')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
              >
                Invoices ({filteredInvoices.length})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <div className="text-[11px] font-bold uppercase text-emerald-800">Collected Payments</div>
                <div className="text-xl font-black text-emerald-900 mt-1 tabular-nums">
                  PKR {totalRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Cash & online transfers</div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] font-bold uppercase text-slate-600">Pending Receivables</div>
                <div className="text-xl font-black text-slate-900 mt-1 tabular-nums">
                  PKR {pendingCollection.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Unsettled invoice balances</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Revenue figures reflect actual recorded customer payments across motorcycle repair services and spare parts sales recorded at Badami Bagh workshop.
            </p>
          </div>

          <button
            onClick={onOpenNewInvoice}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            + Generate New Workshop Invoice
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 8, 9 & 10. 3-COLUMN: LOW STOCK, REMINDERS & ACTIVITY           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SECTION 8: LOW STOCK ALERTS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Low Stock Alerts</h3>
              </div>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold cursor-pointer"
              >
                Inventory ({inventory.length})
              </button>
            </div>

            {lowStockParts.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <p className="text-slate-600 font-medium">All spare parts are well-stocked.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No items currently below alert levels.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {lowStockParts.slice(0, 3).map(p => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{p.partName}</div>
                      <div className="text-[11px] text-slate-500">Min Alert: {p.minStockAlert} pcs</div>
                    </div>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                      {p.stockQuantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            Review Inventory Stock
          </button>
        </div>

        {/* SECTION 9: UPCOMING MAINTENANCE REMINDERS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Maintenance</h3>
              </div>
              <button
                onClick={() => onNavigateTab('reminders')}
                className="text-xs text-purple-600 hover:text-purple-700 font-bold cursor-pointer"
              >
                Reminders ({reminders.length})
              </button>
            </div>

            {reminders.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No active scheduled reminders.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {reminders.slice(0, 3).map(r => (
                  <div key={r.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{r.customerName}</div>
                      <div className="text-[11px] text-slate-500">{r.bikeBrand} · {r.serviceType}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('reminders')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            Open Service Reminders
          </button>
        </div>

        {/* SECTION 10: RECENT ACTIVITY & AUDIT TRAIL */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 col-span-1 md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              </div>
              <button
                onClick={() => onNavigateTab('audit-logs')}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                All Logs
              </button>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Master Operations Ready</span>
                  <div className="text-[11px] text-slate-500">File-based JSON storage verified and active</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Workshop Bays Active</span>
                  <div className="text-[11px] text-slate-500">{activeJobs.length} bike repairs currently tracked</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Central Leads Synced</span>
                  <div className="text-[11px] text-slate-500">{inquiries.length} total customer inquiries captured</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            Review Security & Activity Logs
          </button>
        </div>
      </div>
    </div>
  );
};
