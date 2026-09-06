'use client';

import React from 'react';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Eye, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            <ShoppingBag className="w-4 h-4" /> Fulfillment System
          </div>
          <h1 className="text-2xl font-extrabold text-white">Order Operations</h1>
          <p className="text-xs text-slate-400 mt-1">Manage order statuses and track live transactional telemetry.</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
              <tr>
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-mono font-bold text-blue-400">{ord.id}</td>
                  <td className="py-3">
                    <h4 className="font-semibold text-white">{ord.customerName}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono">{ord.date}</td>
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
                  <td className="py-3 font-mono font-bold text-emerald-400">{formatCurrency(ord.total)}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/orders/${ord.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
