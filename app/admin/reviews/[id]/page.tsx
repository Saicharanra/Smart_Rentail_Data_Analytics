'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  User,
  Package,
  Trash2,
  AlertTriangle,
  Loader2,
  MessageSquare,
  X
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ReviewDetail {
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
  productPrice: number;
  productImageUrl: string;
}

export default function AdminReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/reviews/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setReview(data.data);
        } else {
          setToast({ type: 'error', message: data.message || 'Failed to load review details.' });
        }
      } catch (err) {
        setToast({ type: 'error', message: 'Server error while fetching review details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetail();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/reviews');
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to delete review.' });
        setShowDeleteModal(false);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server error while deleting review.' });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Loading review details...
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm space-y-4 font-sans">
        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
        <p className="font-semibold text-white">Review record not found</p>
        <Link href="/admin/reviews" className="text-xs text-blue-400 hover:underline">
          Return to reviews directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/reviews"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Reviews Directory
        </Link>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-xs font-semibold border border-red-500/30 transition-all"
        >
          <Trash2 className="w-4 h-4" /> Delete Review
        </button>
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

      {/* Main Review Inspection Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md space-y-6">
        {/* Star Rating Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
              <span className="text-base font-extrabold font-mono text-amber-400 ml-2">
                {review.rating} / 5
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{review.title}</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Submitted on {review.createdAt}</span>
        </div>

        {/* Customer & Product Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer info */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-400" /> Reviewer Information
            </div>
            <div>
              <span className="font-bold text-white text-sm block">{review.customerName}</span>
              <span className="text-xs text-slate-400">{review.customerEmail}</span>
            </div>
            <Link
              href={`/admin/customers/${review.customerId}`}
              className="text-xs text-blue-400 hover:underline inline-block pt-1 font-semibold"
            >
              View Customer Profile →
            </Link>
          </div>

          {/* Product info */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-emerald-400" /> Reviewed Product
            </div>
            <div>
              <span className="font-bold text-white text-sm block">{review.productName}</span>
              <span className="text-xs text-slate-400 font-mono">
                SKU: {review.productSku} | Price: {formatCurrency(review.productPrice)}
              </span>
            </div>
            <Link
              href={`/admin/products/${review.productId}`}
              className="text-xs text-blue-400 hover:underline inline-block pt-1 font-semibold"
            >
              View Product Listing →
            </Link>
          </div>
        </div>

        {/* Review Comment Content */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono uppercase text-slate-400">Customer Feedback Commentary</div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
            "{review.comment}"
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Delete Customer Review</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this review for{' '}
              <strong className="text-white">{review.productName}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
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
