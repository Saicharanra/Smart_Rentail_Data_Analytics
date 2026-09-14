'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedStatus !== 'All') params.set('status', selectedStatus);
      if (selectedMethod !== 'All') params.set('method', selectedMethod);

      const res = await fetch(`/api/admin/payments?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, selectedStatus, selectedMethod]);

  const totalVolume = payments.reduce((acc, p) => acc + (p.status === 'COMPLETED' ? p.amount : 0), 0);
  const completedCount = payments.filter((p) => p.status === 'COMPLETED').length;
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length;
  const failedCount = payments.filter((p) => p.status === 'FAILED' || p.status === 'REFUNDED').length;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Transaction Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Payments Management ({payments.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Monitor real-time payment transactions, gateway statuses, transaction IDs, and settlement metrics.
          </p>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">Settled Revenue</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">
            {formatCurrency(totalVolume)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">From COMPLETED transactions</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">Completed Payments</div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono flex items-center gap-2">
            {completedCount} <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Successful transactions</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">Pending Payments</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2 font-mono flex items-center gap-2">
            {pendingCount} <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting authorization</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">Failed / Refunded</div>
          <div className="text-2xl font-extrabold text-red-400 mt-2 font-mono flex items-center gap-2">
            {failedCount} <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires admin review</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Txn ID, Order #, Customer..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-emerald-400" /> Status:
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>

          <div className="flex items-center gap-2 text-xs text-slate-400">Method:</div>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
          >
            <option value="All">All Methods</option>
            <option value="CREDIT_CARD">CREDIT CARD</option>
            <option value="PAYPAL">PAYPAL</option>
            <option value="APPLE_PAY">APPLE PAY</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Querying payment transactions...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <CreditCard className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No payment transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3.5 font-semibold">Transaction ID</th>
                  <th className="pb-3.5 font-semibold">Order Number</th>
                  <th className="pb-3.5 font-semibold">Customer</th>
                  <th className="pb-3.5 font-semibold text-center">Method</th>
                  <th className="pb-3.5 font-semibold text-center">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Amount</th>
                  <th className="pb-3.5 font-semibold text-right">Date</th>
                  <th className="pb-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4">
                      <span className="font-mono text-emerald-400 font-bold block text-xs">{p.transactionId}</span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold font-mono text-blue-400 text-xs">{p.orderNumber}</span>
                    </td>
                    <td className="py-4 text-slate-300">
                      <span className="font-bold text-white block text-xs">{p.customerName}</span>
                      <span className="text-[10px] text-slate-500">{p.customerEmail}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : p.status === 'PENDING'
                            ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                            : p.status === 'REFUNDED'
                            ? 'bg-purple-950/80 text-purple-400 border-purple-800'
                            : 'bg-red-950/80 text-red-400 border-red-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-4 text-right text-slate-400 font-mono">{p.createdAt}</td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/orders/${p.orderId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Order
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
