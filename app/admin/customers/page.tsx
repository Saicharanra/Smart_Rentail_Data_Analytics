'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  IndianRupee,
  ChevronRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CustomerRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  segment: string;
  joinedDate: string;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedSegment !== 'All') params.set('segment', selectedSegment);

      const res = await fetch(`/api/admin/customers?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, selectedSegment]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-400 mb-1">
            <Users className="w-4 h-4 text-purple-400" /> Customer Management Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Registered Customers ({customers.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Inspect customer profiles, lifetime spending, order activity, and regional segment classification.
          </p>
        </div>
      </div>

      {/* Controls Bar: Search & Segment Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, city..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-purple-400" /> Filter Segment:
          </div>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
          >
            <option value="All">All Customer Segments</option>
            <option value="VIP">VIP Segment</option>
            <option value="Regular">Regular Segment</option>
            <option value="New">New Segment</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> Querying customer database records...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No customer profiles found</p>
            <p className="text-xs text-slate-500">Try loosening your search terms or segment filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3.5 font-semibold">Customer</th>
                  <th className="pb-3.5 font-semibold">Contact Info</th>
                  <th className="pb-3.5 font-semibold">Location</th>
                  <th className="pb-3.5 font-semibold">Segment</th>
                  <th className="pb-3.5 font-semibold text-center">Orders</th>
                  <th className="pb-3.5 font-semibold text-right">Total Spent</th>
                  <th className="pb-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md font-mono shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{c.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Mail className="w-3 h-3 text-purple-400" /> {c.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-slate-300">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {c.phone}
                      </span>
                    </td>
                    <td className="py-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {c.city}, {c.state}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                          c.segment === 'VIP'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                            : c.segment === 'New'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {c.segment}
                      </span>
                    </td>
                    <td className="py-4 text-center font-mono font-bold text-white text-sm">
                      {c.ordersCount}
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-300" /> View Profile
                      </Link>
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
