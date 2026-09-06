'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Server,
  Zap,
  IndianRupee,
  ShoppingBag,
  Users,
  ShieldCheck
} from 'lucide-react';
import { RevenueTrendChart } from '@/components/charts/RevenueTrendChart';
import { CategorySalesChart } from '@/components/charts/CategorySalesChart';
import { formatCurrency } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <Server className="w-4 h-4" /> Azure Synapse SQL Dedicated Pool
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Power BI & Synapse Business Intelligence
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Gold Medallion analytics workspace providing sub-second dimensional queries and automated ML sales predictions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono">
            <Calendar className="w-4 h-4 text-blue-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-none text-white font-sans"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Q3 2026</option>
              <option value="ytd">Year-to-Date (2026)</option>
            </select>
          </div>

          <button
            onClick={() => alert('Simulated Power BI Executive PDF Report Export')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400 block">Gross Sales</span>
          <div className="text-2xl font-bold font-mono text-white">{formatCurrency(312000)}</div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.8% YoY
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400 block">Total Orders</span>
          <div className="text-2xl font-bold font-mono text-white">2,750</div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.2% Growth
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400 block">Avg Order Value (AOV)</span>
          <div className="text-2xl font-bold font-mono text-white">{formatCurrency(113.45)}</div>
          <span className="text-[11px] text-blue-400 font-semibold">+4.1% Basket Size</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400 block">Customer LTV</span>
          <div className="text-2xl font-bold font-mono text-white">{formatCurrency(3392)}</div>
          <span className="text-[11px] text-purple-400 font-semibold">High Retention</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs text-slate-400 block">Azure Sync Latency</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">&lt; 140ms</div>
          <span className="text-[11px] text-emerald-400 font-semibold">DirectQuery Live</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Revenue Stream & ML Forecast</h2>
              <span className="text-xs text-slate-400">Azure Synapse Gold Fact_Sales Aggregations</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
              Gold Delta Partition
            </span>
          </div>
          <RevenueTrendChart />
        </div>

        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Category Revenue Share</h2>
              <span className="text-xs text-slate-400">Product Line Sales Distribution</span>
            </div>
          </div>
          <CategorySalesChart />
        </div>
      </div>

      {/* Azure Synapse Architectural Bridge Explainer */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Azure Synapse & Power BI DirectQuery Integration</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The Gold Medallion layer in ADLS Gen2 is indexed using Delta Lake Z-Ordering for instant Power BI DirectQuery response times without data duplication.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="text-blue-400 font-mono font-semibold block">Star Schema Data Model</span>
            <p className="text-slate-400">Fact_Sales joined with Dim_Customer, Dim_Product, and Dim_Date tables.</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="text-emerald-400 font-mono font-semibold block">Columnstore Storage Index</span>
            <p className="text-slate-400">Parquet compressed columnstore providing 10x query compression ratio.</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="text-purple-400 font-mono font-semibold block">Row-Level Security (RLS)</span>
            <p className="text-slate-400">Role-based access control protecting sensitive regional financial data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
