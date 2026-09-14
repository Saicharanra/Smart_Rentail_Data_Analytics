'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Store as StoreIcon,
  MapPin,
  Warehouse,
  ShoppingBag,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StoreDetail {
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
  inventoryItems: Array<{
    id: string;
    quantity: number;
    reorderLevel: number;
    product: { name: string; sku: string; price: number };
  }>;
}

export default function AdminStoreDetailPage() {
  const params = useParams();
  const storeId = params?.id as string;

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    if (!storeId) return;

    const fetchStoreDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/stores/${storeId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStore(data.data);
        } else {
          setError(data.message || 'Store location not found.');
        }
      } catch (err: any) {
        setError('Failed to load store details.');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetail();
  }, [storeId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Clock className="w-5 h-5 animate-spin text-emerald-400" /> Fetching Store Location & Inventory Matrix...
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12 font-sans">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Store Location Not Found</h2>
        <p className="text-xs text-slate-300">{error || 'The requested store does not exist.'}</p>
        <Link
          href="/admin/stores"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Stores Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <Link
        href="/admin/stores"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Stores Directory
      </Link>

      {/* Store Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{store.name}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                store.isOnline
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              }`}
            >
              {store.isOnline ? 'E-Commerce Online Hub' : 'Physical Storefront'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Store Code: <span className="text-blue-400 font-bold">{store.code}</span>
          </p>
        </div>

        <Link
          href={`/admin/stores/${store.id}/edit`}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Edit Store Hub
        </Link>
      </div>

      {/* Location Details */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md text-xs">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" /> Facility Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-slate-500 block">Street Address</span>
            <span className="font-semibold text-white">{store.address}</span>
          </div>
          <div>
            <span className="text-slate-500 block">City & State</span>
            <span className="font-semibold text-white">
              {store.city}, {store.state}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Zip Code</span>
            <span className="font-mono text-white">{store.zipCode}</span>
          </div>
        </div>
      </div>

      {/* Store Inventory Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-blue-400" /> Assigned Store Inventory ({store.inventoryItems.length})
        </h3>

        {store.inventoryItems.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No inventory items assigned to this store hub.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold">Product Name</th>
                  <th className="pb-3 font-semibold text-center">Current Stock</th>
                  <th className="pb-3 font-semibold text-center">Reorder Level</th>
                  <th className="pb-3 font-semibold text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {store.inventoryItems.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40">
                    <td className="py-3 font-mono text-blue-400 font-bold">{inv.product.sku}</td>
                    <td className="py-3 font-semibold text-white">{inv.product.name}</td>
                    <td className="py-3 text-center font-mono font-bold text-emerald-400">{inv.quantity}</td>
                    <td className="py-3 text-center font-mono text-slate-400">{inv.reorderLevel}</td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {formatCurrency(Number(inv.product.price))}
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
