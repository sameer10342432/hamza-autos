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
import { updatePageSeo } from './utils/seoHeadManager';

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

// Shop Lazy-loaded Views
const ShopHomeView = lazy(() => import('./views/shop/ShopHomeView').then(m => ({ default: m.ShopHomeView })));
const ShopProductsView = lazy(() => import('./views/shop/ShopProductsView').then(m => ({ default: m.ShopProductsView })));
const ShopProductDetailView = lazy(() => import('./views/shop/ShopProductDetailView').then(m => ({ default: m.ShopProductDetailView })));
const ShopCartView = lazy(() => import('./views/shop/ShopCartView').then(m => ({ default: m.ShopCartView })));
const ShopCheckoutView = lazy(() => import('./views/shop/ShopCheckoutView').then(m => ({ default: m.ShopCheckoutView })));
const ShopOrderConfirmationView = lazy(() => import('./views/shop/ShopOrderConfirmationView').then(m => ({ default: m.ShopOrderConfirmationView })));
const ShopTrackOrderView = lazy(() => import('./views/shop/ShopTrackOrderView').then(m => ({ default: m.ShopTrackOrderView })));

import { getStoredSettings } from './utils/businessLogic';
import { CartProvider } from './context/CartContext';

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

  // Update document title, canonical, meta tags, and structured data dynamically
  useEffect(() => {
    updatePageSeo(routeInfo);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [routeInfo]);

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
    <CartProvider>
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

              {/* ONLINE SHOP SECTION */}
              {currentView === 'shop' && (
                <ShopHomeView onNavigate={handleNavigate} />
              )}

              {(currentView === 'shop-products' || currentView === 'shop-categories') && (
                <ShopProductsView onNavigate={handleNavigate} />
              )}

              {currentView === 'shop-product' && (
                <ShopProductDetailView slug={currentSlug || ''} onNavigate={handleNavigate} />
              )}

              {currentView === 'shop-cart' && (
                <ShopCartView onNavigate={handleNavigate} />
              )}

              {currentView === 'shop-checkout' && (
                <ShopCheckoutView onNavigate={handleNavigate} />
              )}

              {currentView === 'shop-order-confirmation' && (
                <ShopOrderConfirmationView orderNumber={currentSlug || ''} onNavigate={handleNavigate} />
              )}

              {currentView === 'shop-track-order' && (
                <ShopTrackOrderView onNavigate={handleNavigate} />
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
    </CartProvider>
  );
}
