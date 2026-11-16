import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageTransitionVariants } from './utils/motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';

// HomeView is eager for immediate first-paint LCP optimization
import { HomeView } from './views/HomeView';

// Route-based Code Splitting: Lazy-load all non-home views
const AboutView = lazy(() => import('./views/AboutView').then(m => ({ default: m.AboutView })));
const ServicesView = lazy(() => import('./views/ServicesView').then(m => ({ default: m.ServicesView })));
const ServiceDetailView = lazy(() => import('./views/ServiceDetailView').then(m => ({ default: m.ServiceDetailView })));
const BrandsView = lazy(() => import('./views/BrandsView').then(m => ({ default: m.BrandsView })));
const AreasView = lazy(() => import('./views/AreasView').then(m => ({ default: m.AreasView })));
const GalleryView = lazy(() => import('./views/GalleryView').then(m => ({ default: m.GalleryView })));
const ReviewsView = lazy(() => import('./views/ReviewsView').then(m => ({ default: m.ReviewsView })));
const BlogView = lazy(() => import('./views/BlogView').then(m => ({ default: m.BlogView })));
const ContactView = lazy(() => import('./views/ContactView').then(m => ({ default: m.ContactView })));
const LegalView = lazy(() => import('./views/LegalView').then(m => ({ default: m.LegalView })));
const AdminView = lazy(() => import('./views/AdminView').then(m => ({ default: m.AdminView })));
const CustomerDashboardView = lazy(() => import('./views/CustomerDashboardView').then(m => ({ default: m.CustomerDashboardView })));
const NotFoundView = lazy(() => import('./views/NotFoundView').then(m => ({ default: m.NotFoundView })));
const TrackRepairView = lazy(() => import('./views/TrackRepairView').then(m => ({ default: m.TrackRepairView })));

// Lazy-load on-demand modals
const BookingModal = lazy(() => import('./components/BookingModal').then(m => ({ default: m.BookingModal })));
const SearchModal = lazy(() => import('./components/SearchModal').then(m => ({ default: m.SearchModal })));

import { InitialLoader } from './components/interactive/InitialLoader';
import { getStoredSettings } from './utils/businessLogic';

// Lightweight fallback loader
const RouteLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center py-16" aria-busy="true">
    <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(undefined);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [initialBookingService, setInitialBookingService] = useState<string | undefined>(undefined);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global keyboard shortcut for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync with URL hash on load and popstate
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setCurrentView('home');
        setCurrentSlug(undefined);
        return;
      }
      const parts = hash.split('/');
      const view = parts[0];
      const slug = parts[1];

      if (view === 'services' && slug) {
        setCurrentView('service-detail');
        setCurrentSlug(slug);
        return;
      }
      if (view === 'brands' && slug) {
        setCurrentView('brand-detail');
        setCurrentSlug(slug);
        return;
      }
      if (view === 'areas' && slug) {
        setCurrentView('area-detail');
        setCurrentSlug(slug);
        return;
      }
      if (view === 'blog' && slug) {
        setCurrentView('blog');
        setCurrentSlug(slug);
        return;
      }

      const validViews = [
        'home', 
        'about', 
        'services', 
        'service-detail', 
        'brands', 
        'brand-detail', 
        'areas', 
        'area-detail', 
        'gallery', 
        'reviews', 
        'blog', 
        'contact', 
        'privacy', 
        'terms', 
        'sitemap', 
        'admin',
        'track-repair',
        'customer-dashboard',
        'customer-portal'
      ];

      if (validViews.includes(view)) {
        setCurrentView(view);
        setCurrentSlug(slug);
      } else {
        setCurrentView('not-found');
        setCurrentSlug(undefined);
      }
    };

    parseHash();
    window.addEventListener('popstate', parseHash);
    return () => window.removeEventListener('popstate', parseHash);
  }, []);

  // Update document title and canonical tags dynamically
  useEffect(() => {
    const settings = getStoredSettings();
    const baseTitle = settings.siteTitle || 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop Badami Bagh Lahore';

    const titles: Record<string, string> = {
      home: baseTitle,
      about: `About Hamza Autos | Master Bike Mechanic in Badami Bagh Lahore`,
      services: `Motorcycle Repair & Maintenance Services | Hamza Autos Lahore`,
      'service-detail': `Motorcycle Service | Hamza Autos Badami Bagh`,
      brands: `Motorcycle Brands We Repair (Honda, Yamaha, Suzuki, United) | Hamza Autos`,
      'brand-detail': `Brand Specialist Workshop | Hamza Autos Badami Bagh`,
      areas: `Areas We Serve in Lahore (Badami Bagh, Shadbagh, Misri Shah) | Hamza Autos`,
      'area-detail': `Motorcycle Mechanic Near You | Hamza Autos Lahore`,
      gallery: `Workshop Bay & Repair Gallery | Hamza Autos Badami Bagh`,
      reviews: `Customer Reviews & Testimonials | Hamza Autos Lahore`,
      blog: `Motorcycle Maintenance & Repair Blog | Hamza Autos`,
      contact: `Contact Hamza Autos | Workshop Location & Phone Badami Bagh`,
      privacy: `Privacy Policy | Hamza Autos`,
      terms: `Terms of Service | Hamza Autos`,
      sitemap: `HTML Sitemap | Hamza Autos Badami Bagh Lahore`,
      admin: `Workshop Operations Portal | Hamza Autos Admin`,
      'track-repair': `Track Bike Repair Status | Hamza Autos Live Tracker`,
      'customer-dashboard': `Customer Portal & Service History | Hamza Autos`,
      'customer-portal': `Customer Portal & Service History | Hamza Autos`,
      'not-found': `Page Not Found (404) | Hamza Autos`
    };

    document.title = titles[currentView] || baseTitle;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentView, currentSlug]);

  const handleNavigate = (view: string, slug?: string) => {
    let targetHash = `#/${view}`;
    if (slug) {
      targetHash += `/${slug}`;
    }
    window.location.hash = targetHash;
  };

  const handleOpenBooking = (serviceTitle?: string) => {
    setInitialBookingService(serviceTitle);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Automotive Initial Splash sequence */}
      <InitialLoader />

      {/* Persistent Universal Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Router with Framer Motion Page Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (currentSlug ? `-${currentSlug}` : '')}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <Suspense fallback={<RouteLoader />}>
              {currentView === 'home' && (
                <HomeView
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}

              {currentView === 'about' && (
                <AboutView
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}

              {((currentView === 'services' && currentSlug) || (currentView === 'service-detail' && currentSlug)) ? (
                <ServiceDetailView
                  slug={currentSlug}
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              ) : currentView === 'services' ? (
                <ServicesView
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              ) : null}

              {(currentView === 'brands' || currentView === 'brand-detail') && (
                <BrandsView
                  selectedSlug={currentSlug}
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}

              {(currentView === 'areas' || currentView === 'area-detail') && (
                <AreasView
                  selectedSlug={currentSlug}
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}

              {currentView === 'track-repair' && (
                <TrackRepairView
                  initialJobCard={currentSlug}
                  onNavigate={handleNavigate}
                />
              )}

              {currentView === 'gallery' && (
                <GalleryView />
              )}

              {currentView === 'reviews' && (
                <ReviewsView />
              )}

              {currentView === 'blog' && (
                <BlogView
                  initialSlug={currentSlug}
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}

              {currentView === 'contact' && (
                <ContactView />
              )}

              {(currentView === 'privacy' || currentView === 'terms' || currentView === 'sitemap') && (
                <LegalView type={currentView as 'privacy' | 'terms' | 'sitemap'} />
              )}

              {(currentView === 'customer-dashboard' || currentView === 'customer-portal') && (
                <CustomerDashboardView
                  onNavigate={handleNavigate}
                  onOpenBooking={handleOpenBooking}
                />
              )}

              {currentView === 'admin' && (
                <AdminView />
              )}

              {currentView === 'not-found' && (
                <NotFoundView onNavigate={handleNavigate} />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Global Footer */}
      <Footer onNavigate={handleNavigate} onOpenBooking={() => handleOpenBooking()} />

      {/* Floating CTA Buttons: Call Now, WhatsApp, Track Repair, Quick Appointment */}
      <FloatingActions onOpenBooking={() => handleOpenBooking()} />

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
            onNavigate={handleNavigate}
          />
        </Suspense>
      )}
    </div>
  );
}
