import React, { useState } from 'react';
import { AdminTopbar } from '../components/admin/AdminTopbar';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminContent } from '../components/admin/AdminContent';
import { AdminTab } from '../views/AdminView';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  unreadNotesCount?: number;
  inquiryCount?: number;
  activeJobsCount?: number;
  pendingBookingsCount?: number;
  lowStockCount?: number;
  invoicesCount?: number;
  customersCount?: number;
  successNotice?: string | null;
  errorNotice?: string | null;
  tabLabel?: string;
  categoryLabel?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
  onLogout,
  unreadNotesCount = 0,
  inquiryCount = 0,
  activeJobsCount = 0,
  pendingBookingsCount = 0,
  lowStockCount = 0,
  invoicesCount = 0,
  customersCount = 0,
  successNotice,
  errorNotice,
  tabLabel = 'Dashboard',
  categoryLabel = 'Overview'
}) => {
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [collapsedDesktop, setCollapsedDesktop] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* 1. PROFESSIONAL ADMIN TOPBAR */}
      <AdminTopbar
        activeTab={activeTab}
        sidebarOpen={sidebarOpenMobile}
        onToggleSidebar={() => setSidebarOpenMobile(prev => !prev)}
        unreadNotesCount={unreadNotesCount}
        inquiryCount={inquiryCount}
        onNavigateTab={onSelectTab}
        onLogout={onLogout}
        tabLabel={tabLabel}
        categoryLabel={categoryLabel}
      />

      {/* 2. MAIN CONTAINER: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* Professional Sidebar Navigation */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
          collapsedDesktop={collapsedDesktop}
          onToggleCollapse={() => setCollapsedDesktop(prev => !prev)}
          activeJobsCount={activeJobsCount}
          pendingBookingsCount={pendingBookingsCount}
          lowStockCount={lowStockCount}
          unreadNotesCount={unreadNotesCount}
          invoicesCount={invoicesCount}
          customersCount={customersCount}
        />

        {/* Professional Content Area */}
        <AdminContent
          successNotice={successNotice}
          errorNotice={errorNotice}
        >
          {children}
        </AdminContent>
      </div>
    </div>
  );
};
