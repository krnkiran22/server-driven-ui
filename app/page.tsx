'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getInstitutions } from '@/lib/api/institutions.api';
import { getPublishedPages } from '@/lib/api/pages.api';
import { useAuth } from '@/lib/context/AuthContext';
import { Layout, FileText, ExternalLink, Bot, Sparkles, LayoutDashboard } from 'lucide-react';

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
          getPublishedPages() // Fetch all pages globally
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

  // If there are published pages, show them as the primary view
  if (pages.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {institutions[0]?.name || 'Institution'} Portal
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="text-sm flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="text-sm">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Welcome to our <span className="text-blue-600">Digital Campus</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our latest updates, departments, and resources curated for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pages.map((page) => (
              <Link key={page._id} href={`/${page.slug}`}>
                <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                      <FileText className="w-6 h-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors capitalize">
                    {page.name || page.slug}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    Click to view the live dynamic content for the {page.slug} section.
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-400 transition-colors">
                      View Page
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="bg-white border-t py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-400">
              Powered by AI Website Builder &copy; 2024
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Default Landing Page (if no pages exist yet)
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Bot className="w-7 h-7" />
            AI Website Builder
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8">
            <Sparkles className="w-4 h-4" />
            Empowering Institutions with AI
          </div>
          <h1 className="text-7xl font-black text-gray-900 mb-8 tracking-tight">
            Design Your Future<br />
            <span className="text-blue-600">Instantly with AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The first server-driven UI builder for universities. Describe your needs,
            and watch as our AI constructs your entire digital campus in seconds.
          </p>

          <div className="flex justify-center space-x-6">
            <Link href="/register">
              <Button size="lg" className="px-12 py-6 text-lg rounded-2xl shadow-xl shadow-blue-200">
                Start Building Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-12 py-6 text-lg rounded-2xl">
                Open Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-2">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🎨</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Visual Canvas</h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time drag and drop experience. No deployment needed, changes go live immediately via Server-Driven UI.
            </p>
          </div>

          <div className="p-2">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🤖</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Conversational Design</h3>
            <p className="text-gray-600 leading-relaxed">
              Talk to our AI to add sections, change styles, or generate content. It's like having a designer on call 24/7.
            </p>
          </div>

          <div className="p-2">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🚀</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Custom Components</h3>
            <p className="text-gray-600 leading-relaxed">
              AI can generate entirely new, custom components on the fly and save them to your institutional library.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
