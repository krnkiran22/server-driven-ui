'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getInstitutions } from '@/lib/api/institutions.api';
import { getPublishedPages } from '@/lib/api/pages.api';
import { useAuth } from '@/lib/context/AuthContext';
import { Layout, FileText, ExternalLink, Bot, Sparkles, LayoutDashboard, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Bot className="w-8 h-8" />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
              AI Website Builder
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="text-sm flex items-center gap-2 rounded-xl">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-semibold">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="text-sm font-bold rounded-xl px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-blue-50/50 to-white pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8 border border-blue-100 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Revolutionizing Higher Ed Web
            </div>
            <h1 className="text-7xl font-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
              Design Your Future<br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">Instantly with AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              The first server-driven UI builder for universities. Describe your needs,
              and watch as our AI constructs your entire digital campus in seconds.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link href="/register">
                <Button size="lg" className="px-12 py-7 text-lg rounded-2xl shadow-2xl shadow-blue-200 bg-blue-600 hover:scale-105 transition-transform font-bold">
                  Start Building Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-12 py-7 text-lg rounded-2xl border-2 hover:bg-gray-50 transition-all font-bold">
                  Explore Components
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </section>

        {/* Dynamic Directory Section */}
        {pages.length > 0 && (
          <section className="bg-gray-50/50 py-24 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-3 flex items-center gap-3">
                    <Layout className="w-8 h-8 text-blue-600" />
                    Live Digital Campus
                  </h2>
                  <p className="text-gray-500 text-lg max-w-xl">
                    Discover interactive pages designed and published by our AI-powered institution dashboard.
                  </p>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold flex items-center gap-1.5 ring-1 ring-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {pages.length} Live Pages
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pages.slice(0, 6).map((page) => (
                  <Link key={page._id} href={`/${page.slug}`}>
                    <div className="group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] hover:border-blue-200 transition-all duration-500 hover:-translate-y-2">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors duration-500">
                          <FileText className="w-7 h-7 text-blue-600 group-hover:text-white" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <ArrowRight className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors capitalize">
                        {page.name || page.slug}
                      </h3>
                      <p className="text-base text-gray-500 leading-relaxed line-clamp-2">
                        Click to explore the AI-constructed dynamic experience for the {page.slug} portal.
                      </p>

                      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-500 transition-colors">
                          Exploration mode
                        </span>
                        <div className="flex -space-x-2">
                          {[1, 2].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                              <div className="w-full h-full bg-linear-to-br from-blue-100 to-indigo-100" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {pages.length > 6 && (
                <div className="mt-12 text-center">
                  <p className="text-gray-400 text-sm font-medium">And more digital sections available...</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Core Infrastructure</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Enterprise-grade tools built specifically for the unique needs of educational departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "🎨",
                bg: "bg-purple-50",
                title: "Visual Canvas",
                text: "Real-time drag and drop experience. No deployment needed, changes go live immediately via Server-Driven UI."
              },
              {
                icon: "🤖",
                bg: "bg-blue-50",
                title: "Conversational Design",
                text: "Talk to our AI to add sections, change styles, or generate content. It's like having a designer on call 24/7."
              },
              {
                icon: "🚀",
                bg: "bg-green-50",
                title: "Custom Components",
                text: "AI can generate entirely new, custom components on the fly and save them to your institutional library."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300">
                <div className={`w-20 h-20 ${feature.bg} rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-50 pb-12 mb-12">
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Bot className="w-8 h-8" />
              AI Website Builder
            </div>
            <nav className="flex gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
              <Link href="/login" className="hover:text-blue-600 transition-colors">Admin</Link>
              <Link href="/register" className="hover:text-blue-600 transition-colors">Start Building</Link>
            </nav>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm font-medium">
            <p>&copy; 2024 AI Website Builder. All Rights Reserved.</p>
            <div className="flex gap-6">
              <span className="text-green-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                System Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
