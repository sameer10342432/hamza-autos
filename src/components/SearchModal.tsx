import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Wrench, Shield, BookOpen, MapPin, HelpCircle, ArrowRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { performSiteSearch } from '../utils/workshopLogic';
import { SearchResultItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, slug?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    const matches = performSiteSearch(val);
    setResults(matches);
  };

  const handleSelectResult = (item: SearchResultItem) => {
    onClose();
    onNavigate(item.view, item.slug);
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Service':
        return <Wrench className="w-4 h-4 text-red-600" />;
      case 'Brand':
        return <Shield className="w-4 h-4 text-amber-600" />;
      case 'Article':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'Area':
        return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'FAQ':
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case 'Part':
        return <Package className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] z-10"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search Services and Knowledge Base"
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-slate-200 p-4 sm:p-5 flex items-center gap-3 bg-slate-50/50">
              <Search className="w-5 h-5 text-red-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search motorcycle services, tuning, engine overhauls, Honda, Badami Bagh..."
                className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
              />
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {query.trim() === '' ? (
                <div className="p-6 text-center text-xs text-slate-500 space-y-3">
                  <span className="font-semibold block text-slate-700">Quick Searches:</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Engine Overhaul', 'Carburetor Tuning', 'Honda CG 125', 'Yamaha YBR Disc Brake', 'Oil Change', 'Badami Bagh Directions', 'Lorry Adda Route'].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleQueryChange(s)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-xl text-xs transition-colors cursor-pointer font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                    Found {results.length} Matching Results
                  </span>
                  {results.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleSelectResult(res)}
                      className="p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl shrink-0 mt-0.5 group-hover:bg-red-50 transition-colors">
                          {getCategoryIcon(res.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                              {res.title}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {res.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {res.snippet}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <span className="font-bold text-slate-700 block">No results found for "{query}"</span>
                  <p>Try searching for mechanical symptoms like "smoke", "tuning", "brakes", or bike brands like "Honda", "Yamaha".</p>
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-5">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">ESC</kbd> to exit search</span>
              <span className="font-medium">Hamza Autos · Badami Bagh</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
