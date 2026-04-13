'use client';

import React, { useEffect, useState, use } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { ComponentMapper } from '@/components/renderer/ComponentMapper';
import * as pagesApi from '@/lib/api/pages.api';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { Container } from '@/components/builder-components/Container';
import { Edit3 } from 'lucide-react';
import { Page } from '@/lib/types/page.types';
import { SafeHTMLRenderer } from '@/components/editor/SafeHTMLRenderer';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ── Renders AI-generated HTML in a perfectly isolated full-page viewport ─────
// Navigation links inside the iframe are intercepted by SafeHTMLRenderer's
// script and sent to window.top so the full Next.js app navigates properly.
const FullPageRenderer = ({ html }: { html: string }) => (
    <div className="fixed inset-0 w-screen h-screen bg-white overflow-hidden">
        <SafeHTMLRenderer html={html} fullPage className="w-full h-full" />
    </div>
);

export default function DynamicPage({ params }: PageProps) {
    const { slug } = use(params);
    const { user, isLoading: authLoading } = useAuth();
    const [pageData, setPageData] = useState<any>(null);
    const [allPages, setAllPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        // Reset immediately so the old page never flashes while the new one loads
        setLoading(true);
        setPageData(null);

        const fetchData = async () => {
            try {
                const data = await pagesApi.getPageBySlug(slug, user?.institutionId as string || '');
                setPageData(data);
                // Only fetch all pages for block-mode (HTML pages have their own navbar)
                if (!data?.useHtml) {
                    const pages = user
                        ? await pagesApi.getAllPages()
                        : await pagesApi.getPublishedPages(undefined);
                    setAllPages(pages);
                }
            } catch (error) {
                console.error('Failed to fetch page:', error);
                toast.error('Page not found');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, user, authLoading]);

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
        return <FullPageRenderer html={pageData.htmlContent} />;
    }

    // ── Admin shortcut to block editor ───────────────────────────────────────
    if (isAdmin && !pageData?.jsonConfig?.ROOT) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto">
                        <Edit3 className="w-8 h-8 text-violet-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Open in Editor</h2>
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
        </div>
    );
}
