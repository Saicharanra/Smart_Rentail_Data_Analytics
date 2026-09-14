'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Bell, Search, User, LogOut, ShieldAlert, Sparkles, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    const token = localStorage.getItem('auth_token');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== 'ADMIN') {
        setUser(parsed);
        setLoading(false);
        return;
      }
      setUser(parsed);
    } catch (e) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    window.dispatchEvent(new Event('auth_change'));
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="text-xs font-mono text-blue-400 animate-pulse flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Verifying Admin Authorization...
        </div>
      </div>
    );
  }

  if (user && user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your account (<strong className="text-slate-200">{user.email}</strong>) has role{' '}
            <span className="font-mono text-amber-400 font-bold">{user.role}</span>. You do not have permission to access the Admin Portal.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => router.push('/shop')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
            >
              Return to Customer Storefront
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Derive page title from pathname
  const pageTitle =
    pathname === '/admin' || pathname === '/admin/dashboard'
      ? 'Dashboard Overview'
      : pathname.split('/')[2]?.toUpperCase() || 'ADMIN PORTAL';

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pt-16 lg:pt-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">{pageTitle}</span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <span className="text-[11px] text-slate-400 hidden sm:block font-mono">
              Role: <strong className="text-emerald-400 uppercase">{user?.role || 'ADMIN'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400 w-48 focus-within:w-60 focus-within:border-blue-500 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search admin records..."
                className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md font-mono">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'AD'}
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-semibold text-white block">{user?.name || 'Admin Lead'}</span>
                <span className="text-[10px] text-slate-500 block">{user?.email || 'admin@retail.bi'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body Content */}
        <main className="p-6 lg:p-10 flex-1 space-y-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
