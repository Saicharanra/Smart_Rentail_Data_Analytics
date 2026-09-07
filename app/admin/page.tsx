'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { RevenueTrendChart } from '@/components/charts/RevenueTrendChart';
import { CategorySalesChart } from '@/components/charts/CategorySalesChart';
import { MOCK_ORDERS, MOCK_INVENTORY, MOCK_PRODUCTS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardOverview() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 312000,
    totalOrders: 2750,
    totalCustomers: 1420,
    totalProducts: 12,
  });

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch('/api/analytics/overview', { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && data.data) {
          setMetrics({
            totalRevenue: data.data.totalRevenue || 312000,
            totalOrders: data.data.totalOrders || 2750,
            totalCustomers: data.data.totalCustomers || 1420,
            totalProducts: data.data.totalProducts || 12,
          });
        }
      } catch (err) {
        console.error('Failed to fetch analytics overview:', err);
      }
    }
    fetchOverview();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">
            Azure Synapse DirectQuery Sync Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Business Intelligence Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time operational sales metrics, stock turnover triggers, and Medallion ETL stream status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/analytics"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            Open Full Synapse BI <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">{formatCurrency(metrics.totalRevenue)}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +14.8% vs last month
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">{metrics.totalOrders.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +12.2% vs last month
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Customers</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">{metrics.totalCustomers.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +18.5% retention
          </div>
        </div>

        {/* Active Products Catalog */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Products</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">{metrics.totalProducts} SKUs</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            DirectQuery Sync Active
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Revenue & Growth Forecast</h2>
              <span className="text-xs text-slate-400">Actual vs Azure Machine Learning Forecast</span>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-full">
              Gold Medallion Delta Table
            </span>
          </div>
          <RevenueTrendChart />
        </div>

        {/* Category Distribution Chart */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Category Sales Volume</h2>
            <span className="text-xs text-slate-400">Segment Revenue Distribution</span>
          </div>
          <CategorySalesChart />
        </div>
      </div>

      {/* Tables Row: Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Low Stock Warnings
            </div>
            <Link href="/admin/inventory" className="text-xs text-blue-400 hover:text-blue-300">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_INVENTORY.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{item.productName}</h4>
                  <span className="text-slate-500 font-mono">{item.sku}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-mono font-bold block">{item.currentStock} left</span>
                  <span className="text-slate-500 text-[10px]">Threshold: {item.reorderPoint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Recent Customer Orders</h2>
            <Link href="/admin/orders" className="text-xs text-blue-400 hover:text-blue-300">
              View Order Directory
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {MOCK_ORDERS.slice(0, 4).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40">
                    <td className="py-3 font-mono text-blue-400 font-semibold">{ord.id}</td>
                    <td className="py-3 text-slate-200">{ord.customerName}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-950/60 text-blue-400'
                            : 'bg-amber-950/60 text-amber-400'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {formatCurrency(ord.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
