'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Star,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Lock,
  Package,
  Clock
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import CanvasWrapper from '@/components/three/CanvasWrapper';
import { HeroSceneContent } from '@/components/three/HeroScene';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';
import { ProductCard } from '@/components/product/ProductCard';

export default function CoverEcommercePage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-grid-pattern">
        {/* Ambient Teal Radial Glow Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-teal-500/10 rounded-full blur-[170px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy-800/90 border border-teal-500/30 text-teal-300 text-sm font-medium shadow-lg backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Next-Gen Smart Devices & Tech Hardware</span>
              </motion.div>

              {/* Headline H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]"
              >
                Discover Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-300">Smart Retail</span> & Connected Tech
              </motion.h1>

              {/* Sub-headline / Body */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal"
              >
                Upgrade your lifestyle with studio-grade audio hardware, ergonomic office setups, precision smartwatch wearables, and smart home automation.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  href="/shop"
                  className="px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-base sm:text-lg font-bold shadow-xl shadow-teal-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5 text-navy-950" />
                  Shop Full Catalog
                </Link>
                <Link
                  href="/categories"
                  className="px-8 py-4 rounded-2xl bg-navy-800/90 hover:bg-navy-700 text-white text-base sm:text-lg font-semibold border border-teal-500/30 flex items-center gap-2.5 transition-all backdrop-blur-md"
                >
                  Explore Categories
                </Link>
              </motion.div>

              {/* Live Statistics Counter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-navy-900/60 border border-teal-500/20 backdrop-blur-md my-4"
              >
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">15,000+</div>
                  <div className="text-xs text-slate-300 font-medium">Happy Customers</div>
                </div>
                <div className="text-center sm:text-left border-l border-teal-500/20 pl-4">
                  <div className="text-xl sm:text-2xl font-extrabold text-teal-300 font-mono">4.9 ★</div>
                  <div className="text-xs text-slate-300 font-medium">Average Rating</div>
                </div>
                <div className="text-center sm:text-left border-l border-teal-500/20 pl-4">
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">99.8%</div>
                  <div className="text-xs text-slate-300 font-medium">On-Time Shipping</div>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-3 gap-6 pt-4 border-t border-teal-500/20 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-white font-semibold block text-sm">Free Express Shipping</span>
                    <span className="text-slate-300 text-xs">Orders over ₹5,000</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-white font-semibold block text-sm">2-Year Warranty</span>
                    <span className="text-slate-300 text-xs">Full protection</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-white font-semibold block text-sm">30 Days Return</span>
                    <span className="text-slate-300 text-xs">Money-back policy</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive 3D Hero Canvas Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 h-[460px] lg:h-[520px] w-full rounded-3xl bg-navy-900/80 border border-teal-500/30 p-2 relative shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-4 left-4 z-20 bg-navy-950/80 border border-teal-500/30 px-3.5 py-1.5 rounded-xl ui-caption text-[14px] text-slate-200 flex items-center gap-2 backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                Interactive 3D Product Canvas
              </div>

              <CanvasWrapper camera={{ position: [0, 1.5, 6], fov: 50 }}>
                <HeroSceneContent />
              </CanvasWrapper>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Categories Showcase Grid (H2: 24px semi-bold) */}
      <section className="py-20 bg-navy-950/70 border-t border-teal-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="ui-caption text-[14px] uppercase tracking-widest text-teal-300 block mb-2 font-mono">
                Curated Collections
              </span>
              <h2 className="ui-h2 text-[24px] font-semibold text-white tracking-tight">
                Shop By Product Category
              </h2>
            </div>
            <Link
              href="/categories"
              className="ui-caption text-[14px] font-semibold text-teal-300 hover:text-teal-200 flex items-center gap-1.5 transition-colors"
            >
              View All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group glass-card glass-card-hover rounded-3xl p-5 border border-teal-500/20 flex flex-col justify-between space-y-4"
              >
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-navy-950">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="ui-h3 text-[20px] font-medium text-white group-hover:text-teal-300 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="ui-caption text-[12px] font-mono text-teal-300 font-bold bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                      {cat.itemCount} Items
                    </span>
                  </div>
                  <p className="ui-caption text-[14px] text-slate-300 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center text-teal-300 ui-caption text-[14px] font-semibold group-hover:translate-x-1 transition-transform">
                  Browse Collection <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Best Sellers Product Grid (H2: 24px semi-bold) */}
      <section className="py-24 bg-navy-900/60 border-t border-teal-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="ui-caption text-[14px] uppercase tracking-wider text-teal-300 block mb-2 font-mono">
                Customer Favorites
              </span>
              <h2 className="ui-h2 text-[24px] font-semibold text-white tracking-tight">
                Featured Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="ui-caption text-[14px] font-semibold text-teal-300 hover:text-teal-200 flex items-center gap-1.5 transition-colors"
            >
              Explore Full Storefront <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Promotional Banner */}
      <section className="py-20 bg-navy-950 border-t border-teal-500/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-950 rounded-3xl p-8 lg:p-14 border border-teal-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <span className="ui-caption text-[14px] font-semibold text-teal-300 uppercase tracking-widest bg-teal-500/20 px-3.5 py-1.5 rounded-full border border-teal-500/30 inline-block">
                Limited Special Offer
              </span>
              <h2 className="ui-h1 text-[32px] sm:text-[36px] font-bold text-white tracking-tight">
                Upgrade Your Smart Workspace & Living Setup
              </h2>
              <p className="ui-body text-[16px] text-slate-200 leading-relaxed">
                Enjoy exclusive bundles with up to 20% off on motorized standing desks, ANC wireless studio headphones, and smart lighting bars.
              </p>
              <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4">
                <Link
                  href="/shop"
                  className="px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold shadow-xl shadow-teal-500/25 transition-all"
                >
                  Shop Special Deals
                </Link>
              </div>
            </div>
            <div className="relative w-72 h-72 shrink-0 rounded-2xl overflow-hidden border border-teal-500/30 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
                alt="Workspace Setup"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust & Value Propositions */}
      <section className="py-20 bg-navy-900 border-t border-teal-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="glass-card p-6 rounded-3xl space-y-3 border border-teal-500/20">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300 mx-auto md:mx-0">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="ui-h3 text-[20px] font-medium text-white">Express Delivery</h3>
              <p className="ui-caption text-[14px] text-slate-300">Fast, insured shipping with real-time tracking updates.</p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3 border border-teal-500/20">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300 mx-auto md:mx-0">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="ui-h3 text-[20px] font-medium text-white">Secure Checkout</h3>
              <p className="ui-caption text-[14px] text-slate-300">256-bit encrypted transactions with Apple Pay & Credit Cards.</p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3 border border-teal-500/20">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300 mx-auto md:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="ui-h3 text-[20px] font-medium text-white">Verified Quality</h3>
              <p className="ui-caption text-[14px] text-slate-300">All products undergo strict quality checks & 2-year warranty.</p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-3 border border-teal-500/20">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300 mx-auto md:mx-0">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="ui-h3 text-[20px] font-medium text-white">24/7 Support</h3>
              <p className="ui-caption text-[14px] text-slate-300">Dedicated support team ready to assist with your order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="py-24 bg-navy-950/80 border-t border-teal-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="ui-caption text-[14px] uppercase tracking-wider text-teal-300 font-mono">
              Verified Feedback
            </span>
            <h2 className="ui-h2 text-[24px] font-semibold text-white tracking-tight">
              Loved By Thousands of Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-3xl space-y-4 border border-teal-500/20">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="ui-body text-[16px] text-slate-200 leading-relaxed">
                "The Apex ANC headphones are incredible. Sound quality is studio-level and noise cancellation works like magic on flights."
              </p>
              <div className="ui-caption text-[14px] pt-2 border-t border-teal-500/20">
                <span className="text-white font-semibold block">Eleanor Vance</span>
                <span className="text-slate-400 text-[13px]">Verified Buyer • Seattle, WA</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-4 border border-teal-500/20">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="ui-body text-[16px] text-slate-200 leading-relaxed">
                "ErgoPro Motorized Standing Desk is super smooth and whisper-quiet. Cable management tray kept my setup totally clean."
              </p>
              <div className="ui-caption text-[14px] pt-2 border-t border-teal-500/20">
                <span className="text-white font-semibold block">Marcus Aurelius</span>
                <span className="text-slate-400 text-[13px]">Verified Buyer • Austin, TX</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-4 border border-teal-500/20">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="ui-body text-[16px] text-slate-200 leading-relaxed">
                "PulseTrack Ultra watch has insane battery life. GPS tracking is pinpoint accurate during my trail runs!"
              </p>
              <div className="ui-caption text-[14px] pt-2 border-t border-teal-500/20">
                <span className="text-white font-semibold block">Sophia Lin</span>
                <span className="text-slate-400 text-[13px]">Verified Buyer • San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action (CTA Buttons: 18px semi-bold) */}
      <section className="py-24 bg-navy-950 border-t border-teal-500/20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="ui-h1 text-[32px] sm:text-[40px] font-bold text-white tracking-tight">
            Ready to Experience Premium Smart Retail?
          </h2>
          <p className="ui-body text-[16px] text-slate-200 max-w-2xl mx-auto">
            Browse our full catalog of smart electronics, ergonomic office gear, and smart home automation devices.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="px-8 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold shadow-xl shadow-teal-500/25 transition-all"
            >
              Shop Catalog Now
            </Link>
            <Link
              href="/admin"
              className="px-8 py-4 rounded-2xl bg-navy-800 hover:bg-navy-700 text-white ui-btn text-[18px] font-semibold border border-teal-500/30 transition-all"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
