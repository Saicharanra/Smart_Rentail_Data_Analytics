'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store as StoreIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Globe,
  Warehouse,
  ShoppingBag,
  X,
  Loader2
} from 'lucide-react';

interface StoreRecord {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isOnline: boolean;
  inventoryCount: number;
  ordersCount: number;
  createdAt: string;
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/stores?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setStores(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleDeleteStore = async (st: StoreRecord) => {
    if (!confirm(`Are you sure you want to delete store "${st.name}" (${st.code})?`)) return;

    try {
      const res = await fetch(`/api/admin/stores/${st.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: 'success', message: 'Store record deleted successfully.' });
        fetchStores();
      } else {
        setToast({ type: 'error', message: data.message || 'Could not delete store.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server error while deleting store.' });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <StoreIcon className="w-4 h-4 text-emerald-400" /> Physical & E-Commerce Fulfillment Nodes
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Retail Stores & Depots ({stores.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage brick-and-mortar storefronts, distribution hubs, and online warehouse fulfillment centers.
          </p>
        </div>
        <Link
          href="/admin/stores/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Store Hub
        </Link>
      </div>

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
            placeholder="Search store name, code, city..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>
      </div>

      {/* Store Directory Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Querying store location records...
          </div>
        ) : stores.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <StoreIcon className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No store locations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3.5 font-semibold">Store Location</th>
                  <th className="pb-3.5 font-semibold">Store Code</th>
                  <th className="pb-3.5 font-semibold">Address & City</th>
                  <th className="pb-3.5 font-semibold text-center">Fulfillment Type</th>
                  <th className="pb-3.5 font-semibold text-center">Inventory Items</th>
                  <th className="pb-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stores.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4">
                      <div>
                        <span className="font-bold text-white block text-sm">{st.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {st.id.slice(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono font-bold text-blue-400 text-sm">{st.code}</td>
                    <td className="py-4 text-slate-300">
                      <span className="flex items-center gap-1 font-semibold text-white">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {st.address}
                      </span>
                      <span className="text-[10px] text-slate-400 block pl-4">
                        {st.city}, {st.state} {st.zipCode}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                          st.isOnline
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {st.isOnline ? 'Online E-Commerce' : 'Physical Store'}
                      </span>
                    </td>
                    <td className="py-4 text-center font-mono font-bold text-white text-sm">
                      {st.inventoryCount} items
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/stores/${st.id}`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/stores/${st.id}/edit`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-white transition-colors"
                          title="Edit Store"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteStore(st)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Store"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
}
