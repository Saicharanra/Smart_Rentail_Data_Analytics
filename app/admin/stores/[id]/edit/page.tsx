'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Store as StoreIcon, AlertCircle } from 'lucide-react';

export default function AdminEditStorePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params?.id as string;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/stores/${storeId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const st = data.data;
          setName(st.name);
          setCode(st.code);
          setAddress(st.address);
          setCity(st.city);
          setState(st.state);
          setZipCode(st.zipCode);
          setIsOnline(st.isOnline);
        } else {
          setError(data.message || 'Store not found.');
        }
      } catch (err: any) {
        setError('Failed to load store.');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/stores/${storeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          code,
          address,
          city,
          state,
          zipCode,
          isOnline,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/stores');
      } else {
        setError(data.message || 'Failed to update store location.');
      }
    } catch (err: any) {
      setError('An error occurred while updating store location.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Loading store editor...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      <Link
        href="/admin/stores"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Stores
      </Link>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <StoreIcon className="w-4 h-4" /> Edit Store Facility
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Store: {name}</h1>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Store Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Store Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Street Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Zip Code *</label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isOnline"
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-0"
            />
            <label htmlFor="isOnline" className="font-semibold text-slate-300 cursor-pointer">
              Mark as Direct E-Commerce Online Fulfillment Store
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Link
              href="/admin/stores"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating Store...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
