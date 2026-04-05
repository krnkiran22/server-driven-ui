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
  MoreVertical,
  X,
  Wand2,
  MousePointer2,
  ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';

// ── NEW PAGE MODAL ───────────────────────────────────────────────────────────
const NewPageModal = ({ 
  isOpen, 
  onClose, 
  onCreate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onCreate: (name: string, slug: string, mode: 'canvas' | 'ai') => void 
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [mode, setMode] = useState<'canvas' | 'ai'>('ai');

  useEffect(() => {
    if (name) {
      setSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [name]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create New Experience</h2>
            <p className="text-gray-500 font-medium">How would you like to build your new page?</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Experience Name</label>
              <input 
                autoFocus
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Computer Science Dept"
                className="w-full h-14 px-6 rounded-2xl border-gray-100 bg-gray-50/50 text-gray-900 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Public Slug</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">/</span>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full h-14 pl-10 pr-6 rounded-2xl border-gray-100 bg-gray-50/50 text-gray-900 font-mono text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setMode('ai')}
              className={`relative p-8 rounded-[2rem] border-2 text-left transition-all group ${
                mode === 'ai' ? 'border-blue-600 bg-blue-50/30 ring-4 ring-blue-500/5' : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                mode === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'
              }`}>
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Full Build</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Describe your campus or department and let AI architect the whole landing page instantly.</p>
              {mode === 'ai' && <div className="absolute top-6 right-6 w-3 h-3 bg-blue-600 rounded-full animate-pulse" />}
            </button>

            <button 
              onClick={() => setMode('canvas')}
              className={`relative p-8 rounded-[2rem] border-2 text-left transition-all group ${
                mode === 'canvas' ? 'border-violet-600 bg-violet-50/30 ring-4 ring-violet-500/5' : 'border-gray-100 hover:border-violet-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                mode === 'canvas' ? 'bg-violet-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-500'
              }`}>
                <MousePointer2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Canvas</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Start with a blank canvas and drag-and-drop components to build your interface manually.</p>
              {mode === 'canvas' && <div className="absolute top-6 right-6 w-3 h-3 bg-violet-600 rounded-full animate-pulse" />}
            </button>
          </div>
        </div>

        <div className="p-8 bg-gray-50/50 flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!name || !slug}
            onClick={() => onCreate(name, slug, mode)}
            className="h-14 px-10 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center gap-3 shadow-xl transition-all hover:-translate-y-0.5"
          >
            Assemble Experience
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [fetchingPages, setFetchingPages] = useState(true);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
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

  const handleCreatePage = async (name: string, slug: string, mode: 'canvas' | 'ai') => {
    try {
      // For Canvas mode, we set useHtml = false
      // For AI mode, we'll initialize it and then probably trigger generation in the editor
      // or we can allow the user to decide later.
      // But based on the request, 'End to end' should go to AI builder.
      const newPage = await pagesApi.createPage({ 
        name, 
        slug, 
        useHtml: mode === 'ai' 
      });
      setPages([...pages, newPage]);
      toast.success('Page created successfully');
      setShowNewPageModal(false);
      
      // Navigate to editor with mode as a param to trigger prompt automatically
      const targetUrl = mode === 'ai' 
        ? `/edit/${slug}?init=ai` 
        : `/edit/${slug}`;
      router.push(targetUrl);
    } catch (error: any) {
      console.error('Failed to create page:', error);
      if (error.response?.status === 409) {
        toast.error('A page with this slug already exists. Please try a different slug.');
      } else {
        toast.error('Failed to create page. Please try again.');
      }
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
              onClick={() => setShowNewPageModal(true)}
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
                <h3 className="text-xl font-bold mb-2">AI Architect</h3>
                <p className="text-blue-100/80 text-sm leading-relaxed mb-8">Ready to evolve your digital presence? Summon the AI architect to build something new.</p>
                <button 
                  onClick={() => setShowNewPageModal(true)}
                  className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-colors"
                >
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
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                            page.useHtml ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'
                          }`}>
                            {page.useHtml ? <Bot className="w-6 h-6" /> : <Layout className="w-6 h-6" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{page.name}</h3>
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-md ring-1 ring-green-200">Live</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{page.useHtml ? 'AI Full Build' : 'Visual Canvas'}</span>
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
                          <Link
                            href={`/${page.slug}`}
                            className="h-12 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-white text-sm font-bold transition-all shadow-sm hover:shadow-blue-200 hover:-translate-y-0.5"
                            title="Play / Preview"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Play
                          </Link>
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
                    <Button onClick={() => setShowNewPageModal(true)} className="rounded-2xl h-14 px-10">Start First Build</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <NewPageModal 
        isOpen={showNewPageModal} 
        onClose={() => setShowNewPageModal(false)}
        onCreate={handleCreatePage}
      />
    </div>
  );
}
