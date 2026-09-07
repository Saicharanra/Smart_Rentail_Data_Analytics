'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-navy-900/80 border border-teal-500/20 hover:border-teal-400/50 rounded-3xl overflow-hidden flex flex-col justify-between backdrop-blur-md shadow-xl hover:shadow-teal-500/10 transition-all duration-300"
    >
      {/* Product Image Container */}
      <div className="relative w-full h-60 bg-navy-950 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-2 z-10">
          {product.isFeatured && (
            <span className="ui-caption text-[12px] font-semibold uppercase px-3 py-1 rounded-full bg-teal-500 text-navy-950 shadow-md">
              Featured
            </span>
          )}
          {product.isTrending && (
            <span className="ui-caption text-[12px] font-semibold uppercase px-3 py-1 rounded-full bg-navy-900/90 text-teal-300 border border-teal-500/40 backdrop-blur-md shadow-md">
              Trending
            </span>
          )}
        </div>

        {/* Quick View Link Button Overlay */}
        <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
          <Link
            href={`/products/${product.id}`}
            className="p-3.5 rounded-2xl bg-teal-500 text-navy-950 hover:bg-teal-400 transition-colors shadow-xl"
            title="View Details"
          >
            <Eye className="w-5 h-5 text-navy-950" />
          </Link>
        </div>
      </div>

      {/* Product Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="ui-caption text-[13px] font-medium text-teal-300 font-mono tracking-wide">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold ui-caption">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="ui-h3 font-heading font-medium text-[20px] text-white group-hover:text-teal-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="ui-caption text-[14px] text-slate-300 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Stock Status & Pricing */}
        <div className="pt-3 border-t border-teal-500/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.stock <= product.reorderPoint ? (
              <span className="flex items-center gap-1 text-amber-400 ui-caption text-[13px] font-medium">
                <AlertTriangle className="w-4 h-4" /> Low Stock ({product.stock})
              </span>
            ) : (
              <span className="flex items-center gap-1 text-teal-300 ui-caption text-[13px] font-medium">
                <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock})
              </span>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <span className="ui-h2 text-[24px] font-heading font-semibold text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ui-caption text-[14px] text-slate-400 line-through font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Action CTA (18px semi-bold) */}
        <button
          onClick={() => addToCart(product, 1)}
          className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 group-hover:bg-teal-400"
        >
          <ShoppingCart className="w-5 h-5 text-navy-950" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
