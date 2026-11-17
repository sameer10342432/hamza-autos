import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageTransitionVariants } from './utils/motion';
import { PublicLayout } from './layouts/PublicLayout';
import { 
  parseCurrentRoute, 
  navigateAdmin, 
  navigatePublic, 
  RouteInfo 
} from './utils/adminRouter';

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

import { getStoredSettings } from './utils/businessLogic';

// Lightweight fallback loader
const RouteLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center py-16" aria-busy="true">
    <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
  </div>
);

export default function App() {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(() => parseCurrentRoute());
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

  // Sync with URL pathname and hash on load and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseCurrentRoute();
      setRouteInfo(parsed);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Update public document title and canonical tags dynamically
  useEffect(() => {
    if (routeInfo.isAdmin) return; // AdminView sets its own title

    const settings = getStoredSettings();
    const baseTitle = (settings as any).siteTitle || settings.seoTitle || 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop Badami Bagh Lahore';

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
      'track-repair': `Track Bike Repair Status | Hamza Autos Live Tracker`,
      'customer-dashboard': `Customer Portal & Service History | Hamza Autos`,
      'customer-portal': `Customer Portal & Service History | Hamza Autos`,
      'not-found': `Page Not Found (404) | Hamza Autos`
    };

    document.title = titles[routeInfo.publicView] || baseTitle;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [routeInfo.publicView, routeInfo.publicSlug, routeInfo.isAdmin]);

  const handleNavigate = (view: string, slug?: string) => {
    if (view === 'admin') {
      navigateAdmin(slug || 'dashboard');
      return;
    }
    navigatePublic(view, slug);
  };

  const handleOpenBooking = (serviceTitle?: string) => {
    setInitialBookingService(serviceTitle);
    setBookingModalOpen(true);
  };

  // ==============================================================
  // 1. ADMIN PANEL LAYOUT & ROUTING (COMPLETELY INDEPENDENT)
  // No public header, no public footer, no floating WhatsApp button
  // ==============================================================
  if (routeInfo.isAdmin) {
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminView 
          initialTab={routeInfo.adminTab} 
          isLoginRoute={routeInfo.isLogin} 
        />
      </Suspense>
    );
  }

  // ==============================================================
  // 2. PUBLIC WEBSITE LAYOUT & ROUTING (ORIGINAL INTEGRITY PRESERVED)
  // Includes public header, navigation, pages, footer, WhatsApp CTA
  // ==============================================================
  const currentView = routeInfo.publicView;
  const currentSlug = routeInfo.publicSlug;

  return (
    <PublicLayout
      currentView={currentView}
      onNavigate={handleNavigate}
      bookingModalOpen={bookingModalOpen}
      setBookingModalOpen={setBookingModalOpen}
      initialBookingService={initialBookingService}
      searchModalOpen={searchModalOpen}
      setSearchModalOpen={setSearchModalOpen}
      onOpenBooking={handleOpenBooking}
    >
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

            {currentView === 'not-found' && (
              <NotFoundView onNavigate={handleNavigate} />
            )}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </PublicLayout>
  );
}
