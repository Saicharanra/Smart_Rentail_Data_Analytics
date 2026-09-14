'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Star,
  Search,
  Filter,
  Eye,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  User,
  Package
} from 'lucide-react';

interface ReviewRecord {
  id: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  productSku: string;
  productImageUrl: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRating, setSelectedRating] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState<ReviewRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedRating !== 'All') params.set('rating', selectedRating);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [search, selectedRating]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/reviews/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: 'success', message: 'Customer review deleted successfully.' });
        setDeleteTarget(null);
        fetchReviews();
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to delete review.' });
      }
    } finally {
      setDeleting(false);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const lowRatingCount = reviews.filter((r) => r.rating <= 2).length;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
            <MessageSquare className="w-4 h-4 text-amber-400" /> Customer Feedback Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Product Reviews ({reviews.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Moderate customer product feedback, monitor satisfaction metrics, and remove inappropriate content.
          </p>
        </div>
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

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">Total Reviews</div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{reviews.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Submitted customer reviews</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">Average Score</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2 font-mono flex items-center gap-2">
            {averageRating} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Overall customer rating</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">5-Star Feedback</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">{fiveStarCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Perfect rating reviews</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="text-slate-400 text-xs font-mono uppercase">Low Ratings (1-2★)</div>
          <div className="text-2xl font-extrabold text-red-400 mt-2 font-mono">{lowRatingCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Needs quality attention</div>
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
            placeholder="Search comment, product, customer..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-amber-400" /> Star Rating:
          </div>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Fetching customer reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No customer reviews found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Row: Customer & Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">{rev.customerName}</span>
                        <span className="text-[10px] text-slate-500">{rev.customerEmail}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{rev.createdAt}</span>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl p-2.5 border border-slate-800">
                    <Package className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-xs text-white truncate block">{rev.productName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {rev.productSku}</span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold font-mono text-amber-400 ml-1">{rev.rating}/5</span>
                  </div>

                  {/* Title & Comment */}
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{rev.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/admin/reviews/${rev.id}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Review
                  </Link>

                  <button
                    onClick={() => setDeleteTarget(rev)}
                    className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded-lg hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Delete Customer Review</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove this product review by{' '}
              <strong className="text-white">{deleteTarget.customerName}</strong> for{' '}
              <strong className="text-white">{deleteTarget.productName}</strong>?
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 italic">
              "{deleteTarget.comment}"
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
