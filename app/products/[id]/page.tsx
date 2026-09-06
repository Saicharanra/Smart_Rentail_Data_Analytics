'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';
import {
  Star,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        {/* Product Details Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Gallery Image */}
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden h-[420px] lg:h-[500px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>

          {/* Right Product Specs & Action */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-slate-500">{product.sku}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Pricing & Stock */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base font-mono text-slate-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <div className="ml-auto">
                  {product.stock <= product.reorderPoint ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Low Stock ({product.stock} left)
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Features List */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-800 bg-slate-900 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-mono font-bold text-white text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" /> Add {quantity} to Cart
                </button>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Free Express Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>30 Days Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs & Supplier Metadata */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Technical Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">{key}</span>
                <span className="text-sm font-semibold text-white font-mono mt-1 block">{val}</span>
              </div>
            ))}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-500 block">Verified Supplier</span>
              <span className="text-sm font-semibold text-blue-400 mt-1 block">{product.supplier}</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Related Products in Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
