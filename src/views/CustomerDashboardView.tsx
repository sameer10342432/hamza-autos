import React, { useState, useEffect } from 'react';
import {
  Bike,
  Wrench,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Search,
  Plus,
  Printer,
  ChevronRight,
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw,
  Bell,
  Star,
  User,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  customerService,
  motorcycleService,
  bookingService,
  jobCardService,
  inspectionService,
  quotationService,
  invoiceService,
  paymentService,
  reminderService,
  feedbackService,
  whatsappService
} from '../services';
import {
  CustomerProfile,
  MotorcycleProfile,
  AppointmentBooking,
  JobCard,
  BikeInspectionReport,
  Quotation,
  WorkshopInvoice,
  PaymentRecord,
  MaintenanceReminderRecord,
  CustomerFeedbackRecord
} from '../types';
import { BUSINESS_INFO } from '../data/businessData';
import { SectionBackground } from '../components/backgrounds';
import { buttonPressProps } from '../utils/motion';

interface CustomerDashboardViewProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  onNavigate,
  onOpenBooking
}) => {
  // Authentication / Lookup State
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'bikes' | 'bookings' | 'jobs' | 'health' | 'quotations' | 'invoices' | 'reminders' | 'feedback'
  >('health');

  // Customer Data State
  const [motorcycles, setMotorcycles] = useState<MotorcycleProfile[]>([]);
  const [bookings, setBookings] = useState<AppointmentBooking[]>([]);
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [inspections, setInspections] = useState<BikeInspectionReport[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<WorkshopInvoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [reminders, setReminders] = useState<MaintenanceReminderRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedbackRecord[]>([]);

  // Selected sub-item state
  const [selectedInspection, setSelectedInspection] = useState<BikeInspectionReport | null>(null);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<MotorcycleProfile | null>(null);

  // New Motorcycle Modal State
  const [showAddBikeModal, setShowAddBikeModal] = useState(false);
  const [newBikeBrand, setNewBikeBrand] = useState('Honda');
  const [newBikeModel, setNewBikeModel] = useState('CD 70');
  const [newBikeYear, setNewBikeYear] = useState('2023');
  const [newBikeReg, setNewBikeReg] = useState('');
  const [newBikeMileage, setNewBikeMileage] = useState('');

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingService, setRatingService] = useState(5);
  const [ratingStaff, setRatingStaff] = useState(5);
  const [ratingQuality, setRatingQuality] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Customer Portal & Bike Health – Hamza Autos Badami Bagh';
    // Auto-check if previously logged in customer stored in sessionStorage
    const savedPhone = sessionStorage.getItem('hamza_customer_phone');
    if (savedPhone) {
      loadCustomerDataByPhone(savedPhone);
    }
  }, []);

  const loadCustomerDataByPhone = async (phone: string) => {
    setIsSearching(true);
    setAuthError(null);
    try {
      const foundCustomer = await customerService.findByPhone(phone);
      if (!foundCustomer) {
        setAuthError('No customer record found with this phone number. Try testing with "0300 1234567" or book your first service!');
        setIsSearching(false);
        return;
      }

      setCustomer(foundCustomer);
      sessionStorage.setItem('hamza_customer_phone', phone);

      // Load all associated records in parallel
      const [
        bikesList,
        bookingsList,
        jobsList,
        inspList,
        quotesList,
        invsList,
        remsList,
        fbsList
      ] = await Promise.all([
        motorcycleService.getByCustomerId(foundCustomer.id),
        bookingService.getByCustomerId(foundCustomer.id),
        jobCardService.getByCustomerId(foundCustomer.id),
        inspectionService.getByCustomerId(foundCustomer.id),
        quotationService.getByCustomerId(foundCustomer.id),
        invoiceService.getByCustomerId(foundCustomer.id),
        reminderService.getByCustomerId(foundCustomer.id),
        feedbackService.getByCustomerId(foundCustomer.id)
      ]);

      setMotorcycles(bikesList);
      if (bikesList.length > 0) setSelectedMotorcycle(bikesList[0]);

      setBookings(bookingsList);
      setJobCards(jobsList);
      setInspections(inspList);
      if (inspList.length > 0) setSelectedInspection(inspList[0]);

      setQuotations(quotesList);
      setInvoices(invsList);
      setReminders(remsList);
      setFeedbacks(fbsList);
    } catch (err: any) {
      console.error(err);
      setAuthError('Error loading workshop records from browser IndexedDB.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumberInput.trim()) return;
    loadCustomerDataByPhone(phoneNumberInput.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hamza_customer_phone');
    setCustomer(null);
    setPhoneNumberInput('');
    setMotorcycles([]);
    setBookings([]);
    setJobCards([]);
    setInspections([]);
    setQuotations([]);
    setInvoices([]);
    setReminders([]);
  };

  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    try {
      const newBike = await motorcycleService.create({
        customerId: customer.id,
        brand: newBikeBrand,
        model: newBikeModel,
        year: parseInt(newBikeYear) || new Date().getFullYear(),
        registrationNumber: newBikeReg || 'UNREGISTERED',
        engineCc: newBikeBrand === 'Honda' && newBikeModel.includes('125') ? 125 : 70,
        currentMileage: parseInt(newBikeMileage) || 0,
        fuelType: 'Petrol',
        notes: 'Added via Hamza Autos Customer Portal'
      });

      const updated = await motorcycleService.getByCustomerId(customer.id);
      setMotorcycles(updated);
      setSelectedMotorcycle(newBike);
      setShowAddBikeModal(false);
      setNewBikeReg('');
      setNewBikeMileage('');
    } catch (err) {
      console.error('Failed to add bike', err);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    try {
      await feedbackService.submit({
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phoneNumber,
        bikeModel: selectedMotorcycle ? `${selectedMotorcycle.brand} ${selectedMotorcycle.model}` : 'Motorcycle',
        overallRating: ratingOverall,
        serviceQualityRating: ratingQuality,
        staffBehaviorRating: ratingStaff,
        pricingRating: ratingService,
        comments: feedbackComments || 'Great service at Hamza Autos Badami Bagh!'
      });

      setFeedbackSuccessMsg('Thank you! Your feedback has been submitted to Hamza Autos management.');
      setShowFeedbackModal(false);
      setFeedbackComments('');
      const updatedFbs = await feedbackService.getByCustomerId(customer.id);
      setFeedbacks(updatedFbs);

      setTimeout(() => setFeedbackSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Helper for component condition pill
  const getConditionBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Good</span>;
      case 'Needs Attention':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Needs Attention</span>;
      case 'Requires Repair':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">Requires Repair</span>;
      case 'Not Inspected':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Not Inspected</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">N/A</span>;
    }
  };

  // Login view if not logged in
  if (!customer) {
    return (
      <div className="relative overflow-hidden min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6">
        <SectionBackground variant="light-generic" opacity={0.35} />
        <div className="relative z-10 max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Bike className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block">
              Local-First Customer Portal
            </span>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight font-heading mt-1">
              My Bike Health &amp; History
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Enter your registered mobile number to access your motorcycle inspection reports, service history, quotations and upcoming reminders.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-left">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registered Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0300 1234567"
                  value={phoneNumberInput}
                  onChange={(e) => setPhoneNumberInput(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden text-slate-900"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Local Storage...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>View My Bike Health Report</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 text-left space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Customer Profile:</span>
            </div>
            <p className="text-slate-600">
              Try phone <strong className="text-slate-900">0300 1234567</strong> (Muhammad Arshad · Honda CD 70) to see a complete 16-point inspection report, active job card and service history.
            </p>
          </div>

          <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Encrypted local browser storage (IndexedDB) · No cloud tracking</span>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW
  return (
    <div className="relative overflow-hidden pb-16">
      <SectionBackground variant="light-generic" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Customer Header Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Hamza Autos Customer Portal
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  Active Rider
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {customer.name}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span>📱 {customer.phoneNumber}</span>
                <span>📍 {customer.area}</span>
                <span>🔧 Total Visits: {customer.totalVisits}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenBooking()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book Workshop Service
            </button>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              Rate Workshop
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Feedback Success Notification */}
        {feedbackSuccessMsg && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackSuccessMsg}</span>
          </div>
        )}

        {/* Registered Motorcycles Switcher */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-900">My Registered Motorcycles ({motorcycles.length})</h2>
            </div>
            <button
              onClick={() => setShowAddBikeModal(true)}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Another Bike</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {motorcycles.map((bike) => {
              const isSelected = selectedMotorcycle?.id === bike.id;
              return (
                <div
                  key={bike.id}
                  onClick={() => setSelectedMotorcycle(bike)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-red-500 bg-red-50/50 ring-2 ring-red-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {bike.brand} {bike.model} ({bike.year})
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      {bike.registrationNumber}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Engine: {bike.engineCc}cc</span>
                    <span>Odometer: {(bike.currentMileage || 0).toLocaleString()} km</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'health' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Bike Health Report ({inspections.length})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'jobs' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Repair Job Cards ({jobCards.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quotations' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Quotations ({quotations.length})
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'invoices' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Invoices &amp; Payments ({invoices.length})
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reminders' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            Reminders ({reminders.length})
          </button>
        </div>

        {/* TAB 1: FEATURE 6 — MY BIKE HEALTH REPORT */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            {inspections.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
                <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Inspection Report Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  When you bring your motorcycle to Hamza Autos Badami Bagh, our master mechanic conducts a free 16-point diagnostic inspection and logs the roadworthiness checklist here.
                </p>
                <button
                  onClick={() => onOpenBooking('Free 16-Point Inspection')}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free 16-Point Diagnostic</span>
                </button>
              </div>
            ) : (
              selectedInspection && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
                  {/* Inspection Overview Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                          Hamza Autos Certified Inspection
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          #{selectedInspection.inspectionNumber}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                        16-Point Motorcycle Health Diagnostic
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Inspected on {new Date(selectedInspection.inspectionDate).toLocaleDateString()} by Master Mechanic {selectedInspection.inspectorName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrintReport}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Report
                      </button>
                      <a
                        href={whatsappService.buildInspectionLink(selectedInspection.inspectionNumber, selectedInspection.overallCondition, selectedInspection.customerPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Consult on WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Overall Condition Score Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Overall Health Rating
                      </span>
                      <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
                        {selectedInspection.overallCondition === 'Good' && (
                          <span className="text-emerald-600">Roadworthy &amp; Fit</span>
                        )}
                        {selectedInspection.overallCondition === 'Fair' && (
                          <span className="text-amber-600">Fair · Needs Attention</span>
                        )}
                        {selectedInspection.overallCondition === 'Requires Immediate Attention' && (
                          <span className="text-red-600">Requires Repair</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Maintenance Urgency
                      </span>
                      <div className="text-xl font-bold text-slate-900 mt-1">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          selectedInspection.maintenanceUrgency === 'High' ? 'bg-red-100 text-red-800' :
                          selectedInspection.maintenanceUrgency === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {selectedInspection.maintenanceUrgency} Urgency
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Estimated Overhaul Cost
                      </span>
                      <div className="text-xl font-black text-red-600 mt-1">
                        PKR {(selectedInspection.estimatedCost || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 16-POINT CHECKLIST GRID */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Comprehensive 16-Component Audit</span>
                      </h3>
                      <span className="text-xs text-slate-500">16 / 16 Points Checked</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedInspection.items.map((item, idx) => (
                        <div
                          key={item.componentName || item.category || idx}
                          className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-all space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">
                              {idx + 1}. {item.componentName || item.category}
                            </span>
                            {getConditionBadge(item.status)}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {item.notes || 'Component inspected in normal operational condition.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Repairs & Technician Comments */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Recommended Maintenance Actions</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                      {selectedInspection.recommendedRepairs.map((repair, i) => (
                        <li key={i}>{repair}</li>
                      ))}
                    </ul>
                    {selectedInspection.technicianNotes && (
                      <p className="text-[11px] text-amber-700 italic pt-1 border-t border-amber-200/60">
                        Technician advice: &ldquo;{selectedInspection.technicianNotes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE & PAST JOB CARDS */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {jobCards.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Job Cards On File</h3>
                <p className="text-xs text-slate-500">
                  When you check your motorcycle in for repair, a digital job card is generated with live tracking.
                </p>
              </div>
            ) : (
              jobCards.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-600">
                          {job.jobCardNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {job.repairStatus}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {job.bikeBrand} {job.bikeModel} {job.registrationNumber ? `(${job.registrationNumber})` : ''}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Problem: {job.problemReported}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Estimated Cost</span>
                      <span className="text-lg font-black text-slate-900">
                        PKR {(job.estimatedCost || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Received</span>
                      <span className="font-semibold text-slate-700">{job.receivedDate}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Assigned Mechanic</span>
                      <span className="font-semibold text-slate-700">{job.assignedMechanic || 'Master Mechanic'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Turnaround</span>
                      <span className="font-semibold text-slate-700">{job.estimatedCompletionDate || 'Same Day'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">Live Tracking</span>
                      <button
                        onClick={() => onNavigate('track-repair', job.jobCardNumber)}
                        className="font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Live Tracker</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Service Bookings</h3>
                <button
                  onClick={() => onOpenBooking()}
                  className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Book Workshop Appointment
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-red-600">
                        {booking.bookingNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {booking.serviceRequested} · {booking.bikeBrand} {booking.bikeModel}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      📅 {booking.appointmentDate} at {booking.appointmentTime}
                    </p>
                  </div>

                  <a
                    href={whatsappService.buildBookingLink(booking.bookingNumber, booking.customerName, booking.serviceRequested, booking.appointmentDate, booking.appointmentTime)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Confirmation</span>
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="space-y-4">
            {quotations.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Quotations Yet</h3>
                <p className="text-xs text-slate-500">Estimates and quotes issued before starting repair work will be displayed here.</p>
              </div>
            ) : (
              quotations.map((quote) => (
                <div key={quote.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-mono font-bold text-red-600">{quote.quotationNumber}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{quote.bikeBrand} {quote.bikeModel}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Estimate</span>
                      <span className="text-lg font-black text-slate-900">PKR {(quote.netTotal || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {quote.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-xs text-slate-600">
                        <span>{it.description} ({it.type}) x {it.quantity}</span>
                        <span className="font-semibold text-slate-900">PKR {(it.total || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 5: INVOICES & PAYMENTS */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Invoices On File</h3>
                <p className="text-xs text-slate-500">Official workshop receipts and billing records will appear here.</p>
              </div>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-600">{inv.invoiceNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {inv.paymentStatus}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{inv.customerName} · {inv.bikeBrand} {inv.bikeModel}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Amount</span>
                      <span className="text-lg font-black text-slate-900">PKR {(inv.totalAmount || 0).toLocaleString()}</span>
                      {inv.paymentStatus !== 'Paid' && (
                        <span className="text-xs font-bold text-red-600 block">
                          Due: PKR {((inv.totalAmount || 0) - (inv.paidAmount || 0)).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 6: MAINTENANCE REMINDERS */}
        {activeTab === 'reminders' && (
          <div className="space-y-4">
            {reminders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                <Bell className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">All Scheduled Maintenance Up To Date</h3>
                <p className="text-xs text-slate-500">We will notify you when your next oil change, tuning, brake inspection or tyre check is due.</p>
              </div>
            ) : (
              reminders.map((rem) => (
                <div key={rem.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-600">{rem.reminderType}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rem.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        rem.status === 'Due Today' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rem.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{rem.bikeModel}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Due Date: {rem.dueDate}</p>
                  </div>
                  <a
                    href={whatsappService.buildReminderLink(rem.customerName, rem.reminderType, rem.dueDate, rem.customerPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Book Service on WhatsApp</span>
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* MODAL: REGISTER ANOTHER MOTORCYCLE */}
      {showAddBikeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Register Another Motorcycle</h3>
            <form onSubmit={handleAddBike} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Make / Brand</label>
                <select
                  value={newBikeBrand}
                  onChange={(e) => setNewBikeBrand(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="Honda">Honda</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="United">United</option>
                  <option value="Road Prince">Road Prince</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CG 125, CD 70, YBR 125"
                  value={newBikeModel}
                  onChange={(e) => setNewBikeModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Year</label>
                  <input
                    type="number"
                    value={newBikeYear}
                    onChange={(e) => setNewBikeYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration #</label>
                  <input
                    type="text"
                    placeholder="e.g. LEA-22-1234"
                    value={newBikeReg}
                    onChange={(e) => setNewBikeReg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Mileage (km)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={newBikeMileage}
                  onChange={(e) => setNewBikeMileage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBikeModal(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                >
                  Save Motorcycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT WORKSHOP FEEDBACK */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Rate Hamza Autos Workshop</h3>
            <p className="text-xs text-slate-500">Your review helps us maintain high quality standards in Badami Bagh.</p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overall Rating (1 - 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingOverall(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingOverall ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{ratingOverall} / 5</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Comments &amp; Experience</label>
                <textarea
                  rows={3}
                  placeholder="Tell other riders about your tuning, parts authenticity or mechanic experience..."
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
