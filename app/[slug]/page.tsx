'use client';

import React, { useEffect, useState, use } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { ComponentMapper } from '@/components/renderer/ComponentMapper';
import * as pagesApi from '@/lib/api/pages.api';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { Container } from '@/components/builder-components/Container';
import { Edit3, ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react';
import { Page } from '@/lib/types/page.types';
import { useRouter } from 'next/navigation';

interface PageProps {
    params: Promise<{ slug: string }>;
}

import { SafeHTMLRenderer } from '@/components/editor/SafeHTMLRenderer';

// ── Multi-page navigation bar ─────────────────────────────────────────────────
const PageNavigator = ({
    pages,
    currentSlug,
    isAdmin,
}: {
    pages: Page[];
    currentSlug: string;
    isAdmin: boolean;
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const currentIndex = pages.findIndex((p) => p.slug === currentSlug);
    const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
    const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

    if (pages.length === 0) return null;

    return (
        <>
            {/* Floating bottom navigation bar */}
            <div
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {/* Previous page */}
                <button
                    onClick={() => prevPage && router.push(`/${prevPage.slug}`)}
                    disabled={!prevPage}
                    title={prevPage ? `Previous: ${prevPage.name}` : 'No previous page'}
                    className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-widest px-4 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/10"
                >
                    <ChevronLeft className="w-4 h-4" />
                    {prevPage ? prevPage.name.slice(0, 12) : 'Prev'}
                </button>

                {/* Page switcher toggle */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl shadow-2xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 border border-blue-500"
                >
                    <LayoutGrid className="w-4 h-4" />
                    {pages.length} Pages
                </button>

                {/* Next page */}
                <button
                    onClick={() => nextPage && router.push(`/${nextPage.slug}`)}
                    disabled={!nextPage}
                    title={nextPage ? `Next: ${nextPage.name}` : 'No next page'}
                    className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-widest px-4 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/10"
                >
                    {nextPage ? nextPage.name.slice(0, 12) : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Admin edit button */}
                {isAdmin && (
                    <a
                        href={`/edit/${currentSlug}`}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl shadow-2xl shadow-violet-900/40 transition-all hover:scale-105 active:scale-95 border border-violet-500"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit
                    </a>
                )}
            </div>

            {/* Page switcher panel */}
            {open && (
                <div
                    className="fixed inset-0 z-[9998] flex items-end justify-center pb-24 px-4"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <span className="text-white font-black text-sm uppercase tracking-widest">All Pages</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto">
                            {pages.map((page, idx) => (
                                <a
                                    key={page._id}
                                    href={`/${page.slug}`}
                                    onClick={() => setOpen(false)}
                                    className={`flex flex-col gap-1 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                                        page.slug === currentSlug
                                            ? 'border-blue-500 bg-blue-600/20 text-white'
                                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                        Page {idx + 1}
                                    </span>
                                    <span className="text-sm font-bold truncate">{page.name}</span>
                                    <span className="text-[10px] font-mono text-white/30 truncate">/{page.slug}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ── Renders AI-generated HTML in a perfectly isolated full-page viewport ─────
const FullPageRenderer = ({
    html,
    slug,
    isAdmin,
    allPages,
}: {
    html: string;
    slug: string;
    isAdmin: boolean;
    allPages: Page[];
}) => {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-white overflow-hidden flex flex-col">
            <SafeHTMLRenderer
                html={html}
                fullPage
                className="flex-1 w-full h-full"
            />
            <PageNavigator pages={allPages} currentSlug={slug} isAdmin={isAdmin} />
        </div>
    );
};

export default function DynamicPage({ params }: PageProps) {
    const { slug } = use(params);
    const { user, isLoading: authLoading } = useAuth();
    const [pageData, setPageData] = useState<any>(null);
    const [allPages, setAllPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [data, pages] = await Promise.all([
                    pagesApi.getPageBySlug(slug, user?.institutionId as string || ''),
                    user
                        ? pagesApi.getAllPages()
                        : pagesApi.getPublishedPages(user?.institutionId),
                ]);
                setPageData(data);
                setAllPages(pages);
            } catch (error) {
                console.error('Failed to fetch page:', error);
                toast.error('Page not found');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [slug, user, authLoading]);

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    <p className="text-gray-500 font-medium">Loading your website...</p>
                </div>
            </div>
        );
    }

    const isAdmin = !!(user && (user.role === 'admin' || user.role === 'editor' || user.role === 'super-admin'));

    // ── HTML mode (AI-generated full page) ───────────────────────────────────
    if (pageData?.useHtml && pageData?.htmlContent) {
        return (
            <FullPageRenderer
                html={pageData.htmlContent}
                slug={slug}
                isAdmin={isAdmin}
                allPages={allPages}
            />
        );
    }

    // ── Admin block editor view ───────────────────────────────────────────────
    if (isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto">
                        <Edit3 className="w-8 h-8 text-violet-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Open in Editor</h2>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        This page uses the visual block editor. Click below to open the full editor.
                    </p>
                    <a
                        href={`/edit/${slug}`}
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105"
                    >
                        <Edit3 className="w-4 h-4" />
                        Open Editor
                    </a>
                </div>
            </div>
        );
    }

    // ── Public CraftJS block view ─────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white">
            <Editor enabled={false} resolver={ComponentMapper}>
                <Frame data={pageData?.jsonConfig?.ROOT ? JSON.stringify(pageData.jsonConfig) : undefined}>
                    <Element is={Container} canvas />
                </Frame>
            </Editor>
            <PageNavigator pages={allPages} currentSlug={slug} isAdmin={isAdmin} />
        </div>
    );
}
