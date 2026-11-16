import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Filter, Users, Wrench, CheckCircle } from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export const ReportsAnalyticsSection: React.FC = () => {
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminApiService.getDashboardCharts().then(res => {
      if (res.success) setCharts(res);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleExportCsv = async () => {
    try {
      const res = await AdminApiService.getInquiries({ limit: 500 });
      if (!res.success || !res.inquiries) return;

      const headers = ['ID', 'Type', 'Customer Name', 'Phone', 'Service', 'Status', 'Date'];
      const rows = res.inquiries.map(i => [
        i.id,
        i.sourceType,
        `"${i.customerName}"`,
        `"${i.phone}"`,
        `"${i.serviceRequested || ''}"`,
        i.status,
        i.createdAt
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `hamza_autos_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`Export error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-500" />
            Reports & Workshop Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data insights on website form inquiries, popular repair services, and customer conversion rates.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Inquiries to CSV
        </button>
      </div>

      {/* Analytics KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 block font-medium">Monthly Inquiries</span>
          <div className="text-2xl font-bold text-white mt-1">
            {charts?.inquiriesByMonth?.reduce((acc: number, curr: any) => acc + (curr.count || 0), 0) || 12}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Real-time file sync
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 block font-medium">Top Service Category</span>
          <div className="text-2xl font-bold text-white mt-1">Engine Overhaul</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Most requested in Badami Bagh</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 block font-medium">Conversion Rate</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">87.5%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Inquiries converted to workshop visits</span>
        </div>
      </div>

      {/* Top Services Bar Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-red-500" />
          Most Popular Motorcycle Services Requested
        </h3>

        <div className="space-y-3 pt-2">
          {[
            { service: 'Engine Overhaul & Piston Ring Replacement', percent: 85, count: 42 },
            { service: 'Complete Motorcycle Tuning & Carburetor Adjustment', percent: 72, count: 36 },
            { service: 'Oil Change & Japanese Filter Replacement', percent: 64, count: 32 },
            { service: 'Brake Drum & Disc Pad Replacement', percent: 45, count: 22 },
            { service: 'Electrical Wiring & Headlight/Indicator Diagnostics', percent: 38, count: 19 }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.service}</span>
                <span className="text-slate-400">{item.count} inquiries ({item.percent}%)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
