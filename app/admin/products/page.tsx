'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MOCK_PRODUCTS, Product } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Package, Plus, Search, Filter, Edit, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            <Package className="w-4 h-4" /> Catalog Management
          </div>
          <h1 className="text-2xl font-extrabold text-white">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">Manage retail SKUs, pricing, stock triggers, and supplier links.</p>
        </div>
        <button
          onClick={() => alert('Add New Product Modal Simulated')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add New SKU
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-white w-full"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
              <tr>
                <th className="pb-3 font-semibold">Item</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Supplier</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-900/40">
                  <td className="py-3 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                      <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{prod.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{prod.sku}</span>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-blue-400">{prod.category}</td>
                  <td className="py-3 font-mono font-bold text-white">{formatCurrency(prod.price)}</td>
                  <td className="py-3">
                    {prod.stock <= prod.reorderPoint ? (
                      <span className="text-amber-400 font-mono font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {prod.stock} (Low)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {prod.stock}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-slate-300">{prod.supplier}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
