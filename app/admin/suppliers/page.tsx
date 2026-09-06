'use client';

import React from 'react';
import { MOCK_SUPPLIERS } from '@/lib/mock-data';
import { Truck, Star, Phone, Mail } from 'lucide-react';

export default function AdminSuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            <Truck className="w-4 h-4" /> Supply Chain Integration
          </div>
          <h1 className="text-2xl font-extrabold text-white">Suppliers & Vendors</h1>
          <p className="text-xs text-slate-400 mt-1">Vendor performance metrics, lead times, and active stock orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_SUPPLIERS.map((sup) => (
          <div key={sup.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{sup.name}</h3>
              <div className="flex items-center text-amber-400 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {sup.rating}
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <p>Contact: <strong className="text-white">{sup.contactPerson}</strong></p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {sup.email}</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {sup.phone}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500">Lead Time: <strong className="text-white">{sup.leadTimeDays} days</strong></span>
              <span className="text-blue-400">{sup.activeOrdersCount} PO Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
