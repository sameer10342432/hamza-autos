import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { getStoredGallery } from '../utils/businessLogic';
import { X, ZoomIn, Wrench } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const [gallery] = useState<GalleryItem[]>(() => getStoredGallery());
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Workshop Photography
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Our Workshop Gallery in Badami Bagh
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Take a look at our clean mechanical service bays, precision 4-stroke engine rebuilds, diagnostic carburetor setups, and oil change facilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {gallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-3 bg-white/90 text-slate-900 rounded-full shadow-md">
                  <ZoomIn className="w-5 h-5" />
                </span>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 text-white rounded-md text-xs font-semibold backdrop-blur-xs">
                {item.category}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImage.image}
              alt={activeImage.title}
              className="w-full max-h-[70vh] object-cover"
            />
            <div className="p-6 bg-slate-900 text-white">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">
                {activeImage.category} · Hamza Autos Badami Bagh
              </span>
              <h3 className="text-lg font-bold">{activeImage.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{activeImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
