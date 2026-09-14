'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Truck, AlertCircle } from 'lucide-react';

export default function AdminNewSupplierPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Smart Electronics');
  const [leadTimeDays, setLeadTimeDays] = useState('5');
  const [rating, setRating] = useState('4.5');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/suppliers', {
        method: 'POST',
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
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/suppliers');
      } else {
        setError(data.message || 'Failed to create supplier.');
      }
    } catch (err: any) {
      setError('An error occurred while creating supplier.');
    } finally {
      setSubmitting(false);
    }
  };

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
            <Truck className="w-4 h-4" /> Vendor Onboarding
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Add New B2B Supplier</h1>
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
              placeholder="e.g. Apex Audio Tech Ltd"
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
                placeholder="Robert Sterling"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supply@apexaudio.io"
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
                placeholder="+1 (555) 234-8901"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Category Specialty</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Smart Electronics"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="font-semibold text-slate-300">Quality Rating (1.0 - 5.0)</label>
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
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Vendor Headquarters Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="700 Fifth Avenue, Suite 400"
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Supplier...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Onboard Supplier
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
