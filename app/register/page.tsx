'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { toast } from 'sonner';
import { Bot, ArrowRight, Sparkles, Building2, UserCircle2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subdomain: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        subdomain: formData.subdomain,
      });
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side - Info */}
      <div className="hidden lg:block w-[40%] relative bg-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200"
          alt="University"
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-b from-blue-600/20 to-gray-900/90" />

        <div className="absolute inset-0 p-16 flex flex-col justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Campus<span className="text-blue-500">Sync</span></span>
            </Link>
          </div>

          <div className="text-white">
            <h2 className="text-5xl font-black mb-10 leading-tight tracking-tighter">Join the elite network of digital campuses.</h2>
            <div className="space-y-8">
              {[
                { title: "No-Code Builder", desc: "Design interfaces using our advanced visual editor." },
                { title: "Server-Driven UI", desc: "Update your site in real-time across all platforms." },
                { title: "AI Generation", desc: "Use AI to construct complex sections in seconds." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100">{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Trusted By 500+ Global Institutions</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-start py-12 px-8 sm:px-12 lg:px-24 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          <div className="mb-12">
            <Link href="/login" className="lg:hidden inline-flex items-center gap-2 mb-8 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-gray-900">CampusSync</span>
            </Link>
            <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create your institution.</h1>
            <p className="text-gray-500 font-medium">Start building your digital portal today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> Institution Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Stanford University"
                  required
                  className="h-12 rounded-xl border-gray-100 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Subdomain
                </label>
                <div className="relative">
                  <Input
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    placeholder="stanford"
                    required
                    className="h-12 rounded-xl border-gray-100 focus:border-blue-500 pr-24"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                    .campussync.io
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <UserCircle2 className="w-3 h-3" /> Administrator Email
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@institution.edu"
                required
                className="h-12 rounded-xl border-gray-100 focus:border-blue-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl border-gray-100 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirm Password</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl border-gray-100 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <p className="text-[10px] text-blue-600 leading-relaxed font-bold">
                <Sparkles className="w-3 h-3 inline mr-1" />
                By registering, you'll get instant access to our Super-Admin dashboard and high-performance server-driven UI architecture.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-base shadow-xl transition-all hover:scale-[1.02]"
            >
              {isLoading ? 'Intializing Ecosystem...' : 'Complete Institutional Registration'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Member of another campus?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
