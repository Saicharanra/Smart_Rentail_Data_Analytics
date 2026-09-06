'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone: phone || undefined,
          address: address || undefined,
          city: city || undefined,
          state: state || undefined,
          postalCode: postalCode || undefined,
          country: 'USA',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.data?.token) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
      }

      setSuccessMsg('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        if (role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/shop');
        }
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern">
        {/* Ambient Teal Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-teal-500/10 rounded-full blur-[170px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl space-y-6 relative z-10"
        >
          <div className="bg-navy-900/90 border border-teal-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-300 p-0.5 mx-auto shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-teal-400" />
                </div>
              </div>
              <h1 className="ui-h1 text-[28px] font-bold text-white tracking-tight pt-2">
                Create Account
              </h1>
              <p className="ui-caption text-[14px] text-slate-300">
                Join Smart Retail to access premium hardware catalog, order tracking, and BI dashboards.
              </p>
            </div>

            {/* Account Role Selector */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-navy-950 rounded-2xl border border-teal-500/20">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2.5 px-4 rounded-xl ui-caption text-[14px] font-semibold transition-all flex items-center justify-center gap-2 ${
                  role === 'CUSTOMER'
                    ? 'bg-teal-500 text-navy-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" /> Customer Account
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-2.5 px-4 rounded-xl ui-caption text-[14px] font-semibold transition-all flex items-center justify-center gap-2 ${
                  role === 'ADMIN'
                    ? 'bg-teal-500 text-navy-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal Role
              </button>
            </div>

            {/* Alert Banners */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="ui-caption text-[14px] font-semibold text-slate-200 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="ui-caption text-[14px] font-semibold text-slate-200 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="alex.morgan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="ui-caption text-[14px] font-semibold text-slate-200 block">
                    Password (8+ characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
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

                {/* Optional Phone */}
                <div className="space-y-1.5">
                  <label className="ui-caption text-[14px] font-semibold text-slate-200 block">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Optional City */}
                <div className="space-y-1.5">
                  <label className="ui-caption text-[14px] font-semibold text-slate-200 block">
                    City (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Seattle"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    Complete Registration <ArrowRight className="w-5 h-5 text-navy-950" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Redirect Link */}
            <div className="pt-4 border-t border-teal-500/20 text-center ui-caption text-[14px] text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-300 hover:text-teal-200 font-semibold underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
