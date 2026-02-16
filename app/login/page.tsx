'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { toast } from 'sonner';
import { Bot, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">Campus<span className="text-blue-600">Sync</span></span>
            </Link>
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 font-medium">Access your institutional dashboard and visual editor.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@institution.edu"
                required
                className="h-14 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</a>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-14 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-blue-500 transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-base shadow-xl transition-all hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            New to the platform?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold">
              Create an account
            </Link>
          </p>

          <div className="mt-20 pt-8 border-t border-gray-50 flex items-center justify-center gap-8 grayscale opacity-40">
            <ShieldCheck className="w-5 h-5" />
            <Lock className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Enterprise SSL Secured</span>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Aesthetic */}
      <div className="hidden lg:block flex-1 relative bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200"
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/20 to-transparent" />

        <div className="absolute bottom-20 left-20 right-20 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Verified Platform
          </div>
          <h2 className="text-4xl font-black mb-6 leading-tight tracking-tight">The smart way to build institutional portals.</h2>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold opacity-80">Joined by 2,000+ staff members this month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
