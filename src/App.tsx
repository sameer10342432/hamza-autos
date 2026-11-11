import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { BookingModal } from './components/BookingModal';

import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ServicesView } from './views/ServicesView';
import { ServiceDetailView } from './views/ServiceDetailView';
import { BrandsView } from './views/BrandsView';
import { AreasView } from './views/AreasView';
import { GalleryView } from './views/GalleryView';
import { ReviewsView } from './views/ReviewsView';
import { BlogView } from './views/BlogView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';
import { AdminView } from './views/AdminView';
import { NotFoundView } from './views/NotFoundView';
import { TrackRepairView } from './views/TrackRepairView';
import { SearchModal } from './components/SearchModal';

import { getStoredSettings } from './utils/businessLogic';

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
        'track-repair'
      ];

      if (validViews.includes(view)) {
        setCurrentView(view);
        setCurrentSlug(slug);
      } else {
        setCurrentView('404');
        setCurrentSlug(undefined);
      }
    };

    parseHash();
    window.addEventListener('popstate', parseHash);
    window.addEventListener('hashchange', parseHash);
    return () => {
      window.removeEventListener('popstate', parseHash);
      window.removeEventListener('hashchange', parseHash);
    };
  }, []);

  // Update dynamic page title based on view
  useEffect(() => {
    const settings = getStoredSettings();
    if (currentView === 'home') {
      document.title = settings.seoTitle || "Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore";
    } else if (currentView === 'about') {
      document.title = "About Hamza Autos – Motorcycle Workshop Badami Bagh Lahore";
    } else if (currentView === 'services') {
      document.title = "Motorcycle Repair & Maintenance Services – Hamza Autos Badami Bagh";
    } else if (currentView === 'track-repair') {
      document.title = "Track Motorcycle Repair Status – Hamza Autos Badami Bagh";
    } else if (currentView === 'brands' || currentView === 'brand-detail') {
      document.title = currentSlug
        ? `${currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1)} Motorcycle Repair – Hamza Autos Badami Bagh`
        : "Motorcycle Brands We Service – Honda, Yamaha, Suzuki, United | Hamza Autos";
    } else if (currentView === 'areas' || currentView === 'area-detail') {
      document.title = currentSlug
        ? `Motorcycle Repair for ${currentSlug.replace(/-/g, ' ').toUpperCase()} Lahore – Hamza Autos`
        : "Areas We Serve in Lahore – Badami Bagh, Shadbagh, Misri Shah | Hamza Autos";
    } else if (currentView === 'gallery') {
      document.title = "Workshop Photography Gallery – Hamza Autos Badami Bagh";
    } else if (currentView === 'reviews') {
      document.title = "Customer Reviews & Testimonials – Hamza Autos Lahore";
    } else if (currentView === 'blog') {
      document.title = "Motorcycle Maintenance Articles & Riding Tips – Hamza Autos";
    } else if (currentView === 'contact') {
      document.title = "Contact Hamza Autos – Phone, WhatsApp & Map Directions Badami Bagh";
    } else if (currentView === 'admin') {
      document.title = "Owner Dashboard – Hamza Autos Portal";
    } else if (currentView === 'privacy') {
      document.title = "Privacy Policy – Hamza Autos Badami Bagh";
    } else if (currentView === 'terms') {
      document.title = "Terms & Conditions – Hamza Autos Badami Bagh";
    } else if (currentView === 'sitemap') {
      document.title = "HTML Sitemap & Navigation Directory – Hamza Autos";
    } else if (currentView === '404') {
      document.title = "Page Not Found (404) – Hamza Autos Badami Bagh";
    }
  }, [currentView, currentSlug]);

  const handleNavigate = (view: string, slug?: string) => {
    setCurrentView(view);
    setCurrentSlug(slug);
    if (slug) {
      window.location.hash = `#/${view}/${slug}`;
    } else if (view !== 'home') {
      window.location.hash = `#/${view}`;
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceName?: string) => {
    setInitialBookingService(serviceName);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 pb-16 sm:pb-0">
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

        {currentView === 'admin' && (
          <AdminView />
        )}

        {currentView === '404' && (
          <NotFoundView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Actions: WhatsApp Creator + Mobile Sticky Action Bar */}
      <FloatingActions onOpenBooking={handleOpenBooking} />

      {/* Interactive Service Booking & Lead Generation Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        initialService={initialBookingService}
        onClose={() => setBookingModalOpen(false)}
      />

      {/* Global Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
