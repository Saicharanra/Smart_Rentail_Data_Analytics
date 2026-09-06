'use client';

import React from 'react';
import Image from 'next/image';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { FolderTree, Plus, TrendingUp } from 'lucide-react';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            <FolderTree className="w-4 h-4" /> Taxonomy & Partition Indexing
          </div>
          <h1 className="text-2xl font-extrabold text-white">Categories Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Category partition mapping used for Delta Lake partitioning.</p>
        </div>
        <button
          onClick={() => alert('New Category Modal Simulated')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex gap-6 items-center"
          >
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 shrink-0">
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base truncate">{cat.name}</h3>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +{cat.growth}%
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                Total Products: <strong className="text-white">{cat.itemCount} SKUs</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
