import React, { Suspense, lazy } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { InitialLoader } from '../components/interactive/InitialLoader';

const BookingModal = lazy(() => import('../components/BookingModal').then(m => ({ default: m.BookingModal })));
const SearchModal = lazy(() => import('../components/SearchModal').then(m => ({ default: m.SearchModal })));

interface PublicLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  initialBookingService?: string;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  onOpenBooking: (serviceTitle?: string) => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  currentView,
  onNavigate,
  bookingModalOpen,
  setBookingModalOpen,
  initialBookingService,
  searchModalOpen,
  setSearchModalOpen,
  onOpenBooking
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Automotive Initial Splash sequence */}
      <InitialLoader />

      {/* Persistent Universal Public Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenBooking={() => onOpenBooking()}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Persistent Global Public Footer */}
      <Footer onNavigate={onNavigate} onOpenBooking={() => onOpenBooking()} />

      {/* Floating CTA Buttons: Call Now, WhatsApp, Track Repair, Quick Appointment */}
      <FloatingActions onOpenBooking={() => onOpenBooking()} />

      {/* Global Appointment Booking Modal (Lazy-Loaded) */}
      {bookingModalOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={bookingModalOpen}
            initialService={initialBookingService}
            onClose={() => setBookingModalOpen(false)}
          />
        </Suspense>
      )}

      {/* Global Instant Search Modal (Lazy-Loaded) */}
      {searchModalOpen && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            onNavigate={onNavigate}
          />
        </Suspense>
      )}
    </div>
  );
};
