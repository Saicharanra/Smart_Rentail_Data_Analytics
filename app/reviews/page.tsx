'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Star, MessageSquare, ThumbsUp, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        setError(data.message || 'Failed to fetch customer reviews.');
      }
    } catch (err: any) {
      console.error('Failed to load reviews', err);
      setError('An unexpected error occurred while loading reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product review?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(data.message || 'Could not delete review. You may only delete your own reviews.');
      }
    } catch (err) {
      console.error('Failed to delete review', err);
      alert('Failed to delete review.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
            <MessageSquare className="w-4 h-4" /> Verified Product Reviews
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Reviews & Ratings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Read real customer experiences, product feedback, and verified ratings from our shopping community.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-28 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-950/40 border border-red-800/60 rounded-3xl p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Unable to Load Reviews</h3>
            <p className="text-sm text-red-300 max-w-md mx-auto">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Customer Reviews Yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Be the first customer to share feedback! Purchase an item from our shop and leave a verified review.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
              >
                Browse Shop Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-3 transition-all backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                      {rev.title && <span className="text-xs font-semibold text-slate-300">• {rev.title}</span>}
                    </div>
                    <Link href={`/products/${rev.productId}`} className="text-xs font-semibold text-blue-400 hover:underline block">
                      Product: {rev.productName}
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                      {[...Array(5 - rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-slate-700" />
                      ))}
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      disabled={deletingId === rev.id}
                      title="Delete Review"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deletingId === rev.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">{rev.comment}</p>

                <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 font-mono">
                  <span>Submitted on: {new Date(rev.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                    <ThumbsUp className="w-3 h-3 text-blue-400" /> Verified Customer Feedback
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
