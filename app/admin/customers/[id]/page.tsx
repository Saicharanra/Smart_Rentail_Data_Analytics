'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  IndianRupee,
  Star,
  Clock,
  ShieldCheck,
  MessageSquare,
  Package,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CustomerDetail {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  segment: string;
  joinedDate: string;
  ordersCount: number;
  totalSpent: number;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    date: string;
    itemsCount: number;
    paymentMethod: string;
  }>;
  reviews: Array<{
    id: string;
    productId: string;
    productName: string;
    rating: number;
    title?: string;
    comment: string;
    date: string;
  }>;
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
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
    if (!customerId) return;

    const fetchCustomerDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/customers/${customerId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCustomer(data.data);
        } else {
          setError(data.message || 'Customer profile not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch customer details:', err);
        setError('An error occurred while loading customer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [customerId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 animate-spin text-purple-400" /> Fetching Customer Profile & Order History...
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Customer Record Not Found</h2>
        <p className="text-xs text-slate-300">{error || 'The requested customer profile does not exist.'}</p>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customer Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Customer Directory
      </Link>

      {/* Customer Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="flex items-center gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-xl shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-purple-300 font-bold text-3xl font-mono">
              {customer.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{customer.name}</h1>
              <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                {customer.segment} SEGMENT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-purple-400" /> {customer.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 text-right">
          <div>
            <span className="text-xs text-slate-500 block">Total Orders</span>
            <span className="text-xl font-bold font-mono text-white">{customer.ordersCount}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total Spending</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{formatCurrency(customer.totalSpent)}</span>
          </div>
        </div>
      </div>

      {/* Grid: Contact Information & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-purple-400" /> Profile Summary
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Customer ID</span>
              <span className="font-mono text-slate-200">{customer.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>User ID</span>
              <span className="font-mono text-slate-200">{customer.userId.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Registration Date</span>
              <span className="font-mono text-white">{customer.joinedDate}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Phone</span>
              <span className="font-mono text-white">{customer.phone}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-purple-400" /> Saved Shipping Destination
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Street Address</span>
              <span className="font-semibold text-white leading-relaxed">{customer.address}</span>
            </div>
            <div>
              <span className="text-slate-500 block">City, State & Zip</span>
              <span className="font-semibold text-white">
                {customer.city}, {customer.state} {customer.postalCode}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Country</span>
              <span className="font-semibold text-white">{customer.country}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" /> Customer Order History ({customer.orders.length})
          </h3>
        </div>

        {customer.orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No orders recorded for this customer.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Order Number</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customer.orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 font-mono text-purple-400 font-bold">{ord.orderNumber}</td>
                    <td className="py-3.5 text-slate-300 font-mono">{ord.date}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : ord.status === 'SHIPPED'
                            ? 'bg-blue-950/60 text-blue-400'
                            : 'bg-amber-950/60 text-amber-400'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono">{ord.paymentMethod}</td>
                    <td className="py-3.5 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-[11px] font-semibold transition-colors"
                      >
                        Inspect Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <MessageSquare className="w-5 h-5 text-amber-400" /> Submitted Product Reviews ({customer.reviews.length})
        </h3>

        {customer.reviews.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No reviews submitted by this customer yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{rev.productName}</h4>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                {rev.title && <p className="text-xs font-semibold text-slate-200">{rev.title}</p>}
                <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-slate-500 font-mono block pt-1">{rev.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
