'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      author: 'Eleanor Vance',
      product: 'Apex ANC Wireless Headphones',
      rating: 5,
      date: '2026-09-02',
      comment: 'Exceptional noise cancellation. Studio sound clarity and long battery life!',
    },
    {
      id: 2,
      author: 'Marcus Aurelius',
      product: 'PulseTrack Ultra Fitness Watch',
      rating: 5,
      date: '2026-08-28',
      comment: 'Super accurate GPS tracking during my marathons. Build quality is top tier.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
            <MessageSquare className="w-4 h-4" /> Customer Feedback & Reviews
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Verified Product Reviews</h1>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                  <span className="text-xs text-blue-400">{rev.product}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                <span>{rev.date}</span>
                <span className="flex items-center gap-1 hover:text-white cursor-pointer">
                  <ThumbsUp className="w-3 h-3" /> Helpful (14)
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
