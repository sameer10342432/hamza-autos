import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  FileText, 
  Calendar, 
  Wrench, 
  Package, 
  CreditCard, 
  ArrowRight, 
  Tag, 
  CheckCircle,
  Truck
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

interface GlobalSearchSectionProps {
  onNavigateTab: (tab: any) => void;
  initialQuery?: string;
}

export const GlobalSearchSection: React.FC<GlobalSearchSectionProps> = ({
  onNavigateTab,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await AdminApiService.globalSearch(searchTerm);
      if (res.success && res.results) {
        setResults(res.results);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error('Global search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      performSearch(query);
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Group results by record type
  const groupedResults: Record<string, any[]> = {};
  results.forEach(item => {
    if (!groupedResults[item.type]) {
      groupedResults[item.type] = [];
    }
    groupedResults[item.type].push(item);
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            UNIFIED SYSTEM INDEX
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Global Search Centre
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search across customers, CRM leads, appointments, repair job cards, spare parts, and invoices.
          </p>
        </div>
      </div>

      {/* 2. Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder="Search by customer name, phone number, bike model, PO number, or invoice reference..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-red-500 transition-colors bg-slate-50"
          />
        </div>

        <div className="pt-2.5 flex items-center justify-between text-xs text-slate-400">
          <span>Search matches across 12 workshop data stores in real time.</span>
          {loading && <span className="text-red-600 font-bold animate-pulse">Searching records...</span>}
        </div>
      </div>

      {/* 3. Results Overview */}
      {query.length >= 2 && (
        <div className="text-xs font-bold text-slate-600 px-1">
          Found <strong className="text-slate-900">{totalCount}</strong> matching records for "{query}"
        </div>
      )}

      {/* 4. Grouped Results Display */}
      {results.length === 0 && query.length >= 2 && !loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
          <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p>No matching workshop records found for "{query}".</p>
          <p className="text-[11px] text-slate-400 mt-1">Try searching by partial phone number, customer name, or motorcycle brand.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedResults).map(([type, items]) => (
            <div key={type} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {type} ({items.length})
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => onNavigateTab(item.tab)}
                    className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {item.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
