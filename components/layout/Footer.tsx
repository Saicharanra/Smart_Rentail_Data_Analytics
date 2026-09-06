'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Server, ShieldCheck, Activity, Cpu, Truck, Lock, Headphones } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-navy-950 border-t border-teal-500/20 text-slate-300 ui-caption text-[14px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-300 flex items-center justify-center text-navy-950 font-bold">
                <ShoppingBag className="w-5 h-5 text-navy-950" />
              </div>
              <span className="font-heading font-extrabold text-white tracking-tight text-xl">
                SMART<span className="text-teal-400">RETAIL</span>
              </span>
            </div>
            <p className="ui-caption text-[14px] text-slate-300 leading-relaxed max-w-sm">
              Smart Retail: Next-generation e-commerce platform offering premium smart devices, ergonomic office setups, and smart home hardware.
            </p>
            <div className="flex items-center gap-3 pt-2 font-mono ui-caption text-[12px] text-teal-300/80">
              <span className="flex items-center gap-2 bg-navy-900 px-3.5 py-1.5 rounded-full border border-teal-500/30 text-teal-300">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Live Dynamic Storefront & Inventory
              </span>
            </div>
          </div>

          {/* Customer Application Links */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-semibold ui-caption text-[14px] uppercase tracking-wider">
              Customer Storefront
            </h4>
            <ul className="space-y-2.5 ui-caption text-[14px]">
              <li>
                <Link href="/shop" className="hover:text-teal-300 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-teal-300 transition-colors">
                  Categories Directory
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-teal-300 transition-colors">
                  Order Tracking Timeline
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-teal-300 transition-colors">
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Executive BI Portal Links */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-semibold ui-caption text-[14px] uppercase tracking-wider">
              Management Portal
            </h4>
            <ul className="space-y-2.5 ui-caption text-[14px]">
              <li>
                <Link href="/admin" className="hover:text-teal-300 transition-colors">
                  Executive KPI Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/inventory" className="hover:text-teal-300 transition-colors">
                  Stock Reorder Monitoring
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-teal-300 transition-colors">
                  Business Analytics
                </Link>
              </li>
              <li>
                <Link href="/admin/suppliers" className="hover:text-teal-300 transition-colors">
                  Supplier Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Guarantees */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-semibold ui-caption text-[14px] uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2.5 ui-caption text-[14px] text-slate-300">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-400 shrink-0" /> Free Shipping over ₹5,000
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-400 shrink-0" /> Encrypted Checkout
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" /> 2-Year Product Warranty
              </li>
              <li className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-teal-400 shrink-0" /> 24/7 Support Desk
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-teal-500/20 flex flex-col sm:flex-row items-center justify-between ui-caption text-[14px] text-slate-400 gap-4">
          <p>© 2026 Smart Retail. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Next.js 15 App Router</span>
            <span>•</span>
            <span>Three.js / R3F</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
