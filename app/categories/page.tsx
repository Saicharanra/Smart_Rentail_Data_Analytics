'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { FolderTree, ArrowRight, TrendingUp } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
            <FolderTree className="w-4 h-4" /> Category Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse Product Categories
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Explore product taxonomy and telemetry segmentation used for Azure Data Factory medallion partition indexing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl transition-all duration-300"
            >
              <div className="relative md:w-5/12 h-56 md:h-auto bg-slate-950">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +{cat.growth}% YoY
                    </span>
                    <span className="text-slate-500 font-mono">{cat.itemCount} Items</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold transition-all group-hover:bg-blue-600"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
