'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Warehouse,
  Search,
  Filter,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  Save,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/utils/product-images';

interface InventoryRecord {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  categoryName: string;
  unitPrice: number;
  imageUrl?: string;
  storeId: string;
  storeName: string;
  storeCode: string;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  status: 'IN STOCK' | 'LOW STOCK' | 'CRITICAL OUT';
  updatedAt: string;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [stores, setStores] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Edit stock modal
  const [editingItem, setEditingItem] = useState<InventoryRecord | null>(null);
  const [editQty, setEditQty] = useState('');
  const [editReorder, setEditReorder] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedStore !== 'All') params.set('storeId', selectedStore);
      if (selectedStatus !== 'All') params.set('stockStatus', selectedStatus);

      const res = await fetch(`/api/admin/inventory?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setInventory(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/admin/stores', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.data) setStores(data.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [search, selectedStore, selectedStatus]);

  const handleOpenEdit = (item: InventoryRecord) => {
    setEditingItem(item);
    setEditQty(String(item.quantity));
    setEditReorder(String(item.reorderLevel));
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const parsedQty = parseInt(editQty, 10);
    const parsedReorder = parseInt(editReorder, 10);

    // Frontend validation check
    if (isNaN(parsedQty) || parsedQty < 0) {
      setToast({ type: 'error', message: 'Inventory quantity cannot be negative (must be >= 0).' });
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          quantity: parsedQty,
          reorderLevel: isNaN(parsedReorder) ? 10 : parsedReorder,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: 'success', message: `Stock for "${editingItem.productName}" updated to ${parsedQty} units.` });
        setEditingItem(null);
        fetchInventory();
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to update inventory.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server error while updating inventory.' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
            <Warehouse className="w-4 h-4 text-amber-400" /> Multi-Store Inventory & Reorder Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inventory Management ({inventory.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Monitor real-time store stock levels, safety reorder thresholds, and update inventory quantities.
          </p>
        </div>
      </div>

      {/* Operational Stock Alert Banner */}
      {inventory.some((i) => i.status === 'LOW STOCK' || i.status === 'CRITICAL OUT') && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold block text-white text-sm">Operational Low-Stock Alert</span>
              <span>
                {inventory.filter((i) => i.status === 'CRITICAL OUT').length} products are out of stock and{' '}
                {inventory.filter((i) => i.status === 'LOW STOCK').length} products are below safety reorder threshold.
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedStatus('LOW STOCK')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0"
          >
            View Low Stock
          </button>
        </div>
      )}

      {toast && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/80 border border-red-800 text-red-300'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, store..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-amber-400" /> Filter Store:
          </div>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
          >
            <option value="All">All Stores</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
          >
            <option value="All">All Stock Statuses</option>
            <option value="IN STOCK">In Stock Only</option>
            <option value="LOW STOCK">Low Stock Only</option>
            <option value="CRITICAL OUT">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Querying inventory stock levels...
          </div>
        ) : inventory.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <Warehouse className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No inventory items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3.5 font-semibold">Product SKU</th>
                  <th className="pb-3.5 font-semibold">Store Location</th>
                  <th className="pb-3.5 font-semibold text-center">Current Stock</th>
                  <th className="pb-3.5 font-semibold text-center">Reorder Level</th>
                  <th className="pb-3.5 font-semibold text-center">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inventory.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <Image
                            src={getProductImageUrl(item.imageUrl, item.categoryName, idx)}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-xs">{item.productName}</span>
                          <span className="text-[10px] text-blue-400 font-mono">{item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-300">
                      {item.storeName}
                      <span className="text-[10px] text-slate-500 font-mono block">{item.storeCode}</span>
                    </td>
                    <td className="py-4 text-center font-mono font-bold text-sm">
                      <span
                        className={
                          item.status === 'CRITICAL OUT'
                            ? 'text-red-400'
                            : item.status === 'LOW STOCK'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 text-center font-mono text-slate-400">{item.reorderLevel}</td>
                    <td className="py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                          item.status === 'CRITICAL OUT'
                            ? 'bg-red-950/80 text-red-400 border border-red-800'
                            : item.status === 'LOW STOCK'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/inventory/${item.id}`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" /> Update Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Update Stock Quantity</h3>
                <span className="text-xs text-blue-400 font-mono">{editingItem.productName} ({editingItem.storeName})</span>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Current Stock Quantity (Must be &gt;= 0) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Safety Reorder Level</label>
                <input
                  type="number"
                  min="0"
                  value={editReorder}
                  onChange={(e) => setEditReorder(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Stock...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Stock Update
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
