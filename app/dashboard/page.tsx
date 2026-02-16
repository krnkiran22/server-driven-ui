'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import * as pagesApi from '@/lib/api/pages.api';
import { Page } from '@/lib/types/page.types';
import { toast } from 'sonner';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Institution Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your website and institution users.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => logout()}
              className="bg-white border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Your Pages</h2>
                {(user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'editor') && (
                  <button
                    onClick={handleCreatePage}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                  >
                    Create New Page
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-50">
                {fetchingPages ? (
                  <div className="p-10 text-center text-gray-400 italic">Fetching your pages...</div>
                ) : pages.length > 0 ? (
                  pages.map((page) => (
                    <div key={page._id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-900">{page.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">/{page.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        {(user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'editor') && (
                          <Link
                            href={`/edit/${page.slug}`}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                          >
                            Edit
                          </Link>
                        )}
                        <a
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                        >
                          View Live
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any pages yet.</p>
                    <button
                      onClick={handleCreatePage}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Start by creating your first page
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Stats</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Current Role</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                  <p className="text-lg font-bold text-green-600">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white">
              <h2 className="text-xl font-bold mb-2">Need Help?</h2>
              <p className="text-blue-100 mb-6 text-sm">Our AI can help you generate content or structure your pages.</p>
              <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-md">
                Chat with Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
