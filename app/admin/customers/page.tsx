'use client';

import React from 'react';
import Image from 'next/image';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Users, Award, Mail } from 'lucide-react';

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">
            <Users className="w-4 h-4" /> Customer Segmentation
          </div>
          <h1 className="text-2xl font-extrabold text-white">Customer Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Customer LTV, order frequencies, and segment classifications.</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
              <tr>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Segment</th>
                <th className="pb-3 font-semibold">Orders Count</th>
                <th className="pb-3 font-semibold">Total Spend (LTV)</th>
                <th className="pb-3 font-semibold">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_CUSTOMERS.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-900/40">
                  <td className="py-3 flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <Image src={cust.avatar} alt={cust.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{cust.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{cust.email}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.segment === 'VIP'
                          ? 'bg-purple-950/60 text-purple-400 border border-purple-800/60'
                          : cust.segment === 'Regular'
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {cust.segment}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-300">{cust.ordersCount} orders</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{formatCurrency(cust.totalSpent)}</td>
                  <td className="py-3 text-slate-400">{cust.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
