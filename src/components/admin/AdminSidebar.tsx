import React, { useEffect } from 'react';
import { 
  Wrench, 
  BarChart3, 
  Bell, 
  ShieldCheck, 
  Inbox, 
  Send, 
  Calendar, 
  FileCheck, 
  Star, 
  Users, 
  FileText, 
  Folder, 
  Tag, 
  Image as ImageIcon, 
  Layout, 
  Globe, 
  Compass, 
  HelpCircle, 
  CreditCard, 
  Package, 
  UserCheck, 
  MessageCircle, 
  Sliders, 
  Database, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Target,
  Clock,
  UserCog,
  Receipt,
  ArrowRightLeft,
  TrendingUp,
  Truck,
  ShoppingCart,
  PackageCheck,
  ShieldAlert,
  HardDrive,
  Store,
  Bike
} from 'lucide-react';
import { AdminTab } from '../../views/AdminView';

export interface NavItemConfig {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number | null;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  collapsedDesktop?: boolean;
  onToggleCollapse?: () => void;
  activeJobsCount?: number;
  pendingBookingsCount?: number;
  lowStockCount?: number;
  unreadNotesCount?: number;
  invoicesCount?: number;
  customersCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  collapsedDesktop = false,
  onToggleCollapse,
  activeJobsCount = 0,
  pendingBookingsCount = 0,
  lowStockCount = 0,
  unreadNotesCount = 0,
  invoicesCount = 0,
  customersCount = 0
}) => {
  // Prevent background scrolling when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMobile]);

  // Exactly 7 Unified Professional Functional Groups (Master System Architecture)
  const navSections: NavSectionConfig[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Wrench },
        { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'global-search', label: 'Global Search', icon: Search },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotesCount > 0 ? unreadNotesCount : null }
      ]
    },
    {
      title: 'CUSTOMER MANAGEMENT',
      items: [
        { id: 'inquiries', label: 'All Inquiries', icon: Inbox, badge: 'Live' },
        { id: 'crm-leads', label: 'CRM & Leads', icon: Target },
        { id: 'crm-followups', label: 'Follow-ups', icon: Clock },
        { id: 'customers', label: 'Customers', icon: Users, badge: customersCount > 0 ? customersCount : null }
      ]
    },
    {
      title: 'WORKSHOP OPERATIONS',
      items: [
        { id: 'bookings', label: 'Bookings', icon: Calendar, badge: pendingBookingsCount > 0 ? pendingBookingsCount : null },
        { id: 'jobcards', label: 'Repair Job Cards', icon: FileText, badge: activeJobsCount > 0 ? activeJobsCount : null },
        { id: 'mechanics', label: 'Mechanic Management', icon: UserCog },
        { id: 'attendance', label: 'Attendance', icon: UserCheck },
        { id: 'inventory', label: 'Inventory', icon: Package, badge: lowStockCount > 0 ? 'Low' : null },
        { id: 'reminders', label: 'Maintenance Reminders', icon: Bell }
      ]
    },
    {
      title: 'FINANCIAL MANAGEMENT',
      items: [
        { id: 'expenses', label: 'Expenses', icon: Receipt },
        { id: 'transactions', label: 'Income & Payments', icon: ArrowRightLeft },
        { id: 'profit-reports', label: 'Profit Reports', icon: TrendingUp },
        { id: 'quotations', label: 'Quotations', icon: FileCheck },
        { id: 'invoices', label: 'Invoices', icon: CreditCard, badge: invoicesCount > 0 ? invoicesCount : null }
      ]
    },
    {
      title: 'PURCHASING',
      items: [
        { id: 'suppliers', label: 'Suppliers', icon: Truck },
        { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
        { id: 'goods-receiving', label: 'Goods Receiving', icon: PackageCheck },
        { id: 'supplier-payments', label: 'Supplier Payments', icon: CreditCard }
      ]
    },
    {
      title: 'WEBSITE MANAGEMENT',
      items: [
        { id: 'blogs', label: 'Blog Management', icon: FileText },
        { id: 'contact-submissions', label: 'Form Submissions', icon: Send },
        { id: 'services', label: 'Services', icon: Wrench },
        { id: 'brands', label: 'Brands', icon: ShieldCheck },
        { id: 'media-library', label: 'Media Library', icon: ImageIcon },
        { id: 'seo', label: 'SEO Management', icon: Globe }
      ]
    },
    {
      title: 'SHOP MANAGEMENT',
      items: [
        { id: 'shop-dashboard', label: 'Shop Dashboard', icon: Store },
        { id: 'shop-products', label: 'Products & Parts', icon: Package },
        { id: 'shop-categories', label: 'Categories', icon: Tag },
        { id: 'shop-brands', label: 'Bike Models', icon: Bike },
        { id: 'shop-inventory', label: 'Stock & Inventory', icon: Sliders },
        { id: 'shop-orders', label: 'Customer Orders', icon: ShoppingCart },
        { id: 'shop-payments', label: 'Payment Audit', icon: CreditCard },
        { id: 'shop-shipping', label: 'Shipping & Delivery', icon: Truck },
        { id: 'shop-settings', label: 'Store Settings', icon: SettingsIcon }
      ]
    },
    {
      title: 'SYSTEM MANAGEMENT',
      items: [
        { id: 'security-centre', label: 'Security Centre', icon: ShieldAlert },
        { id: 'storage-health', label: 'Storage Health', icon: HardDrive },
        { id: 'backup-restore', label: 'Data Backup & Recovery', icon: Database },
        { id: 'audit-logs', label: 'Activity Logs', icon: ShieldCheck },
        { id: 'settings', label: 'Settings', icon: SettingsIcon }
      ]
    }
  ];

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:z-30 md:static bg-[#0F172A] border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out select-none shadow-xl md:shadow-none ${
          collapsedDesktop ? 'md:w-20' : 'md:w-64 lg:w-72'
        } ${
          isOpenMobile 
            ? 'w-72 sm:w-80 translate-x-0' 
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex md:hidden items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-extrabold text-xs shadow">
              HA
            </div>
            <div>
              <div className="text-sm font-bold text-white">Hamza Autos Admin</div>
              <div className="text-[10px] text-slate-400">Workshop Management</div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {/* Group Title (hidden when desktop collapsed) */}
              <div className={`px-3 pb-1 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase transition-opacity ${
                collapsedDesktop ? 'hidden' : 'block'
              }`}>
                {section.title}
              </div>

              {/* Items in Group */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (isOpenMobile) onCloseMobile();
                      }}
                      title={collapsedDesktop ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer relative ${
                        isActive
                          ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/30'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      {/* Active Red Indicator bar when not active */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full hidden" />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon 
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive 
                              ? 'text-white' 
                              : 'text-slate-400 group-hover:text-white'
                          }`} 
                        />
                        <span className={`truncate text-left ${collapsedDesktop ? 'hidden' : 'block'}`}>
                          {item.label}
                        </span>
                      </div>

                      {/* Badge Counter */}
                      {item.badge !== undefined && item.badge !== null && !collapsedDesktop && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : typeof item.badge === 'string' && item.badge === 'Low'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700/80'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Collapse / Expand Footer Bar */}
        {onToggleCollapse && (
          <div className="hidden md:flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-400">
            {!collapsedDesktop && (
              <span className="text-[11px] font-medium text-slate-400 truncate">
                v2.6 Master Admin
              </span>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer mx-auto md:mx-0"
              title={collapsedDesktop ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsedDesktop ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsedDesktop ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
