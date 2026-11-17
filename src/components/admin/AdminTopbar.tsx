import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Inbox, 
  Bell, 
  LogOut, 
  User, 
  Settings, 
  Key, 
  ChevronDown, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react';
import { AdminTab } from '../../views/AdminView';

interface AdminTopbarProps {
  activeTab: AdminTab;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  unreadNotesCount: number;
  inquiryCount?: number;
  onNavigateTab: (tab: AdminTab) => void;
  onLogout: () => void;
  tabLabel?: string;
  categoryLabel?: string;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  activeTab,
  sidebarOpen,
  onToggleSidebar,
  unreadNotesCount,
  inquiryCount = 0,
  onNavigateTab,
  onLogout,
  tabLabel = 'Dashboard',
  categoryLabel = 'Overview'
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global shortcut (Ctrl+K or Cmd+K) to open Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onNavigateTab('global-search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateTab]);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
      {/* LEFT: Mobile Toggle + Monogram Brand + Breadcrumb Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close Navigation Sidebar' : 'Open Navigation Sidebar'}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white md:hidden transition-colors cursor-pointer shrink-0"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Monogram Brand */}
        <div 
          onClick={() => onNavigateTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-900/40 group-hover:scale-105 transition-transform">
            HA
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-extrabold text-white tracking-tight leading-tight flex items-center gap-1.5">
              <span>Hamza Autos</span>
              <span className="px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                Admin
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Workshop Operations Portal
            </div>
          </div>
        </div>

        {/* Desktop Breadcrumb Navigation */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400 truncate">
          <span className="uppercase text-[10px] font-bold tracking-wider text-slate-400">{categoryLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-white font-semibold truncate">{tabLabel}</span>
        </div>
      </div>

      {/* RIGHT: Global Search + Quick Inbox + Notifications + Profile Dropdown + Quick Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={() => onNavigateTab('global-search')}
          aria-label="Global Search across workshop records (Ctrl+K)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'global-search'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Search all records (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden lg:inline">Search</span>
          <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.2 text-[9px] bg-slate-900 text-slate-400 rounded border border-slate-700 font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Central Inbox Button */}
        <button
          onClick={() => onNavigateTab('inquiries')}
          aria-label="Open Central Inquiries Inbox"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <Inbox className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden md:inline">Central Inbox</span>
          {inquiryCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white">
              {inquiryCount}
            </span>
          )}
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigateTab('notifications')}
          aria-label="View Notifications"
          className={`relative p-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Public Website Preview Link */}
        <a
          href="#/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Public Website in new tab"
          className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700/50"
            aria-expanded={profileDropdownOpen}
            aria-label="Admin Profile Menu"
          >
            <div className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <div className="font-bold text-white">Admin</div>
              <div className="text-[10px] text-slate-400">Master Manager</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Menu Modal */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-800">
                <div className="font-bold text-white text-sm">Hamza Autos Admin</div>
                <div className="text-[11px] text-slate-400">Abu Bakar Road, Badami Bagh</div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Super Admin Active
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <Key className="w-4 h-4 text-slate-400" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sign Out Button */}
        <button
          onClick={onLogout}
          aria-label="Sign Out"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/15 text-red-400 hover:bg-red-600/25 text-xs font-semibold transition-colors cursor-pointer"
          title="Sign Out of Admin Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
