'use client';

import React from 'react';
import { MOCK_INVENTORY } from '@/lib/mock-data';
import { Warehouse, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Warehouse className="w-4 h-4" /> Stock Reorder Triggers
          </div>
          <h1 className="text-2xl font-extrabold text-white">Inventory & Stock Alerts</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time stock level monitoring with automated purchase order triggers.</p>
        </div>
        <button
          onClick={() => alert('Stock Reorder Batch Issued')}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Trigger Automated Reorder
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
              <tr>
                <th className="pb-3 font-semibold">SKU / Item</th>
                <th className="pb-3 font-semibold">Current Stock</th>
                <th className="pb-3 font-semibold">Reserved</th>
                <th className="pb-3 font-semibold">Reorder Threshold</th>
                <th className="pb-3 font-semibold">Unit Cost</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_INVENTORY.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="py-3">
                    <h4 className="font-bold text-white">{item.productName}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{item.sku}</span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">{item.currentStock} units</td>
                  <td className="py-3 font-mono text-slate-400">{item.reservedStock} units</td>
                  <td className="py-3 font-mono text-slate-400">{item.reorderPoint} units</td>
                  <td className="py-3 font-mono text-emerald-400">{formatCurrency(item.unitCost)}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Low Stock'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {item.status}
                    </span>
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
