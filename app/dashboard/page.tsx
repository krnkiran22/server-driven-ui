'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import * as pagesApi from '@/lib/api/pages.api';
import { Page } from '@/lib/types/page.types';
import { toast } from 'sonner';
import {
  Plus,
  ExternalLink,
  FileEdit,
  LogOut,
  Layout,
  Activity,
  Shield,
  Bot,
  Sparkles,
  Search,
  MoreVertical
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [fetchingPages, setFetchingPages] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const data = await pagesApi.getAllPages();
        setPages(data);
      } catch (error) {
        console.error('Failed to fetch pages:', error);
      } finally {
        setFetchingPages(false);
      }
    };

    if (user) {
      fetchPages();
    }
  }, [user]);

  const handleCreatePage = async () => {
    const name = window.prompt('Enter page name:');
    if (!name) return;
    const slug = window.prompt('Enter page slug:', name.toLowerCase().replace(/\s+/g, '-'));
    if (!slug) return;

    try {
      const newPage = await pagesApi.createPage({ name, slug });
      setPages([...pages, newPage]);
      toast.success('Page created successfully');
      router.push(`/edit/${slug}`);
    } catch (error) {
      console.error('Failed to create page:', error);
      toast.error('Failed to create page');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-gray-900 uppercase">Campus<span className="text-blue-600">Sync</span></span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-black text-gray-900">{user?.name}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role}</span>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <button
                onClick={() => logout()}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Dashboard Title & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ecosystem Overview</h1>
            <p className="text-gray-500 font-medium">Manage your institutional pages and dynamic interfaces.</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'editor') && (
            <Button
              onClick={handleCreatePage}
              className="rounded-2xl h-14 px-8 bg-gray-900 hover:bg-black text-white font-bold flex items-center gap-2 shadow-xl shadow-gray-200 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Build New Experience
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Node Status</h3>
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Pages</p>
                  <p className="text-2xl font-black text-gray-900">{pages.length}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Security Level</p>
                  <p className="text-sm font-bold text-blue-600 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> High / Encrypted
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-white/30 mb-6" />
                <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
                <p className="text-blue-100/80 text-sm leading-relaxed mb-8">Need to generate a new department section? Talk to our AI architect.</p>
                <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-colors">
                  Start AI Design Session
                </button>
              </div>
              <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>

          {/* Main List Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xs overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Active Experiences</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter pages..."
                    className="h-10 pl-9 pr-4 rounded-xl border-gray-100 text-sm focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {fetchingPages ? (
                  <div className="p-20 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : pages.length > 0 ? (
                  pages.map((page) => (
                    <div key={page._id} className="p-8 hover:bg-gray-50 transition-all duration-300 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Layout className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{page.name}</h3>
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-md ring-1 ring-green-200">Live</span>
                              <span className="text-xs font-mono text-gray-400 tracking-tighter hover:text-blue-600 cursor-pointer transition-colors">/{page.slug}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {(user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'editor') && (
                            <Link
                              href={`/edit/${page.slug}`}
                              className="h-12 px-6 rounded-xl bg-white border border-gray-100 text-gray-900 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 hover:shadow-sm transition-all shadow-xs"
                            >
                              <FileEdit className="w-4 h-4 text-blue-600" />
                              Configure UI
                            </Link>
                          )}
                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                            title="View Live"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                          <button className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center">
                    <Layout className="w-12 h-12 text-gray-100 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-gray-900 mb-2">No experiences yet.</h3>
                    <p className="text-gray-400 font-medium mb-10">Your digital campus is a blank canvas. Start building now.</p>
                    <Button onClick={handleCreatePage} className="rounded-2xl h-14 px-10">Start First Build</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
