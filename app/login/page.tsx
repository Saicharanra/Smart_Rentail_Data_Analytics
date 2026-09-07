'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string; role: string } | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth_change'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store Auth token / user session info
      if (data.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        window.dispatchEvent(new Event('auth_change'));
      }

      setSuccessMsg('Login successful! Redirecting to your account...');
      
      setTimeout(() => {
        if (data.data?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/profile');
        }
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
        {/* Ambient Teal Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 relative z-10"
        >
          {/* Card Container */}
          <div className="bg-navy-900/90 border border-teal-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
            {currentUser ? (
              <div className="text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center border border-teal-500/30">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <span className="ui-caption text-[12px] font-mono text-teal-300 font-bold px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30">
                    Currently Logged In
                  </span>
                  <h1 className="ui-h1 text-[26px] font-bold text-white pt-2">
                    {currentUser.name || currentUser.email}
                  </h1>
                  <p className="ui-caption text-[14px] text-slate-300">
                    You are signed in as <strong className="text-teal-300">{currentUser.email}</strong> ({currentUser.role} Role).
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    href="/profile"
                    className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
                  >
                    Go to My Account Page <ArrowRight className="w-5 h-5 text-navy-950" />
                  </Link>

                  <Link
                    href="/shop"
                    className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white ui-caption text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors border border-teal-500/20"
                  >
                    Browse Product Catalog
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 text-xs text-red-300 hover:text-red-200 transition-colors pt-1"
                  >
                    Switch Account / Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Header Title */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-300 p-0.5 mx-auto shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-teal-400" />
                </div>
              </div>
              <h1 className="ui-h1 text-[28px] font-bold text-white tracking-tight pt-2">
                Welcome Back
              </h1>
              <p className="ui-caption text-[14px] text-slate-300">
                Sign in to your Smart Retail account to continue shopping or managing operations.
              </p>
            </div>

            {/* Alert Messages */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="ui-caption text-[14px] font-semibold text-slate-200 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="ui-caption text-[14px] font-semibold text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions sent to registered email.')}
                    className="ui-caption text-[12px] text-teal-300 hover:text-teal-200"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-teal-500/30 accent-teal-500 bg-navy-950 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="remember" className="ui-caption text-[13px] text-slate-300 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 text-navy-950" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Redirect Link */}
            <div className="pt-4 border-t border-teal-500/20 text-center ui-caption text-[14px] text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-teal-300 hover:text-teal-200 font-semibold underline underline-offset-4">
                Create Account
              </Link>
            </div>
              </>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
