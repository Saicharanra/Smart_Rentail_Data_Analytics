'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Truck, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
            <ShoppingBag className="w-4 h-4" /> Customer Orders
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order History & Tracking</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track live shipment statuses, estimated delivery windows, and item order history.
          </p>
        </div>

        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white font-mono text-base">{order.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : order.status === 'Shipped'
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4">
                  <span>Ordered on: <strong className="text-slate-200">{order.date}</strong></span>
                  <span>Items: <strong className="text-slate-200">{order.items.length}</strong></span>
                  <span>Payment: <strong className="text-slate-200">{order.paymentMethod}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Amount</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Track Order <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
