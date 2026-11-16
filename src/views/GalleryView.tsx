import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';
import { getStoredGallery } from '../utils/businessLogic';
import { X, ZoomIn, ChevronLeft, ChevronRight, Sparkles, Camera } from 'lucide-react';
import { staggerContainerVariants, staggerItemVariants, buttonPressProps } from '../utils/motion';

export const GalleryView: React.FC = () => {
  const [gallery] = useState<GalleryItem[]>(() => getStoredGallery());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(gallery.map(g => g.category)))];

  const filteredGallery = activeCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category === activeCategory);

  const activeImage = activeIndex !== null ? filteredGallery[activeIndex] : null;

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! + 1) % filteredGallery.length);
  }, [activeIndex, filteredGallery.length]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! - 1 + filteredGallery.length) % filteredGallery.length);
  }, [activeIndex, filteredGallery.length]);

  const handleClose = () => {
    setActiveIndex(null);
  };

  // Keyboard navigation (ESC, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleNext, handlePrev]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E50914] text-xs font-bold uppercase tracking-wider border border-red-100">
          <Camera className="w-3.5 h-3.5" />
          <span>Real Workshop Photography</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-heading">
          Our Workshop Gallery in Badami Bagh
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Take a look at our mechanical service bays, precision 4-stroke engine rebuilds, diagnostic carburetor setups, and oil change facilities at Abu Bakar Road, Badami Bagh.
        </p>
      </motion.div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setActiveIndex(null);
            }}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
              activeCategory === cat
                ? 'text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {activeCategory === cat && (
              <motion.span
                layoutId="galleryTab"
                className="absolute inset-0 bg-[#E50914] rounded-xl shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <motion.div 
        layout
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredGallery.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              variants={staggerItemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setActiveIndex(idx)}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-automotive hover:shadow-automotive-hover hover:border-red-300 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/45 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="p-3 bg-white/95 text-slate-900 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold"
                  >
                    <ZoomIn className="w-4 h-4 text-[#E50914]" />
                    <span>View Photo</span>
                  </motion.span>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-950/85 text-white rounded-md text-xs font-semibold backdrop-blur-xs border border-slate-800">
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-[#E50914] transition-colors mb-1.5 font-heading">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Animated Lightbox Modal with Next/Prev and ESC */}
      <AnimatePresence>
        {activeImage && activeIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm cursor-zoom-out"
              aria-hidden="true"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-700 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-950/75 hover:bg-[#E50914] text-white rounded-full transition-colors cursor-pointer shadow-md backdrop-blur-xs"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-slate-950/75 hover:bg-[#E50914] text-white rounded-full transition-colors cursor-pointer shadow-md backdrop-blur-xs"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-slate-950/75 hover:bg-[#E50914] text-white rounded-full transition-colors cursor-pointer shadow-md backdrop-blur-xs"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Active Photo */}
              <div className="relative bg-black max-h-[68vh] overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage.id}
                    src={activeImage.image}
                    alt={activeImage.title}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-h-[68vh] object-contain select-none"
                  />
                </AnimatePresence>
                
                {/* Counter Pill */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-slate-950/80 text-white rounded-full text-xs font-mono font-bold backdrop-blur-xs border border-slate-800">
                  {activeIndex + 1} / {filteredGallery.length}
                </div>
              </div>

              {/* Caption Bar */}
              <div className="p-6 bg-slate-950 text-white border-t border-slate-800">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">
                  {activeImage.category} · Hamza Autos Badami Bagh
                </span>
                <h3 className="text-lg font-bold font-heading">{activeImage.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{activeImage.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
