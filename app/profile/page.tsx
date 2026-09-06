'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  CheckCircle2,
  Package,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name?: string; role: string; customerId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user info', err);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    window.dispatchEvent(new Event('auth_change'));
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="ui-caption text-[14px] text-teal-300 animate-pulse">Loading Account Profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="bg-navy-900/90 border border-teal-500/30 rounded-3xl p-10 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center border border-teal-500/30">
              <User className="w-8 h-8" />
            </div>
            <h1 className="ui-h1 text-[28px] font-bold text-white">Not Signed In</h1>
            <p className="ui-body text-[16px] text-slate-300 max-w-md mx-auto">
              Please sign in to view your account details, order history, and saved preferences.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
              >
                Sign In Now <ArrowRight className="w-5 h-5 text-navy-950" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Account Banner */}
        <div className="bg-navy-900/90 border border-teal-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-300 p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-teal-300 font-bold text-2xl font-heading">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="ui-h1 text-[28px] font-bold text-white tracking-tight">
                  {user.name || 'Smart Retail Account'}
                </h1>
                <span className="ui-caption text-[12px] font-mono font-bold px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {user.role} ROLE
                </span>
              </div>
              <p className="ui-caption text-[14px] text-slate-300 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-teal-400" /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-caption text-[14px] font-semibold flex items-center gap-2 transition-all shadow-md"
              >
                <LayoutDashboard className="w-4 h-4 text-navy-950" /> Admin Portal
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-xl bg-navy-800 hover:bg-red-500/20 border border-teal-500/30 text-red-300 hover:text-red-200 ui-caption text-[14px] font-semibold flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 ui-h3 text-[20px] font-medium text-white">
              <ShoppingBag className="w-5 h-5 text-teal-400" /> Orders & Shopping
            </div>
            <p className="ui-caption text-[14px] text-slate-300">
              Track live order statuses, estimated shipping dates, and view past purchases.
            </p>
            <div className="pt-2">
              <Link
                href="/orders"
                className="w-full py-3 rounded-xl bg-navy-800 hover:bg-teal-500/20 border border-teal-500/30 text-white ui-caption text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Package className="w-4 h-4 text-teal-300" /> View Order History
              </Link>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 ui-h3 text-[20px] font-medium text-white">
              <ShieldCheck className="w-5 h-5 text-teal-400" /> Security Status
            </div>
            <div className="space-y-3 ui-caption text-[14px]">
              <div className="flex justify-between items-center bg-navy-950/80 p-3 rounded-xl border border-teal-500/20">
                <span className="text-slate-300">Authentication</span>
                <span className="text-teal-300 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> JWT Verified
                </span>
              </div>
              <div className="flex justify-between items-center bg-navy-950/80 p-3 rounded-xl border border-teal-500/20">
                <span className="text-slate-300">Account Role</span>
                <span className="text-white font-mono font-semibold">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Saved Payment Methods */}
          <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 ui-h3 text-[20px] font-medium text-white">
              <CreditCard className="w-5 h-5 text-teal-400" /> Saved Payment Methods
            </div>
            <div className="bg-navy-950/80 p-4 rounded-xl border border-teal-500/20 ui-caption text-[14px] space-y-1">
              <span className="font-semibold text-white block">Visa ending in •••• 4242</span>
              <span className="text-slate-400 block font-mono text-[12px]">Expires 12/28 • Default Payment</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
