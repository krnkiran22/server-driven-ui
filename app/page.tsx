'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getInstitutions } from '@/lib/api/institutions.api';
import { getPublishedPages } from '@/lib/api/pages.api';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Layout,
  FileText,
  ExternalLink,
  Bot,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Globe,
  Zap,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insts, publishedPages] = await Promise.all([
          getInstitutions(),
          getPublishedPages()
        ]);
        setInstitutions(insts);
        setPages(publishedPages);
      } catch (error) {
        console.error('Failed to fetch public data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Campus<span className="text-blue-600">Sync</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Features</a>
              <a href="#solutions" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Solutions</a>
              <a href="#directory" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">Digital Campus</a>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="rounded-full px-6 py-2.5 bg-gray-900 hover:bg-black text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-full px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-sm font-bold shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5 active:translate-y-0">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Modern Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative z-10 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Next-Gen University UI
                </div>
                <h1 className="text-6xl md:text-7xl font-sans font-black text-gray-900 leading-[1.05] mb-8 tracking-tighter">
                  Build your campus <br />
                  <span className="italic font-serif text-blue-600">in seconds,</span> not weeks.
                </h1>
                <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
                  Empower your faculty with the world's most advanced server-driven UI builder. Secure, lightning-fast, and completely custom.
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <Link href="/register">
                    <Button size="lg" className="rounded-full px-10 py-7 text-lg font-bold bg-gray-900 hover:bg-black shadow-2xl transition-all hover:scale-105">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="#directory">
                    <Button variant="outline" size="lg" className="rounded-full px-10 py-7 text-lg font-bold border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                      View Live Portfolio
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-black text-gray-900">500+</div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Institutions</div>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div>
                    <div className="text-2xl font-black text-gray-900">10k+</div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Pages</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[12px] border-white">
                  <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200"
                    alt="University Campus"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-blue-600/20 to-transparent" />
                </div>

                {/* Floating UI Elements */}
                <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-[240px] animate-bounce-slow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">Instant Deploy</div>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Changes reflect immediately without any build time or app store updates.
                  </p>
                </div>

                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold text-gray-800 tracking-tight">AI Optimised Content</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-50 -z-10" />
        </section>

        {/* Feature Grid with Real Images */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Engineered for Excellence</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                We've spent thousands of hours perfecting a platform that feels like magic but is built on solid engineering.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 group relative h-[500px] rounded-[2rem] overflow-hidden bg-gray-900 shadow-xl transition-all hover:scale-[1.01]">
                <img
                  src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?auto=format&fit=crop&q=80&w=800"
                  alt="Team Collaboration"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-10 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent">
                  <h3 className="text-2xl font-bold text-white mb-3">Enterprise Collaboration</h3>
                  <p className="text-gray-300 text-sm max-w-md">
                    Allow multiple departments to build their own sub-portals while maintaining global institution brand standards.
                  </p>
                </div>
              </div>

              <div className="group relative h-[500px] rounded-[2rem] overflow-hidden bg-blue-600 shadow-xl transition-all hover:scale-[1.01]">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
                  alt="Code"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-10 bg-linear-to-t from-blue-900/80 to-transparent">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Global Edge</h3>
                  <p className="text-blue-100 text-sm">
                    Pages served from nodes around the world with sub-100ms latency.
                  </p>
                </div>
              </div>

              <div className="group relative h-[500px] rounded-[2rem] overflow-hidden bg-purple-600 shadow-xl transition-all hover:scale-[1.01]">
                <div className="absolute inset-0 p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Military Grade Security</h3>
                    <p className="text-purple-100 text-sm">
                      SOC2 compliant, HIPAA ready, and encrypted at every layer. Your data is your own.
                    </p>
                    <div className="mt-6 flex gap-2">
                      <span className="w-12 h-1.5 bg-white/40 rounded-full" />
                      <span className="w-12 h-1.5 bg-white/10 rounded-full" />
                      <span className="w-12 h-1.5 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Directory - Real Life Display */}
        {pages.length > 0 && (
          <section id="directory" className="py-32 bg-gray-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 block">Institutional Network</span>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-none">The Digital Campus</h2>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">
                  Real-time directory of published faculty sections and department portals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {pages.map((page) => (
                  <Link key={page._id} href={`/${page.slug}`}>
                    <div className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(59,130,246,0.15)] transition-all duration-500 overflow-hidden">
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400&sig=${page._id}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                          alt="Layout"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-6 flex items-center gap-2">
                          <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 border border-white/20">
                            Published
                          </div>
                        </div>
                      </div>

                      <div className="p-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 capitalize group-hover:text-blue-600 transition-colors">{page.name || page.slug}</h3>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed mb-8 h-10 overflow-hidden line-clamp-2">
                          Adaptive server-driven UI experience for the {page.slug} portal.
                        </p>

                        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-gray-300" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Responsive</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600 font-bold text-sm tracking-tight opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            Visit Site <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Social Proof / Trust */}
        <section className="py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-12">Trusted by world leading institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-16 grayscale opacity-40">
              <div className="text-2xl font-black">STANFORD</div>
              <div className="text-2xl font-black">HARVARD</div>
              <div className="text-2xl font-black">MIT</div>
              <div className="text-2xl font-black">OXFORD</div>
              <div className="text-2xl font-black">YALE</div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 pb-20 border-b border-gray-100">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-gray-900">CampusSync</span>
              </div>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
                Creating the future of digital education interfaces through intelligent, server-driven dynamic UIs.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-semibold">Features</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-semibold">Dashboard</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-semibold">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-semibold">About Us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-semibold">Legal</a></li>
                <li><Link href="/login" className="text-gray-500 hover:text-blue-600 transition-colors font-semibold">Staff Login</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm">&copy; 2024 CampusSync Systems Inc. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Status Ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
