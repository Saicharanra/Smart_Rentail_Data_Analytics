'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Truck, AlertCircle } from 'lucide-react';

export default function AdminEditSupplierPage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = params?.id as string;

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [leadTimeDays, setLeadTimeDays] = useState('5');
  const [rating, setRating] = useState('4.5');
  const [status, setStatus] = useState('Active');

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
    if (!supplierId) return;

    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/suppliers/${supplierId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const s = data.data;
          setName(s.name);
          setContactPerson(s.contactPerson || '');
          setEmail(s.email || '');
          setPhone(s.phone || '');
          setAddress(s.address || '');
          setCategory(s.category || '');
          setLeadTimeDays(String(s.leadTimeDays || 5));
          setRating(String(s.rating || 4.5));
          setStatus(s.status || 'Active');
        } else {
          setError(data.message || 'Supplier not found.');
        }
      } catch (err: any) {
        setError('Failed to load supplier.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          contactPerson,
          email,
          phone,
          address,
          category,
          leadTimeDays: parseInt(leadTimeDays, 10) || 5,
          rating: parseFloat(rating) || 4.5,
          status,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/suppliers');
      } else {
        setError(data.message || 'Failed to update supplier.');
      }
    } catch (err: any) {
      setError('An error occurred while updating supplier.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> Loading supplier editor...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      <Link
        href="/admin/suppliers"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Suppliers
      </Link>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-1">
            <Truck className="w-4 h-4" /> Edit Vendor Record
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Supplier: {name}</h1>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Supplier / Vendor Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Category Specialty</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Lead Time (Days)</label>
              <input
                type="number"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Quality Rating</label>
              <input
                type="number"
                step="0.1"
                max="5.0"
                min="1.0"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              >
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Link
              href="/admin/suppliers"
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating Supplier...
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
